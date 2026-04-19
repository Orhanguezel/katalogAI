// src/modules/exports/publish-service.ts
//
// "Yayinla" butonu sync-service'in ayni mantigini cagirir, opts.includePdf=true
// ile manuel olarak metadata + PDF'i yeniden uretir/upsert eder. Boylece
// kullanici "PDF'imi yenile" demek istediginde forced refresh yapar.

import { syncCatalogToTarget, type SyncResult } from './sync-service';

export interface PublishResult {
  ok: boolean;
  pdf_url?: string;
  library_id?: string;
  action?: 'insert' | 'update';
  error?: string;
}

export async function publishCatalogToTarget(catalogId: string): Promise<PublishResult> {
  const r: SyncResult = await syncCatalogToTarget(catalogId, { includePdf: true });
  return {
    ok: r.ok,
    pdf_url: r.pdf_url,
    library_id: r.library_id,
    action: r.action === 'noop' ? undefined : r.action,
    error: r.error || r.reason,
  };
}
