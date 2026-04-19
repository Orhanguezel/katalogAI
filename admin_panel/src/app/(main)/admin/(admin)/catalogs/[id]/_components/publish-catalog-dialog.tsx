// =============================================================
// FILE: src/app/(main)/admin/(admin)/catalogs/[id]/_components/publish-catalog-dialog.tsx
// Yayinla Dialog — PDF render + library_files UPSERT (tek hedef, catalog meta'sindan).
// =============================================================

'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Loader2, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  useListProductSourcesAdminQuery,
  usePublishCatalogAdminMutation,
} from '@/integrations/hooks';
import { useCatalogBuilderStore } from '../_store/catalog-builder-store';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  catalogId: string;
}

export default function PublishCatalogDialog({ open, onOpenChange, catalogId }: Props) {
  const targetSourceId = useCatalogBuilderStore((s) => s.targetSourceId);
  const { data: sources } = useListProductSourcesAdminQuery();
  const [publishCatalog, { isLoading: isPublishing }] = usePublishCatalogAdminMutation();
  const [done, setDone] = React.useState<{ ok: boolean; action?: string; pdf_url?: string; error?: string } | null>(null);

  React.useEffect(() => {
    if (open) setDone(null);
  }, [open]);

  const target = sources?.find((s) => s.id === targetSourceId);

  const handlePublish = async () => {
    if (!targetSourceId) {
      toast.error('Hedef marka atanmamis. Onceki dialog\u2019dan secebilirsin.');
      return;
    }
    try {
      const result = await publishCatalog(catalogId).unwrap();
      setDone({ ok: result.ok, action: result.action, pdf_url: result.pdf_url, error: result.error });
      if (result.ok) {
        toast.success(`PDF ${target?.name ?? 'hedef marka'} library'sine ${result.action === 'update' ? 'guncellendi' : 'eklendi'}.`);
      } else {
        toast.error(result.error || 'Yayinlama basarisiz.');
      }
    } catch {
      toast.error('Yayinlama sirasinda hata olustu.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-katalog-bg-panel p-0 text-white sm:max-w-md rounded-2xl">
        <VisuallyHidden><DialogTitle>Katalogu Yayinla</DialogTitle></VisuallyHidden>
        <div className="p-6 space-y-5">
          <div className="space-y-1.5">
            <h2 className="font-serif text-2xl text-katalog-gold">PDF Yayinla</h2>
            <DialogDescription className="text-xs text-katalog-text-dim leading-relaxed">
              Katalog PDF olarak render edilir ve hedef markanin Library kaydina <strong>dosya olarak</strong>
              eklenir/guncellenir. Library row zaten Kaydet anında olusur; bu islem sadece PDF'i baglar.
              Kayit hala <strong>taslak</strong> kalir — marka sahibi kendi panelinden onaylar.
            </DialogDescription>
          </div>

          <div className="px-3 py-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
            <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-300/80">Hedef</div>
            <div className="text-sm font-bold text-white mt-0.5">
              {target?.name ?? <span className="text-katalog-text-dim italic font-normal">Atanmamis</span>}
            </div>
          </div>

          {done && (
            <div className={`px-3 py-2.5 rounded-lg border text-xs ${
              done.ok ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300' : 'bg-red-500/5 border-red-500/20 text-red-300'
            }`}>
              {done.ok ? (
                <>
                  <div className="font-bold mb-1">PDF {done.action === 'update' ? 'guncellendi' : 'eklendi'} ✓</div>
                  {done.pdf_url && (
                    <a href={done.pdf_url} target="_blank" rel="noreferrer" className="text-[10px] underline opacity-80 break-all">
                      {done.pdf_url}
                    </a>
                  )}
                </>
              ) : (
                <>
                  <div className="font-bold mb-1">Hata</div>
                  <div className="text-[10px] opacity-80">{done.error}</div>
                </>
              )}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isPublishing}
              className="h-9 rounded-lg border border-white/10 text-xs text-katalog-text-dim hover:bg-white/5"
            >
              <X className="mr-1.5 h-3.5 w-3.5" />
              Kapat
            </Button>
            <Button
              type="button"
              onClick={handlePublish}
              disabled={isPublishing || !targetSourceId}
              className="h-9 rounded-lg bg-katalog-gold px-5 text-xs font-bold text-katalog-bg-deep hover:bg-katalog-gold-light disabled:opacity-40"
            >
              {isPublishing ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Send className="mr-1.5 h-3.5 w-3.5" />}
              {done?.ok ? 'Tekrar Yayinla' : 'PDF Yayinla'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
