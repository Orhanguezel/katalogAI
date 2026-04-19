// =============================================================
// FILE: src/app/(main)/admin/(admin)/catalogs/[id]/_components/publish-catalog-dialog.tsx
// Yayinla Dialog — kullanici hangi marka(lar)a gondermek istedigini secer.
// =============================================================

'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Loader2, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  useListPublishTargetsAdminQuery,
  usePublishCatalogAdminMutation,
} from '@/integrations/hooks';
import type { PublishTargetResult } from '@/integrations/shared';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  catalogId: string;
}

export default function PublishCatalogDialog({ open, onOpenChange, catalogId }: Props) {
  const { data, isLoading: isLoadingTargets } = useListPublishTargetsAdminQuery(undefined, {
    skip: !open,
  });
  const [publishCatalog, { isLoading: isPublishing }] = usePublishCatalogAdminMutation();

  const targets = data?.items ?? [];
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [results, setResults] = React.useState<PublishTargetResult[] | null>(null);

  React.useEffect(() => {
    if (open) {
      setResults(null);
      setSelected(new Set(targets.map((t) => t.slug)));
    }
  }, [open, targets]);

  const toggle = (slug: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const handlePublish = async () => {
    const slugs = Array.from(selected);
    if (!slugs.length) {
      toast.error('En az bir marka secmelisin.');
      return;
    }
    try {
      const result = await publishCatalog({
        catalogId,
        payload: { target_slugs: slugs },
      }).unwrap();
      setResults(result.results);
      const okCount = result.results.filter((r) => r.ok).length;
      if (okCount === result.results.length) {
        toast.success(`${okCount} markaya taslak olarak yayinlandi.`);
      } else if (okCount > 0) {
        toast.warning(`${okCount}/${result.results.length} markaya yayinlandi. Detaylar asagida.`);
      } else {
        toast.error('Hicbir markaya yayinlanamadi. Detaylar asagida.');
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
            <h2 className="font-serif text-2xl text-katalog-gold">Katalogu Yayinla</h2>
            <DialogDescription className="text-xs text-katalog-text-dim">
              Secilen marka(lar)in panellerine <strong>taslak</strong> olarak gonderilir.
              Yayina almak icin marka sahibi kendi panelinden onaylar.
            </DialogDescription>
          </div>

          {isLoadingTargets ? (
            <div className="flex items-center justify-center py-8 text-katalog-text-dim">
              <Loader2 className="h-4 w-4 animate-spin mr-2" /> Markalar yukleniyor...
            </div>
          ) : targets.length === 0 ? (
            <p className="text-xs text-katalog-text-dim text-center py-6">
              Aktif veri kaynagi bulunamadi.
            </p>
          ) : (
            <div className="space-y-2">
              {targets.map((t) => {
                const r = results?.find((x) => x.slug === t.slug);
                const isChecked = selected.has(t.slug);
                return (
                  <label
                    key={t.slug}
                    className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition ${
                      isChecked
                        ? 'border-katalog-gold/40 bg-katalog-gold/5'
                        : 'border-white/8 bg-white/2 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-katalog-gold shrink-0"
                        checked={isChecked}
                        onChange={() => toggle(t.slug)}
                        disabled={isPublishing}
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-white truncate">{t.name}</div>
                        <div className="text-[10px] text-katalog-text-dim font-mono">{t.slug}</div>
                      </div>
                    </div>
                    {r && (
                      r.ok ? (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                          Gonderildi
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-red-400" title={r.error}>
                          Hata
                        </span>
                      )
                    )}
                  </label>
                );
              })}
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
              disabled={isPublishing || isLoadingTargets || targets.length === 0}
              className="h-9 rounded-lg bg-katalog-gold px-5 text-xs font-bold text-katalog-bg-deep hover:bg-katalog-gold-light"
            >
              {isPublishing ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Send className="mr-1.5 h-3.5 w-3.5" />}
              {results ? 'Tekrar Yayinla' : 'Yayinla (Taslak)'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
