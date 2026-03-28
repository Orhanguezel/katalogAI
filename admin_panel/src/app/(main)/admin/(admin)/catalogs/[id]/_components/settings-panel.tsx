'use client';

import { COLOR_PALETTES } from '../_config/color-palettes';
import { useCatalogBuilderStore } from '../_store/catalog-builder-store';
import TabCatalogInfo from './tab-catalog-info';

const LAYOUT_OPTIONS = [
  { id: 'single', label: '1x1' },
  { id: '2x2', label: '2x2' },
  { id: '2x3', label: '2x3' },
  { id: 'free', label: 'Serbest' },
] as const;

interface Props {
  onLayoutChange?: (layoutId: (typeof LAYOUT_OPTIONS)[number]['id']) => void | Promise<void>;
}

export default function SettingsPanel({ onLayoutChange }: Props) {
  const { pages, activePage, accentColor, setStyle } = useCatalogBuilderStore();
  const currentPage = pages[activePage];
  const selectedProductCount = pages.reduce(
    (sum, page) => sum + page.slots.filter((slot) => slot.sourceProductId).length,
    0,
  );

  return (
    <div data-panel="settings" className="flex flex-col border-l border-white/6 bg-katalog-bg-panel" style={{ height: '100%' }}>
      {/* Başlık — sabit */}
      <div className="shrink-0 p-4 pb-2 border-b border-white/5">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-katalog-gold/60">
          Katalog Bilgileri
        </h2>
      </div>

      {/* İçerik — scrollable */}
      <div className="flex-1 overflow-auto p-4" style={{ minHeight: 0 }}>
        <div className="space-y-6">
          <TabCatalogInfo />

          <section className="space-y-3">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/30">
              Yerleşim
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {LAYOUT_OPTIONS.map((layout) => {
                const active = currentPage?.layoutType === layout.id;
                return (
                  <button
                    key={layout.id}
                    type="button"
                    onClick={() => currentPage && onLayoutChange?.(layout.id)}
                    className={`h-12 rounded-lg border text-xs font-bold transition-all ${
                      active
                        ? 'border-katalog-gold bg-katalog-gold/15 text-white'
                        : 'border-white/5 bg-katalog-bg-card text-white/50 hover:border-white/10'
                    }`}
                  >
                    {layout.label}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/30">
              Tema Renkleri
            </h3>
            <div className="flex flex-wrap gap-3">
              {COLOR_PALETTES.slice(0, 4).map((palette) => {
                const active = accentColor === palette.accent;
                return (
                  <button
                    key={palette.id}
                    type="button"
                    aria-label={palette.name}
                    onClick={() =>
                      setStyle({
                        colorTheme: palette.primary,
                        accentColor: palette.accent,
                        backgroundColor: palette.background,
                      })
                    }
                    className={`h-8 w-8 rounded-full border-2 transition-transform ${
                      active ? 'scale-110 border-white' : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: palette.primary }}
                  />
                );
              })}
            </div>
          </section>

          <section className="rounded-xl border border-white/5 bg-katalog-bg-accent/50 p-4">
            <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">
              Katalog Durumu
            </p>
            <div className="mt-3 flex items-end justify-between">
              <p className="font-serif text-2xl text-white">{selectedProductCount}</p>
              <p className="text-xs text-katalog-gold">Ürün seçildi</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
