// =============================================================
// FILE: src/app/(main)/admin/(admin)/catalogs/[id]/_components/page-navigation-bar.tsx
// Bottom Page Navigation Strip — always visible
// =============================================================

'use client';

import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { useCatalogBuilderStore } from '../_store/catalog-builder-store';

interface Props {
  onAddPage?: () => void | Promise<void>;
  onDeletePage?: (pageIndex: number) => void | Promise<void>;
}

export default function PageNavigationBar({ onAddPage, onDeletePage }: Props) {
  const { pages, activePage, setActivePage } = useCatalogBuilderStore();
  const canDelete = pages.length > 1;

  const handleDelete = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (!canDelete) return;
    if (window.confirm(`Sayfa ${index + 1} silinsin mi?`)) {
      void onDeletePage?.(index);
    }
  };

  return (
    <div
      data-panel="page-nav"
      className="flex items-center gap-2 px-4 py-2.5 border-t border-white/6 bg-katalog-bg-panel"
    >
      <span className="text-[9px] font-bold uppercase tracking-widest text-white/30 mr-1 shrink-0">
        SAYFA
      </span>

      <div className="flex items-center gap-1.5 overflow-x-auto">
        {pages.map((_page, index) => {
          const isActive = index === activePage;
          return (
            <div key={index} className="relative shrink-0 group">
              <button
                type="button"
                onClick={() => setActivePage(index)}
                className={`min-w-9 h-9 px-2 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-katalog-gold text-katalog-bg-deep shadow-lg shadow-katalog-gold/20'
                    : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                }`}
              >
                {index + 1}
              </button>
              {canDelete && onDeletePage && (
                <button
                  type="button"
                  aria-label={`Sayfa ${index + 1} sil`}
                  onClick={(e) => handleDelete(e, index)}
                  className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-md hover:bg-red-600"
                >
                  <X className="h-2.5 w-2.5" strokeWidth={3} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="shrink-0 h-9 w-9 rounded-lg border border-dashed border-white/10 hover:border-katalog-gold/50 hover:text-katalog-gold p-0"
        onClick={() => onAddPage?.()}
      >
        <Plus className="h-4 w-4" />
      </Button>

      <span className="text-[9px] text-white/20 ml-auto shrink-0">
        {pages.length} sayfa
      </span>
    </div>
  );
}
