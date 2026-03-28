// =============================================================
// FILE: src/app/(main)/admin/(admin)/catalogs/[id]/_components/page-navigation-bar.tsx
// Bottom Page Navigation Strip — always visible
// =============================================================

'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useCatalogBuilderStore } from '../_store/catalog-builder-store';

interface Props {
  onAddPage?: () => void | Promise<void>;
}

export default function PageNavigationBar({ onAddPage }: Props) {
  const { pages, activePage, setActivePage } = useCatalogBuilderStore();

  return (
    <div
      data-panel="page-nav"
      className="flex items-center gap-2 px-4 py-2.5 border-t border-white/6 bg-katalog-bg-panel"
    >
      <span className="text-[9px] font-bold uppercase tracking-widest text-white/30 mr-1 shrink-0">
        SAYFA
      </span>

      <div className="flex items-center gap-1.5 overflow-x-auto">
        {pages.map((_page, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActivePage(index)}
            className={`shrink-0 min-w-9 h-9 px-2 rounded-lg text-xs font-bold transition-all ${
              index === activePage
                ? 'bg-katalog-gold text-katalog-bg-deep shadow-lg shadow-katalog-gold/20'
                : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
            }`}
          >
            {index + 1}
          </button>
        ))}
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
