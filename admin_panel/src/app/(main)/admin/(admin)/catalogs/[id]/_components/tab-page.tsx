// =============================================================
// FILE: src/app/(main)/admin/(admin)/catalogs/[id]/_components/tab-page.tsx
// Settings Tab — Active Page Settings (Layout, Background, Page Actions)
// =============================================================

'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Plus, Trash2 } from 'lucide-react';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { useCatalogBuilderStore } from '../_store/catalog-builder-store';
import { LAYOUT_PRESETS } from '../_config/layout-presets';

const HEADER_STYLES = ['full', 'minimal', 'centered', 'split'] as const;
const PAGE_NUMBER_STYLES = ['bottom-center', 'bottom-right', 'none'] as const;

export default function TabPage() {
  const t = useAdminT('admin.catalogs');
  const store = useCatalogBuilderStore();
  const page = store.pages[store.activePage];

  if (!page) return null;

  return (
    <div className="space-y-5">
      {/* Page info */}
      <p className="text-xs font-medium">
        {t('builder.pageOf', { current: store.activePage + 1, total: store.pages.length })}
      </p>

      {/* Layout selector */}
      <section className="space-y-2">
        <Label className="text-xs">{t('settings.pageLayout')}</Label>
        <div className="grid grid-cols-4 gap-1.5">
          {LAYOUT_PRESETS.map((layout) => (
            <button
              key={layout.id}
              type="button"
              onClick={() => store.setPageLayout(store.activePage, layout.id)}
              className={`h-14 rounded border text-[9px] font-medium transition-all flex flex-col items-center justify-center gap-0.5 ${
                page.layoutType === layout.id
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                  : 'border-border hover:border-muted-foreground/40'
              }`}
            >
              <span className="text-[10px]">{layout.slots || '-'}</span>
              <span>{t(`layouts.${layout.id}`)}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Page background color */}
      <section className="space-y-2">
        <Label className="text-xs">{t('settings.pageBackground')}</Label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={page.backgroundColor || '#ffffff'}
            onChange={(e) => store.setPageBackground(store.activePage, e.target.value)}
            className="h-7 w-7 rounded border cursor-pointer"
          />
          <Input
            className="h-7 text-[10px] flex-1"
            value={page.backgroundColor || ''}
            onChange={(e) => store.setPageBackground(store.activePage, e.target.value)}
            placeholder="#ffffff"
          />
        </div>
      </section>

      {/* Header style */}
      <section className="space-y-2">
        <Label className="text-xs">{t('settings.headerStyle')}</Label>
        <div className="flex gap-1 flex-wrap">
          {HEADER_STYLES.map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => store.setStyle({ headerStyle: style })}
              className={`h-7 px-2 rounded text-[10px] font-medium border transition-all ${
                store.headerStyle === style ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-accent'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </section>

      {/* Page number style */}
      <section className="space-y-2">
        <Label className="text-xs">{t('settings.pageNumberStyle')}</Label>
        <div className="flex gap-1 flex-wrap">
          {PAGE_NUMBER_STYLES.map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => store.setStyle({ pageNumberStyle: style })}
              className={`h-7 px-2 rounded text-[10px] font-medium border transition-all ${
                store.pageNumberStyle === style ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-accent'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </section>

      {/* Page actions */}
      <section className="space-y-2 pt-2 border-t">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => store.addPage()}>
            <Plus className="mr-1 h-3.5 w-3.5" />
            {t('builder.addPage')}
          </Button>
          <Button variant="outline" size="sm" onClick={() => store.duplicatePage(store.activePage)}>
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive"
            disabled={store.pages.length <= 1}
            onClick={() => store.removePage(store.activePage)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
