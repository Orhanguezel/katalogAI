// =============================================================
// FILE: src/app/(main)/admin/(admin)/product-sources/_components/product-source-form.tsx
// Product Source — Create/Edit Form (Sheet)
// =============================================================

'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import {
  useCreateProductSourceAdminMutation,
  useUpdateProductSourceAdminMutation,
} from '@/integrations/hooks';
import type { ProductSourceDto, SourceType } from '@/integrations/shared';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source: ProductSourceDto | null;
}

export default function ProductSourceForm({ open, onOpenChange, source }: Props) {
  const t = useAdminT('admin.productSources');
  const [createSource, { isLoading: isCreating }] = useCreateProductSourceAdminMutation();
  const [updateSource, { isLoading: isUpdating }] = useUpdateProductSourceAdminMutation();
  const isEdit = !!source;

  const [name, setName] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [sourceType, setSourceType] = React.useState<SourceType>('database');
  const [dbHost, setDbHost] = React.useState('127.0.0.1');
  const [dbPort, setDbPort] = React.useState('3306');
  const [dbName, setDbName] = React.useState('');
  const [dbUser, setDbUser] = React.useState('');
  const [dbPassword, setDbPassword] = React.useState('');
  const [defaultLocale, setDefaultLocale] = React.useState('de');
  const [hasSubcategories, setHasSubcategories] = React.useState(false);
  const [imageBaseUrl, setImageBaseUrl] = React.useState('');
  const [isActive, setIsActive] = React.useState(true);

  React.useEffect(() => {
    if (source) {
      setName(source.name ?? '');
      setSlug(source.slug ?? '');
      setSourceType(source.source_type ?? 'database');
      setDbHost(source.db_host ?? '127.0.0.1');
      setDbPort(String(source.db_port ?? 3306));
      setDbName(source.db_name ?? '');
      setDbUser(source.db_user ?? '');
      setDbPassword('');
      setDefaultLocale(source.default_locale ?? 'tr');
      setHasSubcategories(!!source.has_subcategories);
      setImageBaseUrl(source.image_base_url ?? '');
      setIsActive(Boolean(source.is_active));
    } else {
      setName('');
      setSlug('');
      setSourceType('database');
      setDbHost('127.0.0.1');
      setDbPort('3306');
      setDbName('');
      setDbUser('');
      setDbPassword('');
      setDefaultLocale('de');
      setHasSubcategories(false);
      setImageBaseUrl('');
      setIsActive(true);
    }
  }, [source, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      slug,
      source_type: sourceType,
      ...(sourceType === 'database' && {
        db_host: dbHost,
        db_port: Number(dbPort),
        db_name: dbName,
        db_user: dbUser,
        ...(dbPassword && { db_password: dbPassword }),
      }),
      default_locale: defaultLocale,
      has_subcategories: hasSubcategories,
      image_base_url: imageBaseUrl,
      is_active: isActive,
    };

    try {
      if (isEdit && source) {
        await updateSource({ id: source.id, patch: payload }).unwrap();
        toast.success(t('messages.updated') || 'Kaynak güncellendi.');
      } else {
        await createSource(payload).unwrap();
        toast.success(t('messages.created') || 'Kaynak oluşturuldu.');
      }
      onOpenChange(false);
    } catch (err) {
      toast.error(t('messages.saveFailed') || 'Kaynak kaydedilirken hata oluştu.');
      console.error('ProductSource save error:', err);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl border-white/10 bg-katalog-bg-panel p-0 text-white overflow-hidden flex flex-col">
        <div className="p-8 pb-4 shrink-0">
          <SheetHeader className="space-y-1">
            <SheetTitle className="font-serif text-[28px] leading-none text-katalog-gold">
              {isEdit ? (t('actions.edit') || 'Kaynak Düzenle') : (t('actions.create') || 'Yeni Kaynak Ekle')}
            </SheetTitle>
            <SheetDescription className="text-katalog-text-dim text-sm">
              {t('header.description') || 'Kataloglarda kullanılacak ürün kaynaklarını yönetin.'}
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-2 custom-scrollbar">
          <form id="product-source-form" onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-white/60">{t('form.name') || 'Kaynak Adı'}</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('form.namePlaceholder') || 'Örn: Bereket Fide'}
                  required
                  className="h-11 border-white/8 bg-katalog-bg-card text-white placeholder:text-katalog-text-dim focus:border-katalog-gold transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-white/60">{t('form.slug') || 'Slug'}</Label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder={t('form.slugPlaceholder') || 'Örn: bereket-fide'}
                  required
                  className="h-11 border-white/8 bg-katalog-bg-card text-white placeholder:text-katalog-text-dim focus:border-katalog-gold transition-all font-mono text-sm"
                />
              </div>
            </div>

            <div className="h-px bg-white/5" />

            {!isEdit && (
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-white/60">{t('form.sourceType') || 'Kaynak Tipi'}</Label>
                <Select value={sourceType} onValueChange={(v) => setSourceType(v as SourceType)}>
                  <SelectTrigger className="h-11 border-white/8 bg-katalog-bg-card text-white focus:border-katalog-gold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-katalog-bg-panel border-white/10 text-white">
                    <SelectItem value="database">{t('sourceTypes.database') || 'Veritabanı'}</SelectItem>
                    <SelectItem value="import">{t('sourceTypes.import') || 'Excel / CSV'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {sourceType === 'database' && (
              <div className="space-y-6 bg-white/2 p-5 rounded-xl border border-white/5">
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-3 space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-white/60">{t('form.dbHost') || 'Veritabanı Sunucusu'}</Label>
                    <Input
                      value={dbHost}
                      onChange={(e) => setDbHost(e.target.value)}
                      className="h-11 border-white/8 bg-katalog-bg-card text-white focus:border-katalog-gold transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-white/60">{t('form.dbPort') || 'Port'}</Label>
                    <Input
                      type="number"
                      value={dbPort}
                      onChange={(e) => setDbPort(e.target.value)}
                      className="h-11 border-white/8 bg-katalog-bg-card text-white focus:border-katalog-gold transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-white/60">{t('form.dbName') || 'Veritabanı Adı'}</Label>
                  <Input
                    value={dbName}
                    onChange={(e) => setDbName(e.target.value)}
                    className="h-11 border-white/8 bg-katalog-bg-card text-white focus:border-katalog-gold transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-white/60">{t('form.dbUser') || 'Kullanıcı Adı'}</Label>
                    <Input
                      value={dbUser}
                      onChange={(e) => setDbUser(e.target.value)}
                      className="h-11 border-white/8 bg-katalog-bg-card text-white focus:border-katalog-gold transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-white/60">{t('form.dbPassword') || 'Şifre'}</Label>
                    <Input
                      type="password"
                      value={dbPassword}
                      onChange={(e) => setDbPassword(e.target.value)}
                      placeholder={isEdit ? (t('form.dbPasswordEditHint') || '••••• (değiştirmek için yaz)') : (t('form.dbPasswordRequired') || 'Zorunlu')}
                      required={!isEdit}
                      className="h-11 border-white/8 bg-katalog-bg-card text-white focus:border-katalog-gold transition-all placeholder:text-katalog-text-dim"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-white/60">{t('form.defaultLocale') || 'Varsayılan Dil'}</Label>
                <Select value={defaultLocale} onValueChange={setDefaultLocale}>
                  <SelectTrigger className="h-11 border-white/8 bg-katalog-bg-card text-white focus:border-katalog-gold transition-all">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-katalog-bg-panel border-white/10 text-white">
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="tr">Türkçe</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-white/60">{t('form.imageBaseUrl') || 'Görsel Temel URL (opsiyonel)'}</Label>
                <Input
                  value={imageBaseUrl}
                  onChange={(e) => setImageBaseUrl(e.target.value)}
                  placeholder={t('form.imageBaseUrlPlaceholder') || 'Boş bırakılırsa kaynak DB\u2019sinden otomatik alınır'}
                  className="h-11 border-white/8 bg-katalog-bg-card text-white placeholder:text-katalog-text-dim focus:border-katalog-gold transition-all"
                />
                <p className="text-[10px] text-katalog-text-dim leading-relaxed">
                  {t('form.imageBaseUrlHint') || 'Boş bırakılırsa kaynak veritabanındaki firma web adresi kullanılır.'}
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/2 border border-white/5">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold text-white">{t('form.hasSubcategories') || 'Alt Kategori Desteği'}</Label>
                  <p className="text-[10px] text-katalog-text-dim">{t('form.hasSubcategoriesHint') || 'Kategori ağacını destekle'}</p>
                </div>
                <Switch
                  checked={hasSubcategories}
                  onCheckedChange={setHasSubcategories}
                  className="data-[state=checked]:bg-katalog-gold"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/2 border border-white/5">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold text-white">{t('form.isActive') || 'Aktif'}</Label>
                  <p className="text-[10px] text-katalog-text-dim">{t('form.isActiveHint') || 'Kaynağı kullanıma aç/kapat'}</p>
                </div>
                <Switch
                  checked={isActive}
                  onCheckedChange={setIsActive}
                  className="data-[state=checked]:bg-katalog-gold"
                />
              </div>
            </div>

            <div className="h-px bg-white/5" />

            <div className="rounded-xl border border-katalog-gold/20 bg-katalog-gold/5 p-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-katalog-gold mb-1.5">
                {t('form.brandSourceTitle') || 'Marka Bilgileri Otomatik'}
              </h3>
              <p className="text-[11px] text-katalog-text-dim leading-relaxed">
                {t('form.brandSourceDescription') || 'Firma adı, logo, telefon, adres, sosyal medya ve ürün görselleri kaynak veritabanından anlık çekilir. Manuel giriş gerekmez.'}
              </p>
            </div>
          </form>
        </div>

        <div className="p-8 border-t border-white/5 bg-white/2 shrink-0">
          <SheetFooter>
            <Button
              type="submit"
              form="product-source-form"
              disabled={isCreating || isUpdating}
              className="w-full h-12 rounded-xl bg-katalog-gold font-bold text-katalog-bg-deep shadow-lg shadow-katalog-gold/20 hover:bg-katalog-gold-light transition-all text-base"
            >
              {isEdit ? (t('actions.save') || 'Kaydet') : (t('actions.create') || 'Kaynak Ekle')}
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
