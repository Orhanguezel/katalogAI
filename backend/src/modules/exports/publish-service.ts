// src/modules/exports/publish-service.ts
//
// Bir KatalogAI kataloğunu hedef proje DB'lerine (BereketFide / VistaSeeds vb.)
// `library` modülü altında **taslak** olarak kaydeder.
//
// Akış:
//   1. PDF buffer hazır gelir (renderPdf zaten yapılmış)
//   2. PDF, KatalogAI backend'in LOCAL_STORAGE_ROOT/catalogs/ klasörüne yazılır;
//      LOCAL_STORAGE_BASE_URL ile absolute URL üretilir.
//   3. Her hedef product_source için ayrı DB connection üzerinden 3 tabloya INSERT:
//        library         (type='catalog', is_published=0, is_active=1)
//        library_i18n    (locale, slug, name, description)
//        library_files   (file_url=PDF URL, mime='application/pdf')
//   4. Hedef bazlı sonuç array'i döner (her marka için ok/error).

import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { eq, inArray } from 'drizzle-orm';

import { library, libraryFiles, libraryI18n } from '@agro/shared-backend/modules/library/schema';

import { db as masterDb } from '@/db/client';
import { productSources, type ProductSource } from '@/modules/productSources/schema';
import { getSourceConnection } from '@/modules/productSources/pool-manager';
import type { Catalog } from '@/modules/catalogs/schema';

export interface PublishTargetResult {
  slug: string;
  name: string;
  ok: boolean;
  library_id?: string;
  error?: string;
}

export interface PublishResult {
  pdf_url: string;
  results: PublishTargetResult[];
}

function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[ışğçüöĞŞÇÜÖİ]/g, (ch) => {
      const map: Record<string, string> = { ı: 'i', ş: 's', ğ: 'g', ç: 'c', ü: 'u', ö: 'o', Ğ: 'g', Ş: 's', Ç: 'c', Ü: 'u', Ö: 'o', İ: 'i' };
      return map[ch] ?? ch;
    })
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 200);
  return base || 'katalog';
}

async function persistPdfToLocalStorage(
  pdfBuffer: Buffer,
  filenameBase: string,
): Promise<string> {
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

async function loadActiveDatabaseSourcesBySlug(slugs: string[]): Promise<ProductSource[]> {
  if (!slugs.length) return [];
  const rows = await masterDb
    .select()
    .from(productSources)
    .where(inArray(productSources.slug, slugs));
  return rows.filter((s) => s.is_active === 1 && s.source_type === 'database');
}

export async function publishCatalogToTargets(
  catalog: Catalog,
  pdfBuffer: Buffer,
  targetSlugs: string[],
): Promise<PublishResult> {
  const baseSlug = slugify(catalog.slug || catalog.title);
  const stamp = Date.now().toString(36);
  const pdfUrl = await persistPdfToLocalStorage(pdfBuffer, `${baseSlug}-${stamp}`);

  const sources = await loadActiveDatabaseSourcesBySlug(targetSlugs);
  const sourceBySlug = new Map(sources.map((s) => [s.slug, s] as const));

  const results: PublishTargetResult[] = [];

  for (const slug of targetSlugs) {
    const source = sourceBySlug.get(slug);
    if (!source) {
      results.push({ slug, name: slug, ok: false, error: 'kaynak_bulunamadi_veya_pasif' });
      continue;
    }
    try {
      const { drizzle: targetDb } = getSourceConnection({
        id: source.id,
        db_host: source.db_host ?? '',
        db_port: source.db_port ?? 3306,
        db_name: source.db_name ?? '',
        db_user: source.db_user ?? '',
        db_password: source.db_password ?? '',
        connection_limit: source.connection_limit ?? 5,
      });

      const libraryId = crypto.randomUUID();
      const i18nId = crypto.randomUUID();
      const fileId = crypto.randomUUID();
      const locale = catalog.locale || 'tr';
      const localeSlug = `${baseSlug}-${libraryId.slice(0, 8)}`;
      const cover = catalog.cover_image_url || catalog.logo_url || null;

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
        description: catalog.season ?? null,
      });

      await targetDb.insert(libraryFiles).values({
        id: fileId,
        library_id: libraryId,
        asset_id: null,
        file_url: pdfUrl,
        name: `${catalog.title}.pdf`,
        size_bytes: pdfBuffer.length,
        mime_type: 'application/pdf',
        display_order: 0,
        is_active: 1,
      });

      results.push({ slug: source.slug, name: source.name, ok: true, library_id: libraryId });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown_error';
      results.push({ slug: source.slug, name: source.name, ok: false, error: message });
    }
  }

  return { pdf_url: pdfUrl, results };
}

/** Yayına uygun tüm aktif `database` tipi kaynakları döner — UI default seçim için. */
export async function listPublishTargets(): Promise<Array<{ slug: string; name: string }>> {
  const rows = await masterDb
    .select({ slug: productSources.slug, name: productSources.name })
    .from(productSources)
    .where(eq(productSources.is_active, 1));
  return rows.map((r) => ({ slug: r.slug, name: r.name }));
}
