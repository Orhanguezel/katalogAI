'use client';

// =============================================================
// FILE: src/app/(main)/admin/(admin)/site-settings/_components/admin-site-settings-client.tsx
// =============================================================

import * as React from 'react';
import { toast } from 'sonner';
import { Search, RefreshCcw } from 'lucide-react';
import { useAdminTranslations } from '@/i18n';
import { usePreferencesStore } from '@/stores/preferences/preferences-provider';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { SiteSettingsList } from './site-settings-list';

// tabs (content sources)
import { GeneralSettingsTab } from '../tabs/general-settings-tab';
import { SeoSettingsTab } from '../tabs/seo-settings-tab';
import { SmtpSettingsTab } from '../tabs/smtp-settings-tab';
import { CloudinarySettingsTab } from '../tabs/cloudinary-settings-tab';
import { BrandMediaTab } from '../tabs/brand-media-tab';
import { ApiSettingsTab } from '../tabs/api-settings-tab';
import { LocalesSettingsTab } from '../tabs/locales-settings-tab';
import { BrandingSettingsTab } from '../tabs/branding-settings-tab';

import type { SiteSetting } from '@/integrations/shared';
import {
  SITE_SETTINGS_BRAND,
  SITE_SETTINGS_BRAND_PREFIX,
  buildSiteSettingsLocalesOptions,
  getErrorMessage,
  isSiteSettingsGlobalTab,
  pickInitialSiteSettingsLocale,
  type SiteSettingsLocaleOption,
  type SiteSettingsTab,
} from '@/integrations/shared';
import {
  useListSiteSettingsAdminQuery,
  useDeleteSiteSettingAdminMutation,
} from '@/integrations/hooks';

/* ----------------------------- list panels ----------------------------- */

function ListPanel({
  locale,
  search,
  prefix,
  onDeleteRow,
}: {
  locale: string; // selected locale OR '*'
  search: string;
  prefix?: string;
  onDeleteRow: (row: SiteSetting) => void;
}) {
  const qArgs = React.useMemo(() => {
    const q = search.trim() || undefined;
    return {
      locale,
      q,
      prefix: prefix || undefined,
      sort: 'key' as const,
      order: 'asc' as const,
      limit: 200,
      offset: 0,
    };
  }, [locale, search, prefix]);

  const listQ = useListSiteSettingsAdminQuery(qArgs, {
    skip: !locale,
    refetchOnMountOrArgChange: true,
  });

  const loading = listQ.isLoading || listQ.isFetching;

  return (
    <SiteSettingsList
      settings={(listQ.data ?? []) as SiteSetting[]}
      loading={loading}
      selectedLocale={locale}
      onDelete={onDeleteRow}
      getEditHref={(s) => `/admin/site-settings/${encodeURIComponent(String(s.key || ''))}?locale=${encodeURIComponent(locale)}`}
    />
  );
}

/* ----------------------------- main component ----------------------------- */

export default function AdminSiteSettingsClient() {
  const brand = SITE_SETTINGS_BRAND;
  const brandPrefix = SITE_SETTINGS_BRAND_PREFIX;
  const isScopedBrand = true;
  const appLocalesKey = `${brandPrefix || ''}app_locales`;
  const localeSettingsQ = useListSiteSettingsAdminQuery({
    locale: '*',
    keys: [appLocalesKey],
    limit: 20,
    offset: 0,
    sort: 'key',
    order: 'asc',
  });

  const localeRows = React.useMemo(() => {
    const row = (localeSettingsQ.data ?? []).find((item) => item.key === appLocalesKey);
    return Array.isArray(row?.value) ? row.value : [];
  }, [localeSettingsQ.data, appLocalesKey]);

  const localeOptions: SiteSettingsLocaleOption[] = React.useMemo(
    () => buildSiteSettingsLocalesOptions(localeRows as any),
    [localeRows],
  );

  const initialLocale = React.useMemo(
    () => pickInitialSiteSettingsLocale(localeRows as any),
    [localeRows],
  );

  const [tab, setTab] = React.useState<SiteSettingsTab>('general');
  const [search, setSearch] = React.useState('');
  const [locale, setLocale] = React.useState<string>('');
  const [localeTouched, setLocaleTouched] = React.useState<boolean>(false);

  const [deleteSetting, { isLoading: isDeleting }] = useDeleteSiteSettingAdminMutation();

  const adminLocale = usePreferencesStore((s) => s.adminLocale);
  const t = useAdminTranslations(adminLocale || undefined);

  // Otomatik dil seçimi: varsayılan aktif dili kullan
  React.useEffect(() => {
    if (localeTouched) return;
    if (initialLocale) {
      setLocale(initialLocale);
    }
  }, [initialLocale, localeTouched]);

  const headerLoading =
    localeSettingsQ.isFetching ||
    localeSettingsQ.isLoading;

  const disabled = headerLoading || isDeleting;

  const onRefresh = async () => {
    try {
      await localeSettingsQ.refetch();
      toast.success(t('admin.siteSettings.filters.refreshed'));
    } catch (err) {
      toast.error(getErrorMessage(err, t('admin.siteSettings.messages.error')));
    }
  };

  const handleDeleteRow = async (row: SiteSetting) => {
    const key = String(row?.key || '').trim();
    const rowLocale = row?.locale ? String(row.locale) : undefined;
    if (!key) return;

    const ok = window.confirm(
      t('admin.siteSettings.list.deleteConfirm', { key, locale: rowLocale || locale || '—' }),
    );
    if (!ok) return;

    try {
      await deleteSetting({ key, locale: rowLocale ?? undefined }).unwrap();
      toast.success(t('admin.siteSettings.messages.deleted'));
    } catch (err) {
      toast.error(getErrorMessage(err, t('admin.siteSettings.messages.error')));
    }
  };

  const localeReady = Boolean(locale && locale.trim());
  const isGlobalTab = isSiteSettingsGlobalTab(tab);

  return (
    <div className="mx-auto max-w-7xl space-y-8 py-6 px-2 min-w-0 overflow-hidden pb-12">
      {/* PAGE HEAD */}
      <div className="space-y-1">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-white italic">
          {t('admin.siteSettings.title')}
        </h1>
        <p className="text-sm text-katalog-text-dim max-w-lg">
          {t('admin.siteSettings.description')}
        </p>
      </div>

      {/* FILTERS */}
      <div className="bg-katalog-bg-panel border border-white/5 rounded-2xl overflow-hidden p-6 shadow-2xl">
        <div className="flex items-center gap-2 mb-6">
           <Search className="size-4 text-katalog-gold shrink-0" />
           <span className="text-[10px] font-bold text-katalog-gold uppercase tracking-[.2em]">{t('admin.siteSettings.filters.title')}</span>
           <div className="h-[1px] flex-1 bg-white/5" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 items-end">
          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="q" className="text-xs font-bold text-white/50 uppercase tracking-widest">{t('admin.siteSettings.filters.search')}</Label>
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-white/20 group-focus-within:text-katalog-gold transition-colors" />
              <Input
                id="q"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('admin.siteSettings.filters.searchPlaceholder')}
                className="w-full pl-11 h-11 bg-katalog-bg-card border-white/5 text-white placeholder:text-white/10 rounded-xl focus:ring-1 focus:ring-katalog-gold/50 transition-all shadow-inner"
                disabled={disabled}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-white/50 uppercase tracking-widest">{t('admin.siteSettings.filters.language')}</Label>
            <Select
              value={localeReady ? locale : ''}
              onValueChange={(v) => {
                setLocaleTouched(true);
                setLocale(v);
              }}
              disabled={disabled || isGlobalTab}
            >
              <SelectTrigger className="w-full h-11 bg-katalog-bg-card border-white/5 text-white rounded-xl">
                <SelectValue
                  placeholder={
                    isGlobalTab
                      ? t('admin.siteSettings.filters.globalPlaceholder')
                      : t('admin.siteSettings.filters.selectLanguage')
                  }
                />
              </SelectTrigger>
              <SelectContent className="bg-katalog-bg-panel border-white/10 text-white">
                {(localeOptions ?? []).map((o) => (
                  <SelectItem key={o.value} value={o.value} className="focus:bg-white/5 focus:text-white">
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 h-11">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onRefresh}
              disabled={disabled}
              className="size-11 shrink-0 bg-white/5 border-white/5 text-white hover:bg-white/10 rounded-xl"
            >
              <RefreshCcw className={cn("size-4", headerLoading ? "animate-spin text-katalog-gold" : "")} />
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSearch('');
                if (!isGlobalTab) {
                  setLocaleTouched(false);
                  setLocale(initialLocale);
                }
              }}
              disabled={disabled}
              className="flex-1 bg-white/5 border-white/5 text-white hover:bg-white/10 rounded-xl font-bold text-[10px] uppercase tracking-widest"
            >
              {t('admin.siteSettings.filters.resetButton')}
            </Button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="bg-katalog-bg-panel border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 bg-white/2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-katalog-gold uppercase tracking-[.2em]">{t('admin.siteSettings.management.title')}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {isGlobalTab ? <Badge className="bg-katalog-gold/10 text-katalog-gold border-katalog-gold/20 text-[10px] font-bold uppercase tracking-widest">{t('admin.siteSettings.badges.global')}</Badge> : null}
              {!isGlobalTab && localeReady ? <Badge className="bg-white/5 text-white/60 border-white/10 text-[10px] font-bold uppercase tracking-widest px-3">{locale}</Badge> : null}
              {disabled ? <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest border-white/5 text-white/20">{t('admin.siteSettings.messages.loading')}</Badge> : null}
            </div>
          </div>
        </div>

        <div className="p-6">
          {!localeReady ? (
            <div className="rounded-xl border border-white/5 bg-white/2 p-12 text-center">
               <Spinner className="mx-auto mb-4 size-8 text-katalog-gold opacity-50" />
               <p className="text-sm text-katalog-text-dim italic">{t('admin.siteSettings.management.loadingMeta')}</p>
            </div>
          ) : (
            <Tabs value={tab} onValueChange={(v) => setTab(v as SiteSettingsTab)}>
              <div className="overflow-x-auto mb-8 bg-katalog-bg-card p-1.5 rounded-xl border border-white/5 overflow-hidden">
                <TabsList className="bg-transparent h-auto w-full justify-start gap-1 p-0 border-none">
                  {[
                    { id: 'list', label: t('admin.siteSettings.tabs.list') },
                    { id: 'global_list', label: t('admin.siteSettings.tabs.globalList') },
                    { id: 'general', label: t('admin.siteSettings.tabs.general') },
                    { id: 'seo', label: t('admin.siteSettings.tabs.seo') },
                    { id: 'smtp', label: t('admin.siteSettings.tabs.smtp') },
                    { id: 'brand_media', label: t('admin.siteSettings.tabs.brandMedia') },
                    { id: 'api', label: t('admin.siteSettings.tabs.apiServices') },
                    { id: 'locales', label: t('admin.siteSettings.tabs.locales') },
                  ].map((tabItem) => (
                    <TabsTrigger 
                      key={tabItem.id} 
                      value={tabItem.id} 
                      className="data-[state=active]:bg-katalog-gold data-[state=active]:text-katalog-bg-deep font-bold text-[10px] uppercase tracking-widest px-5 h-9 rounded-lg transition-all"
                    >
                      {tabItem.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <div className="mt-0">
                <TabsContent value="list" className="m-0 focus-visible:outline-none">
                  <ListPanel locale={locale} search={search} prefix={brandPrefix} onDeleteRow={handleDeleteRow} />
                </TabsContent>

                <TabsContent value="global_list" className="m-0 focus-visible:outline-none">
                  <ListPanel locale="*" search={search} prefix={brandPrefix} onDeleteRow={handleDeleteRow} />
                </TabsContent>

                <TabsContent value="general" className="m-0 focus-visible:outline-none">
                  <div className="bg-katalog-bg-card/40 border border-white/5 rounded-2xl p-6">
                    <GeneralSettingsTab locale={locale} settingPrefix={brandPrefix} />
                  </div>
                </TabsContent>

                <TabsContent value="seo" className="m-0 focus-visible:outline-none">
                   <div className="bg-katalog-bg-card/40 border border-white/5 rounded-2xl p-6">
                      <SeoSettingsTab locale={locale} settingPrefix={brandPrefix} />
                   </div>
                </TabsContent>

                <TabsContent value="smtp" className="m-0 focus-visible:outline-none">
                   <div className="bg-katalog-bg-card/40 border border-white/5 rounded-2xl p-6">
                      <SmtpSettingsTab locale={locale} />
                   </div>
                </TabsContent>

                <TabsContent value="brand_media" className="m-0 focus-visible:outline-none">
                   <div className="bg-katalog-bg-card/40 border border-white/5 rounded-2xl p-6">
                      <BrandMediaTab locale={locale} settingPrefix={brandPrefix} />
                   </div>
                </TabsContent>

                <TabsContent value="api" className="m-0 focus-visible:outline-none">
                   <div className="bg-katalog-bg-card/40 border border-white/5 rounded-2xl p-6">
                     <ApiSettingsTab locale={locale} />
                   </div>
                </TabsContent>

                <TabsContent value="locales" className="m-0 focus-visible:outline-none">
                   <div className="bg-katalog-bg-card/40 border border-white/5 rounded-2xl p-6">
                     <LocalesSettingsTab settingPrefix={brandPrefix} />
                   </div>
                </TabsContent>
              </div>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}
