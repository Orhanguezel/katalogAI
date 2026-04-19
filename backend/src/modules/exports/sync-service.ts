// src/modules/exports/sync-service.ts
//
// "Kaydet" sonrasi (catalog create/update) tetiklenen full-data sync.
//
//   - target_source_id NULL ise no-op.
//   - Kaynak aktif degilse no-op.
//   - catalog_library_refs lookup ile UPSERT (duplicate library row olusmaz).
//   - library + library_i18n alanlarini DOLDURUR (name, slug, description,
//     meta_title, meta_description, tags, image_url, featured_image).
//   - PDF: opts.includePdf=true ise render edilir + library_files UPSERT.
//     opts.includePdf=false varsayilan (sadece metadata; daha hizli).
//   - is_published HIC degistirilmez — admin manuel onaylar.
//   - Hata firlatmaz; caller best-effort cagirir.

import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { and, asc, eq } from 'drizzle-orm';

import {
  library,
  libraryFiles,
  libraryI18n,
} from '@agro/shared-backend/modules/library/schema';

import { db as masterDb } from '@/db/client';
import {
  catalogLibraryRefs,
  catalogPageItems,
  catalogPages,
  catalogs,
  type Catalog,
  type CatalogPage,
  type CatalogPageItem,
} from '@/modules/catalogs/schema';
import { productSources, type ProductSource } from '@/modules/productSources/schema';
import { getSourceConnection } from '@/modules/productSources/pool-manager';
import { renderPdf } from './pdf-renderer';
import { buildCatalogHtml } from './pdf-template';

export type SyncAction = 'noop' | 'insert' | 'update';

export interface SyncResult {
  ok: boolean;
  action: SyncAction;
  library_id?: string;
  pdf_url?: string;
  reason?: string;
  error?: string;
}

export interface SyncOptions {
  /** PDF render + library_files UPSERT yapilsin mi? Default false (sadece metadata). */
  includePdf?: boolean;
}

function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[ışğçüöĞŞÇÜÖİ]/g, (ch) => {
      const map: Record<string, string> = {
        ı: 'i', ş: 's', ğ: 'g', ç: 'c', ü: 'u', ö: 'o',
        Ğ: 'g', Ş: 's', Ç: 'c', Ü: 'u', Ö: 'o', İ: 'i',
      };
      return map[ch] ?? ch;
    })
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 200);
  return base || 'katalog';
}

function pickCoverUrl(catalog: Catalog): string | null {
  return catalog.cover_image_url || catalog.logo_url || null;
}

interface CatalogMetadata {
  description: string;
  meta_title: string;
  meta_description: string;
  tags: string;
  productCount: number;
  pageCount: number;
}

function deriveMetadata(catalog: Catalog, items: CatalogPageItem[]): CatalogMetadata {
  const title = catalog.title || 'Katalog';
  const brand = catalog.brand_name || '';
  const season = catalog.season || '';
  const productCount = items.length;
  const pageCount = catalog.page_count || 0;

  const categorySet = new Set<string>();
  for (const it of items) {
    const c = (it.snapshot_category_name || '').trim();
    if (c) categorySet.add(c);
  }
  const categories = Array.from(categorySet).slice(0, 8);

  const descriptionParts: string[] = [];
  if (brand) descriptionParts.push(brand);
  if (season) descriptionParts.push(season);
  if (productCount > 0) descriptionParts.push(`${productCount} urun`);
  if (categories.length) descriptionParts.push(categories.join(', '));
  const description = descriptionParts.join(' · ').slice(0, 1000);

  const meta_title = brand ? `${title} | ${brand}` : title;
  const meta_description = (season || brand)
    ? `${title}${brand ? ' - ' + brand : ''}${season ? ' (' + season + ')' : ''}`
    : title;
  const tags = categories.slice(0, 6).join(',').slice(0, 255);

  return { description, meta_title, meta_description, tags, productCount, pageCount };
}

async function persistPdfToLocalStorage(pdfBuffer: Buffer, filenameBase: string): Promise<string> {
  const root = process.env.LOCAL_STORAGE_ROOT;
  const baseUrl = process.env.LOCAL_STORAGE_BASE_URL;
  if (!root || !baseUrl) {
    throw new Error('LOCAL_STORAGE_ROOT veya LOCAL_STORAGE_BASE_URL env tanimsiz');
  }
  const dir = path.join(root, 'catalogs');
  await mkdir(dir, { recursive: true });
  const filename = `${filenameBase}.pdf`;
  const filePath = path.join(dir, filename);
  await writeFile(filePath, pdfBuffer);
  return `${baseUrl.replace(/\/+$/, '')}/catalogs/${filename}`;
}

async function loadCatalog(catalogId: string): Promise<Catalog | null> {
  const [row] = await masterDb.select().from(catalogs).where(eq(catalogs.id, catalogId)).limit(1);
  return row ?? null;
}

async function loadCatalogPagesAndItems(catalogId: string): Promise<{
  pages: CatalogPage[];
  items: CatalogPageItem[];
}> {
  const pages = await masterDb
    .select()
    .from(catalogPages)
    .where(eq(catalogPages.catalog_id, catalogId))
    .orderBy(asc(catalogPages.page_number));
  const items: CatalogPageItem[] = [];
  for (const p of pages) {
    const rows = await masterDb
      .select()
      .from(catalogPageItems)
      .where(eq(catalogPageItems.page_id, p.id));
    items.push(...rows);
  }
  return { pages, items };
}

async function loadSource(sourceId: string): Promise<ProductSource | null> {
  const [row] = await masterDb.select().from(productSources).where(eq(productSources.id, sourceId)).limit(1);
  return row ?? null;
}

async function findRef(catalogId: string, sourceId: string) {
  const [row] = await masterDb
    .select()
    .from(catalogLibraryRefs)
    .where(and(eq(catalogLibraryRefs.catalog_id, catalogId), eq(catalogLibraryRefs.source_id, sourceId)))
    .limit(1);
  return row ?? null;
}

/**
 * Catalog'u hedef library tablosuna senkronize eder.
 *   - opts.includePdf=true → PDF de render edilir + library_files UPSERT.
 *   - Hata yutar (best-effort).
 */
export async function syncCatalogToTarget(
  catalogId: string,
  opts: SyncOptions = {},
): Promise<SyncResult> {
  try {
    const catalog = await loadCatalog(catalogId);
    if (!catalog) return { ok: false, action: 'noop', reason: 'catalog_bulunamadi' };
    if (!catalog.target_source_id) return { ok: true, action: 'noop', reason: 'hedef_atanmadi' };

    const source = await loadSource(catalog.target_source_id);
    if (!source) return { ok: false, action: 'noop', reason: 'kaynak_bulunamadi' };
    if (source.is_active !== 1) return { ok: false, action: 'noop', reason: 'kaynak_pasif' };
    if (source.source_type !== 'database') return { ok: false, action: 'noop', reason: 'kaynak_database_tipi_degil' };

    const { drizzle: targetDb } = getSourceConnection({
      id: source.id,
      db_host: source.db_host ?? '',
      db_port: source.db_port ?? 3306,
      db_name: source.db_name ?? '',
      db_user: source.db_user ?? '',
      db_password: source.db_password ?? '',
      connection_limit: source.connection_limit ?? 5,
    });

    const { items } = await loadCatalogPagesAndItems(catalog.id);
    const meta = deriveMetadata(catalog, items);
    const cover = pickCoverUrl(catalog);
    const locale = catalog.locale || 'tr';
    const ref = await findRef(catalog.id, source.id);

    let libraryId: string;
    let action: SyncAction;

    if (ref) {
      libraryId = ref.library_id;
      action = 'update';
      await targetDb
        .update(library)
        .set({ image_url: cover, featured_image: cover })
        .where(eq(library.id, libraryId));
      await targetDb
        .update(libraryI18n)
        .set({
          name: catalog.title,
          description: meta.description || null,
          meta_title: meta.meta_title || null,
          meta_description: meta.meta_description || null,
          tags: meta.tags || null,
        })
        .where(and(eq(libraryI18n.library_id, libraryId), eq(libraryI18n.locale, locale)));
    } else {
      libraryId = crypto.randomUUID();
      const i18nId = crypto.randomUUID();
      const refId = crypto.randomUUID();
      const baseSlug = slugify(catalog.slug || catalog.title);
      const localeSlug = `${baseSlug}-${libraryId.slice(0, 8)}`;

      await targetDb.insert(library).values({
        id: libraryId,
        type: 'catalog',
        category_id: null,
        sub_category_id: null,
        featured: 0,
        is_published: 0,
        is_active: 1,
        display_order: 0,
        featured_image: cover,
        image_url: cover,
        image_asset_id: null,
        views: 0,
        download_count: 0,
        published_at: null,
      });
      await targetDb.insert(libraryI18n).values({
        id: i18nId,
        library_id: libraryId,
        locale,
        slug: localeSlug,
        name: catalog.title,
        description: meta.description || null,
        meta_title: meta.meta_title || null,
        meta_description: meta.meta_description || null,
        tags: meta.tags || null,
      });
      await masterDb.insert(catalogLibraryRefs).values({
        id: refId,
        catalog_id: catalog.id,
        source_id: source.id,
        library_id: libraryId,
      });
      action = 'insert';
    }

    let pdfUrl: string | undefined;
    if (opts.includePdf) {
      try {
        const fullCatalog = { ...catalog, pages: [] } as Catalog & { pages: unknown[] };
        // pdf-template tum sayfa+items yapisini bekliyor; loadCatalogPagesAndItems
        // ile zaten cektik. Yeniden sekille:
        const { pages: rawPages } = await loadCatalogPagesAndItems(catalog.id);
        const pagesWithItems = rawPages.map((p) => ({
          ...p,
          items: items.filter((it) => it.page_id === p.id),
        }));
        const html = buildCatalogHtml({ ...fullCatalog, pages: pagesWithItems } as never);
        const pdfBuffer = await renderPdf({ html });
        const stamp = Date.now().toString(36);
        const baseSlug = slugify(catalog.slug || catalog.title);
        pdfUrl = await persistPdfToLocalStorage(pdfBuffer, `${baseSlug}-${stamp}`);

        const existing = await targetDb
          .select()
          .from(libraryFiles)
          .where(and(eq(libraryFiles.library_id, libraryId), eq(libraryFiles.mime_type, 'application/pdf')))
          .limit(1);
        const fileName = `${catalog.title}.pdf`;

        if (existing.length > 0) {
          await targetDb
            .update(libraryFiles)
            .set({
              file_url: pdfUrl,
              name: fileName,
              size_bytes: pdfBuffer.length,
              mime_type: 'application/pdf',
            })
            .where(eq(libraryFiles.id, existing[0].id));
        } else {
          await targetDb.insert(libraryFiles).values({
            id: crypto.randomUUID(),
            library_id: libraryId,
            asset_id: null,
            file_url: pdfUrl,
            name: fileName,
            size_bytes: pdfBuffer.length,
            mime_type: 'application/pdf',
            display_order: 0,
            is_active: 1,
          });
        }
      } catch (pdfErr) {
        // PDF basarisiz oldu ama metadata yazildi — uyari logu, ama hata fırlatma.
        const message = pdfErr instanceof Error ? pdfErr.message : 'pdf_render_failed';
        return { ok: true, action, library_id: libraryId, error: `pdf_failed: ${message}` };
      }
    }

    return { ok: true, action, library_id: libraryId, pdf_url: pdfUrl };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown_error';
    return { ok: false, action: 'noop', error: message };
  }
}
