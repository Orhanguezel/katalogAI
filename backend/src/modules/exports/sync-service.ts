// src/modules/exports/sync-service.ts
//
// "Kaydet" sonrasi (catalog create/update) tetiklenen best-effort sync.
//
//   - Catalog'un `target_source_id` alani NULL ise no-op (henuz hedef secilmemis).
//   - Hedef product_source aktif degil veya database tipinde degilse no-op.
//   - `catalog_library_refs` lookup ile aynı catalog/source ikilisi icin
//     YENI library row OLUSTURMAZ; mevcut row'u UPDATE eder. Boylece her
//     kaydet'te hedef DB'de duplicate birikmez.
//   - PDF render ETMEZ; `library_files` ile uğrasmaz. PDF iliskisi
//     publishCatalogToTarget tarafindan, "Yayinla / PDF Indir" anında kurulur.
//   - Hata fırlatmaz; caller best-effort cağırır.

import { and, eq } from 'drizzle-orm';

import { library, libraryI18n } from '@agro/shared-backend/modules/library/schema';

import { db as masterDb } from '@/db/client';
import { catalogLibraryRefs, catalogs, type Catalog } from '@/modules/catalogs/schema';
import { productSources, type ProductSource } from '@/modules/productSources/schema';
import { getSourceConnection } from '@/modules/productSources/pool-manager';

export type SyncAction = 'noop' | 'insert' | 'update';

export interface SyncResult {
  ok: boolean;
  action: SyncAction;
  library_id?: string;
  reason?: string;
  error?: string;
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

async function loadCatalog(catalogId: string): Promise<Catalog | null> {
  const [row] = await masterDb.select().from(catalogs).where(eq(catalogs.id, catalogId)).limit(1);
  return row ?? null;
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
 * Catalog'u hedef library tablosuna senkronize eder. Kaydet sonrası
 * çağrılır. PDF üretmez. Hata yutar (best-effort).
 */
export async function syncCatalogToTarget(catalogId: string): Promise<SyncResult> {
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

    const ref = await findRef(catalog.id, source.id);
    const locale = catalog.locale || 'tr';
    const cover = pickCoverUrl(catalog);

    if (ref) {
      // UPDATE: library + library_i18n; library_files ve is_published'a dokunma.
      await targetDb
        .update(library)
        .set({ image_url: cover, featured_image: cover })
        .where(eq(library.id, ref.library_id));
      await targetDb
        .update(libraryI18n)
        .set({
          name: catalog.title,
          description: catalog.season ?? null,
        })
        .where(and(eq(libraryI18n.library_id, ref.library_id), eq(libraryI18n.locale, locale)));
      return { ok: true, action: 'update', library_id: ref.library_id };
    }

    // INSERT: yeni taslak library row.
    const libraryId = crypto.randomUUID();
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
      description: catalog.season ?? null,
    });
    await masterDb.insert(catalogLibraryRefs).values({
      id: refId,
      catalog_id: catalog.id,
      source_id: source.id,
      library_id: libraryId,
    });

    return { ok: true, action: 'insert', library_id: libraryId };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown_error';
    return { ok: false, action: 'noop', error: message };
  }
}
