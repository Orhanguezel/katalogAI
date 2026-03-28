// =============================================================
// FILE: src/app/(main)/admin/(admin)/catalogs/[id]/_components/tab-style.tsx
// Settings Tab — Style Customization (Colors, Fonts, Card Style)
// =============================================================

'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { useCatalogBuilderStore } from '../_store/catalog-builder-store';
import { COLOR_PALETTES } from '../_config/color-palettes';
import { FONT_OPTIONS } from '../_config/font-options';

const CARD_STYLES = ['bordered', 'shadow', 'flat', 'rounded', 'glass'] as const;
const IMAGE_ASPECTS = ['1:1', '4:3', '3:4', '16:9'] as const;
const FONT_SIZES = ['sm', 'md', 'lg'] as const;

export default function TabStyle() {
  const t = useAdminT('admin.catalogs');
  const store = useCatalogBuilderStore();

  return (
    <div className="space-y-6">
      {/* Color palette presets */}
      <section className="space-y-3">
        <Label className="text-[11px] font-bold uppercase tracking-widest text-katalog-text-dim">
          {t('settings.presetPalettes') || 'HAZIR PALETLER'}
        </Label>
        <div className="grid grid-cols-7 gap-1.5">
          {COLOR_PALETTES.map((p) => (
            <button
              key={p.id}
              type="button"
              title={p.name}
              onClick={() => store.setStyle({
                colorTheme: p.primary,
                accentColor: p.accent,
                backgroundColor: p.background,
              })}
              className={`w-full aspect-square rounded-full border-2 transition-all hover:scale-110 ${
                store.colorTheme === p.primary ? 'border-white scale-110 shadow-lg shadow-white/10' : 'border-transparent'
              }`}
              style={{
                background: `linear-gradient(135deg, ${p.primary} 50%, ${p.accent} 50%)`,
              }}
            />
          ))}
        </div>
      </section>

      {/* Manual color pickers */}
      <section className="space-y-3 bg-white/3 p-3 rounded-xl border border-white/5">
        <Label className="text-[11px] font-bold uppercase tracking-widest text-katalog-text-dim">{t('settings.colorPalette') || 'RENK AYARLARI'}</Label>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-katalog-text-muted">{t('settings.primaryColor')}</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={store.colorTheme}
                onChange={(e) => store.setStyle({ colorTheme: e.target.value })}
                className="h-6 w-6 rounded-full border-none cursor-pointer bg-transparent"
              />
              <span className="text-[10px] font-mono text-white/50">{store.colorTheme}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-katalog-text-muted">{t('settings.accentColor')}</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={store.accentColor}
                onChange={(e) => store.setStyle({ accentColor: e.target.value })}
                className="h-6 w-6 rounded-full border-none cursor-pointer bg-transparent"
              />
              <span className="text-[10px] font-mono text-white/50">{store.accentColor}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-katalog-text-muted">{t('settings.backgroundColor')}</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={store.backgroundColor}
                onChange={(e) => store.setStyle({ backgroundColor: e.target.value })}
                className="h-6 w-6 rounded-full border-none cursor-pointer bg-transparent"
              />
              <span className="text-[10px] font-mono text-white/50">{store.backgroundColor}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Fonts */}
      <section className="space-y-3">
        <Label className="text-[11px] font-bold uppercase tracking-widest text-katalog-text-dim">{t('settings.fonts') || 'TİPOGRAFİ'}</Label>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <p className="text-[10px] text-katalog-text-dim uppercase tracking-wider font-bold">{t('settings.headingFont')}</p>
            <Select value={store.headingFont} onValueChange={(v) => store.setStyle({ headingFont: v })}>
              <SelectTrigger className="h-9 text-xs bg-katalog-bg-card border-white/5 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-katalog-bg-panel border-white/10 text-white">
                {FONT_OPTIONS.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    <span style={{ fontFamily: f.value }}>{f.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Card style & Aspect */}
      <div className="grid grid-cols-2 gap-3">
        <section className="space-y-3">
          <Label className="text-[11px] font-bold uppercase tracking-widest text-katalog-text-dim">{t('settings.cardStyle') || 'KART STİLİ'}</Label>
          <div className="grid grid-cols-1 gap-1">
            {CARD_STYLES.map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => store.setStyle({ cardStyle: style })}
                className={`h-8 px-3 rounded-lg text-[10px] font-bold border transition-all text-left uppercase tracking-wider ${
                  store.cardStyle === style 
                  ? 'bg-katalog-gold text-katalog-bg-deep border-katalog-gold' 
                  : 'bg-katalog-bg-card text-katalog-text-muted border-white/5 hover:border-white/20'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <Label className="text-[11px] font-bold uppercase tracking-widest text-katalog-text-dim">{t('settings.imageAspect') || 'GÖRSEL ORANI'}</Label>
          <div className="grid grid-cols-1 gap-1">
            {IMAGE_ASPECTS.map((aspect) => (
              <button
                key={aspect}
                type="button"
                onClick={() => store.setStyle({ imageAspect: aspect })}
                className={`h-8 px-3 rounded-lg text-[10px] font-bold border transition-all text-left uppercase tracking-wider ${
                  store.imageAspect === aspect 
                  ? 'bg-katalog-gold text-katalog-bg-deep border-katalog-gold' 
                  : 'bg-katalog-bg-card text-katalog-text-muted border-white/5 hover:border-white/20'
                }`}
              >
                {aspect}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
