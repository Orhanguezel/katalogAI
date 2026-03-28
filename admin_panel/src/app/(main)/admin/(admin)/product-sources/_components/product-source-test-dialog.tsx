// =============================================================
// FILE: src/app/(main)/admin/(admin)/product-sources/_components/product-source-test-dialog.tsx
// Product Source — Connection Test Dialog
// =============================================================

'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { useTestProductSourceAdminMutation } from '@/integrations/hooks';

interface Props {
  sourceId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProductSourceTestDialog({ sourceId, open, onOpenChange }: Props) {
  const t = useAdminT('admin.productSources');
  const [testConnection, { data, isLoading, error }] = useTestProductSourceAdminMutation();

  React.useEffect(() => {
    if (open && sourceId) {
      testConnection(sourceId);
    }
  }, [open, sourceId, testConnection]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-white/10 bg-katalog-bg-panel text-white rounded-[20px] overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="font-serif text-2xl text-katalog-gold">
            {t('actions.test') || 'Bağlantı Testi'}
          </DialogTitle>
          <DialogDescription className="text-katalog-text-dim">
            {t('header.description') || 'Veritabanı bağlantısı doğrulanıyor...'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center gap-4 py-12">
          {isLoading && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-katalog-gold" />
              <p className="text-sm text-katalog-text-dim animate-pulse">Sorgulanıyor...</p>
            </div>
          )}

          {!isLoading && (data?.success || data?.ok) && (
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-2">
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              </div>
              <p className="text-lg font-bold text-emerald-400">{t('messages.testSuccess') || 'Bağlantı Başarılı'}</p>
              {data?.table_count != null && (
                <p className="text-sm text-katalog-text-dim px-6">
                  {`${data.table_count} tablo bulundu.`}
                </p>
              )}
            </div>
          )}

          {!isLoading && (data && !data.success && !data.ok || error) && (
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
                <XCircle className="h-10 w-10 text-red-500" />
              </div>
              <p className="text-lg font-bold text-red-400">{t('messages.testFailed') || 'Bağlantı Başarısız'}</p>
              {(data?.error || data?.message || (error as any)?.message) && (
                <p className="text-sm text-katalog-text-dim px-10 bg-black/20 p-3 rounded-lg border border-white/5 font-mono text-xs max-w-xs break-words">
                  {data?.error || data?.message || (error as any)?.message}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="p-6 pt-0 flex justify-end">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="rounded-xl text-katalog-text-dim hover:text-white hover:bg-white/5"
          >
            {t('actions.close') || 'Kapat'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
