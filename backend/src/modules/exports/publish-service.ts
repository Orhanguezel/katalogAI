// src/modules/exports/publish-service.ts
//
// Akış (yeni — MD'ye uygun):
//   1. Catalog yüklenir, target_source_id zorunlu.
//   2. catalog_library_refs lookup. Ref yoksa once syncCatalogToTarget()
//      ile taslak library row garantilenir.
//   3. PDF render edilir, LOCAL_STORAGE_ROOT/catalogs/'a yazilir, public URL.
//   4. Hedef DB'de library_files UPSERT (ref.library_id'e bağlı):
//        var → file_url, size_bytes, mime_type, name update
//        yok → INSERT
//   5. library.is_published DEĞİŞTİRİLMEZ — admin manuel onaylar.
//
// "Yayinla" butonu artik sadece PDF yukleme rolu oynar.

import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { and, eq } from 'drizzle-orm';

import { libraryFiles } from '@agro/shared-backend/modules/library/schema';

import { db as masterDb } from '@/db/client';
import { catalogLibraryRefs, catalogs, type Catalog } from '@/modules/catalogs/schema';
import { productSources, type ProductSource } from '@/modules/productSources/schema';
import { getSourceConnection } from '@/modules/productSources/pool-manager';
import { syncCatalogToTarget } from './sync-service';

export interface PublishResult {
  ok: boolean;
  pdf_url?: string;
  library_id?: string;
  action?: 'insert' | 'update';
  error?: string;
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

async function loadSource(sourceId: string): Promise<ProductSource | null> {
  const [row] = await masterDb.select().from(productSources).where(eq(productSources.id, sourceId)).limit(1);
  return row ?? null;
}

/**
 * PDF'i hedef library'ye baglar (UPSERT). Ref garantili olsun diye once
 * syncCatalogToTarget cağrılır (idempotent — ref varsa no-op olur).
 */
export async function publishCatalogToTarget(
  catalogId: string,
  pdfBuffer: Buffer,
): Promise<PublishResult> {
  try {
    const catalog = await loadCatalog(catalogId);
    if (!catalog) return { ok: false, error: 'catalog_bulunamadi' };
    if (!catalog.target_source_id) return { ok: false, error: 'hedef_atanmadi' };

    const source = await loadSource(catalog.target_source_id);
    if (!source) return { ok: false, error: 'kaynak_bulunamadi' };
    if (source.is_active !== 1 || source.source_type !== 'database') {
      return { ok: false, error: 'kaynak_pasif_veya_uygunsuz' };
    }

    // Ref garantisi: yoksa sync edip yarat.
    const syncResult = await syncCatalogToTarget(catalogId);
    if (!syncResult.ok && syncResult.action !== 'noop') {
      return { ok: false, error: syncResult.error || syncResult.reason || 'sync_basarisiz' };
    }

    const [ref] = await masterDb
      .select()
      .from(catalogLibraryRefs)
      .where(
        and(
          eq(catalogLibraryRefs.catalog_id, catalogId),
          eq(catalogLibraryRefs.source_id, source.id),
        ),
      )
      .limit(1);
    if (!ref) return { ok: false, error: 'library_ref_olusmadi' };

    // PDF'i depola.
    const stamp = Date.now().toString(36);
    const baseSlug = (catalog.slug || catalog.title || 'katalog').replace(/[^a-z0-9-]/gi, '-').toLowerCase().slice(0, 200);
    const pdfUrl = await persistPdfToLocalStorage(pdfBuffer, `${baseSlug}-${stamp}`);

    const { drizzle: targetDb } = getSourceConnection({
      id: source.id,
      db_host: source.db_host ?? '',
      db_port: source.db_port ?? 3306,
      db_name: source.db_name ?? '',
      db_user: source.db_user ?? '',
      db_password: source.db_password ?? '',
      connection_limit: source.connection_limit ?? 5,
    });

    // library_files UPSERT — bu library_id icin tek 'application/pdf' kaydı tutuyoruz.
    const existing = await targetDb
      .select()
      .from(libraryFiles)
      .where(and(eq(libraryFiles.library_id, ref.library_id), eq(libraryFiles.mime_type, 'application/pdf')))
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
      return { ok: true, pdf_url: pdfUrl, library_id: ref.library_id, action: 'update' };
    }

    await targetDb.insert(libraryFiles).values({
      id: crypto.randomUUID(),
      library_id: ref.library_id,
      asset_id: null,
      file_url: pdfUrl,
      name: fileName,
      size_bytes: pdfBuffer.length,
      mime_type: 'application/pdf',
      display_order: 0,
      is_active: 1,
    });
    return { ok: true, pdf_url: pdfUrl, library_id: ref.library_id, action: 'insert' };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown_error';
    return { ok: false, error: message };
  }
}
