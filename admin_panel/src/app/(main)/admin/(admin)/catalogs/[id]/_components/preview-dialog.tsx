// =============================================================
// FILE: src/app/(main)/admin/(admin)/catalogs/[id]/_components/preview-dialog.tsx
// Full Catalog Preview — birebir PDF çıktısı gibi tüm sayfalar
// =============================================================

'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Minus, Plus, Printer, X } from 'lucide-react';
import { useCatalogBuilderStore } from '../_store/catalog-builder-store';
import CatalogPageCanvas from './catalog-page-canvas';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PreviewDialog({ open, onOpenChange }: Props) {
  const { pages, colorTheme, accentColor, backgroundColor, fontFamily, headingFont } =
    useCatalogBuilderStore();

  const [viewMode, setViewMode] = React.useState<'all' | 'single'>('all');
  const [currentPage, setCurrentPage] = React.useState(0);
  const [zoom, setZoom] = React.useState(80);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (open) {
      setCurrentPage(0);
      setZoom(80);
      setViewMode('all');
    }
  }, [open]);

  const scale = zoom / 100;
  const totalPages = pages.length;

  const handlePrint = () => window.print();

  const prevPage = () => setCurrentPage((p) => Math.max(0, p - 1));
  const nextPage = () => setCurrentPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-none w-screen h-screen p-0 bg-[#2a2a2a] border-none rounded-none gap-0 [&>button]:hidden">
        <VisuallyHidden><DialogTitle>Katalog Önizleme</DialogTitle></VisuallyHidden>
        {/* Toolbar */}
        <div className="flex items-center justify-between h-12 px-4 bg-[#1a1a1a] border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-white">Önizleme</span>
            <span className="text-xs text-white/40">
              {totalPages} sayfa
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View mode */}
            <div className="flex items-center bg-white/5 rounded-lg p-0.5">
              <button
                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${viewMode === 'all' ? 'bg-white/10 text-white' : 'text-white/40'}`}
                onClick={() => setViewMode('all')}
              >
                TÜM SAYFALAR
              </button>
              <button
                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${viewMode === 'single' ? 'bg-white/10 text-white' : 'text-white/40'}`}
                onClick={() => setViewMode('single')}
              >
                TEK SAYFA
              </button>
            </div>

            {/* Zoom */}
            <div className="flex items-center gap-1 ml-2">
              <button className="h-7 w-7 flex items-center justify-center text-white/50 hover:text-white rounded" onClick={() => setZoom((z) => Math.max(30, z - 10))}>
                <Minus className="h-3 w-3" />
              </button>
              <span className="text-xs text-white/60 w-10 text-center">{zoom}%</span>
              <button className="h-7 w-7 flex items-center justify-center text-white/50 hover:text-white rounded" onClick={() => setZoom((z) => Math.min(150, z + 10))}>
                <Plus className="h-3 w-3" />
              </button>
            </div>

            {/* Single mode page nav */}
            {viewMode === 'single' && (
              <div className="flex items-center gap-1 ml-2">
                <button className="h-7 w-7 flex items-center justify-center text-white/50 hover:text-white rounded disabled:opacity-20" onClick={prevPage} disabled={currentPage === 0}>
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs text-white/60 min-w-12 text-center">{currentPage + 1} / {totalPages}</span>
                <button className="h-7 w-7 flex items-center justify-center text-white/50 hover:text-white rounded disabled:opacity-20" onClick={nextPage} disabled={currentPage >= totalPages - 1}>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Actions */}
            <Button
              size="sm"
              onClick={handlePrint}
              className="ml-3 h-8 bg-katalog-gold hover:bg-katalog-gold-light text-katalog-bg-deep font-bold text-xs"
            >
              <Printer className="mr-1.5 h-3.5 w-3.5" />
              Yazdır
            </Button>
            <button
              className="h-8 w-8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 rounded-lg ml-1"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Preview area */}
        <div ref={scrollRef} className="flex-1 overflow-auto" data-print-area>
          <div className="flex flex-col items-center py-8 gap-6 min-h-full">
            {viewMode === 'all' ? (
              // Tüm sayfalar alt alta
              pages.map((page, index) => (
                <div
                  key={index}
                  className="shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'top center',
                  }}
                >
                  <CatalogPageCanvas
                    page={page}
                    pageIndex={index}
                    colorTheme={colorTheme}
                    accentColor={accentColor}
                    backgroundColor={backgroundColor}
                    fontFamily={fontFamily}
                    headingFont={headingFont}
                    preview
                  />
                </div>
              ))
            ) : (
              // Tek sayfa
              <div
                className="shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: 'top center',
                }}
              >
                {pages[currentPage] && (
                  <CatalogPageCanvas
                    page={pages[currentPage]}
                    pageIndex={currentPage}
                    colorTheme={colorTheme}
                    accentColor={accentColor}
                    backgroundColor={backgroundColor}
                    fontFamily={fontFamily}
                    headingFont={headingFont}
                    preview
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Thumbnail bar (all mode) */}
        {viewMode === 'all' && totalPages > 1 && (
          <div className="h-16 bg-[#1a1a1a] border-t border-white/10 flex items-center gap-2 px-4 overflow-x-auto shrink-0">
            {pages.map((_, i) => (
              <button
                key={i}
                className="shrink-0 h-10 w-7 rounded border border-white/10 bg-white/5 text-[8px] font-bold text-white/50 hover:border-katalog-gold/50 hover:text-white transition-all"
                onClick={() => {
                  const el = scrollRef.current?.children[0]?.children[i] as HTMLElement;
                  el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
