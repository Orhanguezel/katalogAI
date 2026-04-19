// =============================================================
// FILE: src/app/(main)/admin/(admin)/catalogs/[id]/_components/canvas-panel.tsx
// Center Panel — A4 Canvas with Zoom and Page Navigation
// =============================================================

'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useCatalogBuilderStore } from '../_store/catalog-builder-store';

import CatalogPageCanvas from './catalog-page-canvas';
import PageNavigationBar from './page-navigation-bar';
import ZoomControls from './zoom-controls';

interface Props {
  onClearPage?: (pageIndex: number) => void | Promise<void>;
  onRemoveProduct?: (pageIndex: number, slotIndex: number) => void | Promise<void>;
  onAddPage?: () => void | Promise<void>;
  onDeletePage?: (pageIndex: number) => void | Promise<void>;
}

export default function CanvasPanel({ onClearPage, onRemoveProduct, onAddPage, onDeletePage }: Props) {
  const {
    pages, activePage, zoom, showCover, showBackCover, setActivePage,
    colorTheme, accentColor, backgroundColor, fontFamily, headingFont,
  } = useCatalogBuilderStore();

  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Sayfa değiştiğinde scroll'u en üste resetle
  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  // Aktif sayfa toggle ile gizlenmiş ise ilk görünür sayfaya zıpla
  React.useEffect(() => {
    const current = pages[activePage];
    if (!current) return;
    const hiddenByCover = current.layoutType === 'cover' && !showCover;
    const hiddenByBack = current.layoutType === 'backcover' && !showBackCover;
    if (hiddenByCover || hiddenByBack) {
      const firstVisible = pages.findIndex((p) =>
        (p.layoutType !== 'cover' || showCover) &&
        (p.layoutType !== 'backcover' || showBackCover),
      );
      if (firstVisible !== -1 && firstVisible !== activePage) {
        setActivePage(firstVisible);
      }
    }
  }, [pages, activePage, showCover, showBackCover, setActivePage]);

  const currentPage = pages[activePage];
  if (!currentPage) return null;

  const scale = zoom / 100;

  return (
    <div className="flex flex-col" style={{ height: '100%' }}>
      {/* Toolbar */}
      <div
        data-panel="zoom"
        className="flex h-12 shrink-0 items-center justify-between border-b border-white/6 bg-katalog-bg-panel/95 px-5 backdrop-blur-xl"
      >
        <ZoomControls />
        <div className="font-mono text-xs uppercase tracking-widest text-katalog-text-dim">
          A4 Portrait (595×842)
        </div>
        <Button
          type="button"
          variant="ghost"
          className="h-8 rounded-md border border-white/8 px-3 text-xs text-katalog-text-muted hover:bg-white/5 hover:text-white"
          onClick={() => onClearPage?.(activePage)}
        >
          Temizle
        </Button>
      </div>

      {/* Canvas scroll area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-auto bg-katalog-bg-deep"
        data-print-area
        style={{ minHeight: 0 }}
      >
        <div
          className="flex items-start justify-center p-10"
          style={{
            minHeight: '100%',
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(194,157,93,0.14) 1px, transparent 0)',
            backgroundSize: '20px 20px',
          }}
        >
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div className="shadow-[0_40px_80px_rgba(0,0,0,0.6)] rounded-sm overflow-hidden">
              <CatalogPageCanvas
                page={currentPage}
                pageIndex={activePage}
                onRemoveProduct={onRemoveProduct}
                colorTheme={colorTheme}
                accentColor={accentColor}
                backgroundColor={backgroundColor}
                fontFamily={fontFamily}
                headingFont={headingFont}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Page navigation */}
      <PageNavigationBar onAddPage={onAddPage} onDeletePage={onDeletePage} />
    </div>
  );
}
