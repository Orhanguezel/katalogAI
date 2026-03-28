// =============================================================
// FILE: src/app/(main)/admin/(admin)/catalogs/[id]/_components/catalog-builder-topbar.tsx
// Builder Topbar — Title, Save, Preview, Export
// =============================================================

'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Check, Eye, FileDown, Loader2, Mail } from 'lucide-react';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { useExportCatalogPdfAdminMutation } from '@/integrations/hooks';
import { useCatalogBuilderStore } from '../_store/catalog-builder-store';

import PreviewDialog from './preview-dialog';
import ExportEmailDialog from './export-email-dialog';

export default function CatalogBuilderTopbar() {
  const t = useAdminT('admin.catalogs');
  const { catalogId, title, isDirty, isSaving } = useCatalogBuilderStore();
  const [showPreview, setShowPreview] = React.useState(false);
  const [showEmail, setShowEmail] = React.useState(false);
  const [exportPdf, { isLoading: isExporting }] = useExportCatalogPdfAdminMutation();

  const handleExportPdf = async () => {
    try {
      const blob = await exportPdf(catalogId).unwrap();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title || 'catalog'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(t('messages.pdfExported'));
    } catch {
      toast.error(t('messages.pdfExportFailed'));
    }
  };

  return (
    <>
      <div data-panel="topbar" className="z-[100] flex h-16 shrink-0 items-center justify-between border-b border-white/6 bg-[#0a0c0a] px-8">
        <div className="flex items-center gap-12">
          {/* Brand */}
          <div className="flex items-center gap-3 group cursor-default">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-katalog-gold text-lg font-bold text-katalog-bg-deep shadow-lg ring-1 ring-white/10 transition-transform group-hover:scale-110">
              K
            </div>
            <div className="text-2xl font-bold tracking-tight text-white font-serif italic">
              Katalog<span className="text-katalog-gold">AI</span>
            </div>
          </div>

          <div className="flex flex-col">
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                   <span className="text-[10px] font-mono text-katalog-text-dim uppercase tracking-widest leading-none">A4 PORTRAIT (595x842)</span>
                </div>
                <div className="flex items-center gap-1.5 translate-y-[0.5px]">
                  {isSaving ? (
                    <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-katalog-gold/60 font-bold">
                      <Loader2 className="h-2.5 w-2.5 animate-spin" />
                      {t('builder.saving')}
                    </div>
                  ) : isDirty ? (
                    <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-amber-500/80 font-bold">
                      <div className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
                      {t('builder.unsaved')}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-emerald-500/40 font-bold">
                      <Check className="h-2.5 w-2.5" />
                      {t('builder.saved')}
                    </div>
                  )}
                </div>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-5 rounded-lg border border-white/5 bg-white/[0.02] text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 hover:border-white/10 hover:bg-white/5 hover:text-white transition-all"
            onClick={() => setShowEmail(true)}
          >
            {t('actions.sendEmail') || 'Taslak olarak Kaydet'}
          </Button>
          <Button
            size="sm"
            className="h-9 px-6 rounded-lg bg-katalog-gold text-[10px] font-bold uppercase tracking-[0.2em] text-katalog-bg-deep shadow-[0_8px_20px_rgba(194,157,93,0.3)] transition-all hover:bg-katalog-gold-light hover:scale-105"
            onClick={handleExportPdf}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            ) : (
              <FileDown className="mr-2 h-3.5 w-3.5" />
            )}
            {t('actions.exportPdf') || 'PDF Dışa Aktar'}
          </Button>
        </div>
      </div>

      <PreviewDialog open={showPreview} onOpenChange={setShowPreview} />
      <ExportEmailDialog open={showEmail} onOpenChange={setShowEmail} />
    </>
  );
}
