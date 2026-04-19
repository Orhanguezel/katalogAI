// =============================================================
// FILE: src/app/(main)/admin/(admin)/catalogs/[id]/_components/catalog-builder-topbar.tsx
// Builder Topbar — Logo, Save status, Preview, Email, PDF
// =============================================================

'use client';

import * as React from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Check, Eye, FileDown, Loader2, Mail, Save, Send } from 'lucide-react';
import { useExportCatalogPdfAdminMutation } from '@/integrations/hooks';
import { useCatalogBuilderStore } from '../_store/catalog-builder-store';

import PreviewDialog from './preview-dialog';
import ExportEmailDialog from './export-email-dialog';
import PublishCatalogDialog from './publish-catalog-dialog';

interface Props {
  onSave?: () => void | Promise<void>;
}

export default function CatalogBuilderTopbar({ onSave }: Props) {
  const { catalogId, title, isDirty, isSaving } = useCatalogBuilderStore();
  const [showPreview, setShowPreview] = React.useState(false);
  const [showEmail, setShowEmail] = React.useState(false);
  const [showPublish, setShowPublish] = React.useState(false);
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
      toast.success('PDF indirildi.');
    } catch {
      toast.error('PDF oluşturulamadı.');
    }
  };

  return (
    <>
      <div data-panel="topbar" className="z-[100] flex h-14 shrink-0 items-center justify-between border-b border-white/6 bg-[#0a0c0a] px-6">
        {/* Sol — Logo + durum */}
        <div className="flex items-center gap-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-katalog-gold text-base font-bold text-katalog-bg-deep shadow-lg transition-transform group-hover:scale-110">
              K
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-serif italic group-hover:text-katalog-gold transition-colors">
              Katalog<span className="text-katalog-gold group-hover:text-white">AI</span>
            </span>
          </Link>

          <div className="h-6 w-px bg-white/10" />

          <div className="flex items-center gap-3">
            <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">A4 PORTRAIT (595×842)</span>
            <div className="flex items-center gap-1.5">
              {isSaving ? (
                <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-katalog-gold/60 font-bold">
                  <Loader2 className="h-2.5 w-2.5 animate-spin" /> KAYDEDİLİYOR
                </span>
              ) : isDirty ? (
                <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-amber-500/80 font-bold">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> KAYDEDİLMEDİ
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-emerald-500/50 font-bold">
                  <Check className="h-2.5 w-2.5" /> KAYDEDİLDİ
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Sağ — Butonlar */}
        <div className="flex items-center gap-2">
          {/* Manuel Kaydet */}
          <Button
            variant="ghost"
            size="sm"
            className={`h-9 px-4 rounded-lg border text-xs font-bold transition-all ${
              isDirty
                ? 'border-amber-500/50 text-amber-300 hover:bg-amber-500/10'
                : 'border-white/8 text-white/40 hover:text-white hover:bg-white/5'
            }`}
            onClick={() => onSave?.()}
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Save className="mr-1.5 h-3.5 w-3.5" />}
            Kaydet
          </Button>

          {/* Preview */}
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-4 rounded-lg border border-white/8 text-xs font-bold text-white/50 hover:text-white hover:bg-white/5"
            onClick={() => setShowPreview(true)}
          >
            <Eye className="mr-1.5 h-3.5 w-3.5" />
            Önizleme
          </Button>

          {/* Email */}
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-4 rounded-lg border border-white/8 text-xs font-bold text-white/50 hover:text-white hover:bg-white/5"
            onClick={() => setShowEmail(true)}
          >
            <Mail className="mr-1.5 h-3.5 w-3.5" />
            E-Posta
          </Button>

          {/* Yayinla */}
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-4 rounded-lg border border-emerald-500/40 text-xs font-bold text-emerald-300 hover:bg-emerald-500/10"
            onClick={() => setShowPublish(true)}
          >
            <Send className="mr-1.5 h-3.5 w-3.5" />
            Yayinla
          </Button>

          {/* PDF */}
          <Button
            size="sm"
            className="h-9 px-5 rounded-lg bg-katalog-gold text-xs font-bold text-katalog-bg-deep shadow-lg shadow-katalog-gold/20 hover:bg-katalog-gold-light transition-all"
            onClick={handleExportPdf}
            disabled={isExporting}
          >
            {isExporting ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <FileDown className="mr-1.5 h-3.5 w-3.5" />}
            PDF İndir
          </Button>
        </div>
      </div>

      <PreviewDialog open={showPreview} onOpenChange={setShowPreview} />
      <ExportEmailDialog open={showEmail} onOpenChange={setShowEmail} />
      <PublishCatalogDialog open={showPublish} onOpenChange={setShowPublish} catalogId={catalogId} />
    </>
  );
}
