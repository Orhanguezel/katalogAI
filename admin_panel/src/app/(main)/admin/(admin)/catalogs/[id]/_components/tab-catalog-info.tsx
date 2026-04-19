'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ChevronDown, ImagePlus, Loader2, Upload } from 'lucide-react';
import { useCatalogBuilderStore } from '../_store/catalog-builder-store';
import {
  useCreateAssetAdminMutation,
  useListCatalogsAdminQuery,
  useListProductSourcesAdminQuery,
} from '@/integrations/hooks';
import { resolveMediaUrl } from '@/lib/media-url';

/** Combobox: dropdown ile önceki değerlerden seç + input ile düzenle */
function ComboField({
  label,
  value,
  onChange,
  suggestions,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suggestions: string[];
  placeholder?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [showAll, setShowAll] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setShowAll(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const visibleItems = showAll
    ? suggestions.filter((s) => !!s)
    : suggestions.filter((s) => s && s !== value && s.toLowerCase().includes((value || '').toLowerCase()));

  return (
    <div className="space-y-1.5" ref={ref}>
      <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40">{label}</Label>
      <div className="relative">
        <Input
          value={value || ''}
          onChange={(e) => { onChange(e.target.value); setOpen(true); setShowAll(false); }}
          onFocus={() => { setOpen(true); setShowAll(false); }}
          className="h-9 border-white/8 bg-katalog-bg-card text-white pr-8 text-sm"
          placeholder={placeholder}
        />
        {suggestions.length > 0 && (
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
            onClick={() => { setShowAll(true); setOpen(!open); }}
          >
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        )}

        {open && visibleItems.length > 0 && (
          <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-katalog-bg-panel border border-white/10 rounded-lg shadow-2xl max-h-40 overflow-y-auto">
            {visibleItems.map((s) => (
              <button
                key={s}
                type="button"
                className={`w-full px-3 py-2 text-left text-xs truncate transition-colors ${
                  s === value ? 'text-katalog-gold bg-katalog-gold/10 font-bold' : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
                onClick={() => { onChange(s); setOpen(false); setShowAll(false); }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TabCatalogInfo() {
  const store = useCatalogBuilderStore();
  const { data: catalogs } = useListCatalogsAdminQuery();
  const { data: sources } = useListProductSourcesAdminQuery();
  const [createAsset, { isLoading: isUploading }] = useCreateAssetAdminMutation();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Brand adi degisince copyright bos ise '© YYYY <marka>' ile otomatik doldur
  React.useEffect(() => {
    const current = store.contactInfo?.copyright?.trim();
    if (current) return;
    if (!store.brandName) return;
    store.setMeta({
      contactInfo: {
        ...store.contactInfo,
        copyright: `© ${new Date().getFullYear()} ${store.brandName}`,
      },
    });
  }, [store.brandName, store.contactInfo, store.setMeta]);

  const handleLogoUpload = async (file: File) => {
    try {
      const asset = await createAsset({
        file,
        bucket: 'public',
        folder: 'catalog-logos',
      }).unwrap();
      const url = asset.url || '';
      if (!url) {
        toast.error('Yuklenen dosyanin URL si alinamadi.');
        return;
      }
      store.setMeta({ logoUrl: url });
      toast.success('Logo yuklendi.');
    } catch {
      toast.error('Logo yuklenirken hata olustu.');
    }
  };

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) void handleLogoUpload(file);
  };

  // Benzersiz değerleri topla (mevcut kataloglar + kaynaklar)
  const brandSuggestions = React.useMemo(() => {
    const set = new Set<string>();
    catalogs?.items?.forEach((c) => { if (c.brand_name) set.add(c.brand_name); });
    sources?.forEach((s) => { if (s.name) set.add(s.name); });
    return Array.from(set).sort();
  }, [catalogs, sources]);

  const titleSuggestions = React.useMemo(() => {
    const set = new Set<string>();
    catalogs?.items?.forEach((c) => { if (c.title) set.add(c.title); });
    return Array.from(set).sort();
  }, [catalogs]);

  const seasonSuggestions = React.useMemo(() => {
    const set = new Set<string>();
    catalogs?.items?.forEach((c) => { if (c.season) set.add(c.season); });
    // Yaygın sezon seçenekleri
    ['İlkbahar / Yaz 2026', 'Sonbahar / Kış 2026', '2026 Sezonu', '2025-2026'].forEach((s) => set.add(s));
    return Array.from(set).sort();
  }, [catalogs]);

  return (
    <section className="space-y-5">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-katalog-text-dim">
        Katalog Bilgileri
      </h2>

      <ComboField
        label="Marka Adı"
        value={store.brandName}
        onChange={(v) => store.setMeta({ brandName: v })}
        suggestions={brandSuggestions}
        placeholder="Örn: Bereket Fide"
      />

      <ComboField
        label="Alt Başlık"
        value={store.title}
        onChange={(v) => store.setMeta({ title: v })}
        suggestions={titleSuggestions}
        placeholder="Örn: Profesyonel Fide Kataloğu"
      />

      <ComboField
        label="Dönem / Sezon"
        value={store.season}
        onChange={(v) => store.setMeta({ season: v })}
        suggestions={seasonSuggestions}
        placeholder="Örn: İlkbahar / Yaz 2026"
      />

      {/* Logo */}
      <div className="space-y-1.5">
        <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Logo</Label>
        <div className="flex items-center gap-3">
          {store.logoUrl ? (
            <div className="h-10 w-20 rounded-lg border border-white/10 bg-white overflow-hidden flex items-center justify-center p-1">
              <img src={resolveMediaUrl(store.logoUrl)} alt="Logo" className="h-full w-auto object-contain" />
            </div>
          ) : (
            <div className="h-10 w-20 rounded-lg border border-dashed border-white/10 bg-katalog-bg-card flex items-center justify-center">
              <ImagePlus className="h-4 w-4 text-white/20" />
            </div>
          )}
          <Input
            value={store.logoUrl || ''}
            onChange={(e) => store.setMeta({ logoUrl: e.target.value })}
            className="h-9 flex-1 border-white/8 bg-katalog-bg-card text-white text-xs"
            placeholder="Logo URL..."
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPickFile}
          />
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="h-9 shrink-0 border border-white/10 text-katalog-text-dim hover:text-white hover:bg-white/5"
            title="Logo yukle"
          >
            {isUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>

      {/* Fiyat Göstergesi */}
      <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/2 border border-white/5">
        <div className="space-y-0.5">
          <Label className="text-[11px] font-bold text-white">Fiyatları Göster</Label>
          <p className="text-[9px] text-katalog-text-dim">Kapalıysa katalogda hiçbir ürünün fiyatı yer almaz.</p>
        </div>
        <Switch
          checked={!!store.showPrices}
          onCheckedChange={(v) => store.setMeta({ showPrices: v })}
          className="data-[state=checked]:bg-katalog-gold"
        />
      </div>

      {/* İletişim / Footer Bilgileri */}
      <div className="pt-3 border-t border-white/5 space-y-3">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40">İLETİŞİM / FOOTER</h3>

        <div className="space-y-1.5">
          <Label className="text-[9px] font-bold uppercase tracking-widest text-white/30">Website</Label>
          <Input
            value={store.contactInfo?.website || ''}
            onChange={(e) => store.setMeta({ contactInfo: { ...store.contactInfo, website: e.target.value } })}
            className="h-8 border-white/8 bg-katalog-bg-card text-white text-xs"
            placeholder="https://www.example.com"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-[9px] font-bold uppercase tracking-widest text-white/30">E-posta</Label>
          <Input
            value={store.contactInfo?.email || ''}
            onChange={(e) => store.setMeta({ contactInfo: { ...store.contactInfo, email: e.target.value } })}
            className="h-8 border-white/8 bg-katalog-bg-card text-white text-xs"
            placeholder="info@example.com"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-[9px] font-bold uppercase tracking-widest text-white/30">Telefon</Label>
          <Input
            value={store.contactInfo?.phone || ''}
            onChange={(e) => store.setMeta({ contactInfo: { ...store.contactInfo, phone: e.target.value } })}
            className="h-8 border-white/8 bg-katalog-bg-card text-white text-xs"
            placeholder="+90 212 000 00 00"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-[9px] font-bold uppercase tracking-widest text-white/30">Adres</Label>
          <Input
            value={store.contactInfo?.address || ''}
            onChange={(e) => store.setMeta({ contactInfo: { ...store.contactInfo, address: e.target.value } })}
            className="h-8 border-white/8 bg-katalog-bg-card text-white text-xs"
            placeholder="Şehir, Ülke"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-[9px] font-bold uppercase tracking-widest text-white/30">Copyright</Label>
          <Input
            value={store.contactInfo?.copyright || ''}
            onChange={(e) => store.setMeta({ contactInfo: { ...store.contactInfo, copyright: e.target.value } })}
            className="h-8 border-white/8 bg-katalog-bg-card text-white text-xs"
            placeholder={`© ${new Date().getFullYear()} ${store.brandName || 'Firma Adı'}`}
          />
        </div>
      </div>
    </section>
  );
}
