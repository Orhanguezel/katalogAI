// =============================================================
// FILE: src/app/(main)/admin/(admin)/catalogs/_components/catalog-create-dialog.tsx
// Catalog Create Dialog — Source select fills brand info
// =============================================================

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useCreateCatalogAdminMutation,
  useLazyGetProductSourceBrandInfoAdminQuery,
  useListProductSourcesAdminQuery,
} from '@/integrations/hooks';
import type { CatalogCreatePayload, ProductSourceBrandInfo } from '@/integrations/shared';
import { CATALOG_TEMPLATES } from '../../catalogs/[id]/_config/catalog-templates';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function brandInfoToContact(info: ProductSourceBrandInfo): Record<string, string> {
  const contact: Record<string, string> = {};
  if (info.contact.website) contact.website = info.contact.website;
  if (info.contact.email) contact.email = info.contact.email;
  if (info.contact.phones[0]) contact.phone = info.contact.phones[0];
  if (info.contact.whatsappNumber) contact.whatsapp = info.contact.whatsappNumber;
  if (info.contact.address) contact.address = info.contact.address;
  if (info.contact.addressSecondary) contact.addressSecondary = info.contact.addressSecondary;
  return contact;
}

export default function CatalogCreateDialog({ open, onOpenChange }: Props) {
  const router = useRouter();
  const [createCatalog, { isLoading }] = useCreateCatalogAdminMutation();
  const { data: sources } = useListProductSourcesAdminQuery();
  const [fetchBrandInfo, { isFetching: isLoadingBrand }] = useLazyGetProductSourceBrandInfoAdminQuery();

  const [sourceId, setSourceId] = React.useState('_none');
  const [title, setTitle] = React.useState('');
  const [brandName, setBrandName] = React.useState('');
  const [season, setSeason] = React.useState('');
  const [logoUrl, setLogoUrl] = React.useState('');
  const [locale, setLocale] = React.useState('tr');
  const [templateId, setTemplateId] = React.useState('classic');
  const [contact, setContact] = React.useState<Record<string, string>>({});

  const selectedTemplate = CATALOG_TEMPLATES.find((t) => t.id === templateId);

  const handleSourceChange = async (id: string) => {
    setSourceId(id);
    if (id === '_none') {
      setBrandName('');
      setTitle('');
      setSeason('');
      setLogoUrl('');
      setContact({});
      return;
    }
    const src = sources?.find((s) => s.id === id);
    if (!src) return;
    setLocale(src.default_locale || 'tr');
    setBrandName(src.name || '');
    setTitle('');
    setSeason('');
    setLogoUrl('');
    setContact({});

    try {
      const info = await fetchBrandInfo({ id, locale: src.default_locale || undefined }).unwrap();
      setBrandName(info.contact.companyName || info.contact.shortName || src.name || '');
      setTitle(info.profile.headline || info.site_title || '');
      setLogoUrl(info.logo.logo_url || '');
      setContact(brandInfoToContact(info));
    } catch (err) {
      console.error('Brand info fetch failed:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (sourceId === '_none') {
      // Hedef marka zorunlu — Kaydet sonrasi otomatik sync icin gerekli.
      return;
    }

    const catalogTitle = title.trim() || (brandName ? `${brandName} Kataloğu` : 'Yeni Katalog');

    const payload: CatalogCreatePayload = {
      title: catalogTitle,
      target_source_id: sourceId,
      brand_name: brandName.trim() || undefined,
      season: season.trim() || undefined,
      logo_url: logoUrl.trim() || undefined,
      locale,
      template_id: templateId,
      color_theme: selectedTemplate?.defaults.colorTheme,
      font_family: selectedTemplate?.defaults.fontFamily,
      accent_color: selectedTemplate?.defaults.accentColor,
    };

    if (Object.keys(contact).length) {
      payload.contact_info = contact;
    }

    const result = await createCatalog(payload);
    if ('data' in result && result.data) {
      onOpenChange(false);
      router.push(`/admin/catalogs/${result.data.id}`);
    }
  };

  React.useEffect(() => {
    if (open) {
      setSourceId('_none');
      setTitle('');
      setBrandName('');
      setSeason('');
      setLogoUrl('');
      setContact({});
      setLocale('tr');
      setTemplateId('classic');
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-katalog-bg-panel p-0 text-white sm:max-w-3xl rounded-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="p-8 pb-4 shrink-0">
          <DialogHeader className="space-y-1">
            <DialogTitle className="font-serif text-2xl text-katalog-gold">Yeni Katalog</DialogTitle>
            <DialogDescription className="text-katalog-text-dim text-sm">
              Ürün kataloğunuzu oluşturun, düzenleyin ve yönetin.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-4">
          <form id="create-catalog-form" onSubmit={handleSubmit} className="space-y-5">

            {/* Firma Seçimi — ZORUNLU (Kaydet sonrasi hedef library'ye sync edilir) */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                HEDEF MARKA / KAYNAK <span className="text-red-400">*</span>
              </Label>
              <Select value={sourceId} onValueChange={handleSourceChange}>
                <SelectTrigger className={`h-10 border-white/8 bg-katalog-bg-card text-white ${sourceId === '_none' ? 'border-red-500/40' : ''}`}>
                  <SelectValue placeholder="Marka secin..." />
                </SelectTrigger>
                <SelectContent className="bg-katalog-bg-panel border-white/10 text-white">
                  {sources?.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[10px] text-katalog-text-dim leading-relaxed">
                Bu katalog kaydedildiginde secilen markanin Library tablosuna TASLAK
                olarak otomatik gonderilir. Marka sahibi kendi panelinden onaylar.
              </p>
              {isLoadingBrand && (
                <p className="text-[10px] text-katalog-text-dim flex items-center gap-1.5">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Marka bilgileri kaynak veritabanindan cekiliyor...
                </p>
              )}
            </div>

            {/* Şablon (kompakt) */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40">ŞABLON</Label>
              <div className="grid grid-cols-6 gap-2">
                {CATALOG_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => setTemplateId(tmpl.id)}
                    className={`rounded-lg border-2 p-1.5 text-center transition-all ${
                      templateId === tmpl.id ? 'border-katalog-gold bg-katalog-gold/5' : 'border-white/5 bg-katalog-bg-card hover:border-white/15'
                    }`}
                  >
                    <div className="aspect-square rounded mb-1 flex items-center justify-center" style={{ backgroundColor: tmpl.defaults.colorTheme }}>
                      <span className="text-sm font-bold font-serif" style={{ color: tmpl.defaults.backgroundColor }}>Aa</span>
                    </div>
                    <p className="text-[8px] font-bold text-white truncate">{tmpl.name}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-white/5" />

            {/* Katalog Bilgileri */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40">MARKA ADI</Label>
                <Input value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Örn: Bereket Fide" className="h-9 border-white/8 bg-katalog-bg-card text-white text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40">KATALOG BAŞLIĞI</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Örn: Fide Üretim Kataloğu" className="h-9 border-white/8 bg-katalog-bg-card text-white text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40">DÖNEM / SEZON</Label>
                <Input value={season} onChange={(e) => setSeason(e.target.value)} placeholder="Örn: 2026 İlkbahar" className="h-9 border-white/8 bg-katalog-bg-card text-white text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40">DİL</Label>
                <Select value={locale} onValueChange={setLocale}>
                  <SelectTrigger className="h-9 border-white/8 bg-katalog-bg-card text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-katalog-bg-panel border-white/10 text-white">
                    <SelectItem value="tr">Türkçe</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Logo */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40">LOGO URL (opsiyonel)</Label>
              <div className="flex items-center gap-3">
                {logoUrl && (
                  <div className="h-9 w-16 rounded border border-white/10 bg-white overflow-hidden flex items-center justify-center p-1">
                    <img src={logoUrl} alt="" className="h-full w-auto object-contain" />
                  </div>
                )}
                <Input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="Logo URL..." className="h-9 flex-1 border-white/8 bg-katalog-bg-card text-white text-xs" />
              </div>
            </div>
          </form>
        </div>

        <div className="p-5 border-t border-white/5 shrink-0">
          <DialogFooter className="flex-row justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="h-9 rounded-xl border border-white/10 text-katalog-text-dim hover:bg-white/5">
              Vazgeç
            </Button>
            <Button type="submit" form="create-catalog-form" disabled={isLoading || sourceId === '_none'} className="h-9 rounded-xl bg-katalog-gold px-6 font-bold text-katalog-bg-deep hover:bg-katalog-gold-light disabled:opacity-40">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              Yeni Katalog
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
