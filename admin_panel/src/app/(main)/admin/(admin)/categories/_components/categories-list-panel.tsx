// =============================================================
// FILE: src/app/(main)/admin/(admin)/categories/_components/categories-list-panel.tsx
// Categories List Panel
// =============================================================

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RefreshCw, Plus, Pencil, Trash2, Layers } from 'lucide-react';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { useAdminLocales } from '@/app/(main)/admin/_components/common/use-admin-locales';
import { AdminLocaleSelect } from '@/app/(main)/admin/_components/common/admin-locale-select';
import { resolveAdminApiLocale } from '@/i18n/admin-locale';
import { localeShortClient, localeShortClientOr } from '@/i18n/locale-short-client';
import { toast } from 'sonner';
import {
  useListCategoriesAdminQuery,
  useToggleCategoryActiveAdminMutation,
  useToggleCategoryFeaturedAdminMutation,
  useDeleteCategoryAdminMutation,
} from '@/integrations/endpoints/admin/categories-admin-endpoints';
import {
  buildCategoryImageSrc,
  CATEGORY_MODULE_KEYS,
  CATEGORY_DEFAULT_LOCALE,
  buildCategoriesListQueryParams,
  buildCategoryLocaleOptions,
  buildCategoryToastMessage,
  getCategoryApiOrigin,
  type AdminLocaleOption,
  type CategoryDto,
} from '@/integrations/shared';

export default function CategoriesListPanel({ initialModuleKey }: { initialModuleKey?: string }) {
  const t = useAdminT('admin.categories');
  const router = useRouter();
  const apiOrigin = React.useMemo(() => getCategoryApiOrigin(), []);

  // Locale management (like CustomPage)
  const {
    localeOptions,
    defaultLocaleFromDb,
    loading: localesLoading,
    fetching: localesFetching,
  } = useAdminLocales();

  const apiLocale = React.useMemo(() => {
    return resolveAdminApiLocale(localeOptions as any, defaultLocaleFromDb, CATEGORY_DEFAULT_LOCALE);
  }, [localeOptions, defaultLocaleFromDb]);

  // Filters
  const [search, setSearch] = React.useState('');
  const [locale, setLocale] = React.useState(CATEGORY_DEFAULT_LOCALE);
  const [moduleKey, setModuleKey] = React.useState(initialModuleKey || '');
  const [showOnlyActive, setShowOnlyActive] = React.useState(false);
  const [showOnlyFeatured, setShowOnlyFeatured] = React.useState(false);

  // Initialize locale state with default from DB
  React.useEffect(() => {
    if (!localeOptions || localeOptions.length === 0) return;

    setLocale((prev) => {
      if (prev) return prev;
      return localeShortClientOr(apiLocale, CATEGORY_DEFAULT_LOCALE);
    });
  }, [localeOptions, apiLocale]);

  // Effective locale for query
  const effectiveLocale = React.useMemo(() => {
    const f = localeShortClient(locale);
    return f || apiLocale;
  }, [locale, apiLocale]);

  // admin-locale-select options
  const adminLocaleOptions: AdminLocaleOption[] = React.useMemo(() => {
    return buildCategoryLocaleOptions(localeOptions, localeShortClient);
  }, [localeOptions]);

  // Build query params
  const queryParams = React.useMemo(() => {
    return buildCategoriesListQueryParams({
      search,
      locale: effectiveLocale,
      moduleKey,
      showOnlyActive,
      showOnlyFeatured,
    });
  }, [search, effectiveLocale, moduleKey, showOnlyActive, showOnlyFeatured]);

  // RTK Query - Fetch categories
  const { data: categories = [], isFetching, refetch } = useListCategoriesAdminQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  } as any);

  const busy = isFetching || localesLoading || localesFetching;

  // RTK Mutations
  const [toggleActive] = useToggleCategoryActiveAdminMutation();
  const [toggleFeatured] = useToggleCategoryFeaturedAdminMutation();
  const [deleteCategory] = useDeleteCategoryAdminMutation();

  const handleRefresh = () => {
    toast.info(t('list.refreshing'));
    refetch();
  };

  const handleCreate = () => {
    router.push('/admin/categories/new');
  };

  const handleEdit = (item: CategoryDto) => {
    router.push(`/admin/categories/${item.id}`);
  };

  const handleDelete = async (item: CategoryDto) => {
    if (!confirm(t('messages.confirmDelete', { title: item.name }))) {
      return;
    }

    try {
      await deleteCategory(item.id).unwrap();
      toast.success(buildCategoryToastMessage(item.name, t('messages.deleted')));
      refetch();
    } catch (error) {
      toast.error(`${t('messages.deleteError')}: ${error}`);
    }
  };

  const handleToggleActive = async (item: CategoryDto, value: boolean) => {
    try {
      await toggleActive({ id: item.id, is_active: value }).unwrap();
      toast.success(buildCategoryToastMessage(item.name, value ? t('list.activated') : t('list.deactivated')));
      refetch();
    } catch (error) {
      toast.error(`${t('messages.errorPrefix')}: ${error}`);
    }
  };

  const handleToggleFeatured = async (item: CategoryDto, value: boolean) => {
    try {
      await toggleFeatured({ id: item.id, is_featured: value }).unwrap();
      toast.success(buildCategoryToastMessage(item.name, value ? t('list.featured') : t('list.unfeatured')));
      refetch();
    } catch (error) {
      toast.error(`${t('messages.errorPrefix')}: ${error}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header + Filters */}
      <div className="bg-katalog-bg-card border border-white/5 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col gap-6">
          {/* Top Row: Search + Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="group relative">
                <Input
                  placeholder={t('filters.searchPlaceholder') || 'İsim veya slug ile ara...'}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  disabled={isFetching}
                  className="h-11 border-white/8 bg-katalog-bg-deep text-white placeholder:text-katalog-text-dim focus:border-katalog-gold transition-all pl-10"
                />
                <RefreshCw className={`absolute left-3 top-3.5 h-4 w-4 text-katalog-text-dim transition-opacity ${busy ? 'opacity-100 animate-spin' : 'opacity-40'}`} />
              </div>
            </div>

            {/* Locale Filter */}
            <div className="w-full lg:w-56">
              <AdminLocaleSelect
                value={locale || effectiveLocale}
                onChange={(v) => setLocale(v)}
                options={adminLocaleOptions}
                loading={localesLoading || localesFetching}
                disabled={busy}
                label={t('filters.locale')}
              />
            </div>

            {/* Module Filter */}
            <Select value={moduleKey || 'all'} onValueChange={(v) => setModuleKey(v === 'all' ? '' : v)} disabled={busy}>
              <SelectTrigger className="h-11 w-full lg:w-56 border-white/8 bg-katalog-bg-deep text-white focus:border-katalog-gold shadow-none">
                <SelectValue placeholder={t('filters.allModules') || 'Tüm Modüller'} />
              </SelectTrigger>
              <SelectContent className="bg-katalog-bg-panel border-white/10 text-white">
                <SelectItem value="all">{t('filters.allModules') || 'Tüm Modüller'}</SelectItem>
                {CATEGORY_MODULE_KEYS.map((moduleKeyOption) => (
                  <SelectItem key={moduleKeyOption} value={moduleKeyOption} className="focus:bg-white/5 cursor-pointer">
                    {t(`modules.${moduleKeyOption}`) || moduleKeyOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="h-px bg-white/5" />

          {/* Bottom Row: Toggles + Actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Toggles */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3 group cursor-pointer" onClick={() => !busy && setShowOnlyActive(!showOnlyActive)}>
                <Switch
                  id="active-filter"
                  checked={showOnlyActive}
                  onCheckedChange={setShowOnlyActive}
                  disabled={busy}
                  className="data-[state=checked]:bg-katalog-gold"
                />
                <Label htmlFor="active-filter" className="text-xs font-bold uppercase tracking-widest text-katalog-text-dim cursor-pointer group-hover:text-white transition-colors">
                  {t('filters.onlyActive') || 'Sadece Aktif'}
                </Label>
              </div>

              <div className="flex items-center gap-3 group cursor-pointer" onClick={() => !busy && setShowOnlyFeatured(!showOnlyFeatured)}>
                <Switch
                  id="featured-filter"
                  checked={showOnlyFeatured}
                  onCheckedChange={setShowOnlyFeatured}
                  disabled={busy}
                  className="data-[state=checked]:bg-katalog-gold"
                />
                <Label htmlFor="featured-filter" className="text-xs font-bold uppercase tracking-widest text-katalog-text-dim cursor-pointer group-hover:text-white transition-colors">
                  {t('filters.onlyFeatured') || 'Sadece Öne Çıkan'}
                </Label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleRefresh} 
                disabled={busy}
                className="h-11 w-11 rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 text-katalog-text-dim hover:text-white"
              >
                <RefreshCw className={`h-5 w-5 ${busy ? 'animate-spin' : ''}`} />
              </Button>
              <Button 
                onClick={handleCreate} 
                disabled={busy}
                className="h-11 rounded-xl bg-katalog-gold px-6 font-bold text-katalog-bg-deep shadow-lg shadow-katalog-gold/20 hover:bg-katalog-gold-light transition-all"
              >
                <Plus className="mr-2 h-5 w-5" />
                {t('actions.create') || 'Yeni Kategori'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-katalog-bg-card border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="flex items-center justify-between p-6 bg-white/[0.02] border-b border-white/5">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-katalog-gold/10 flex items-center justify-center">
                <Layers className="h-4 w-4 text-katalog-gold" />
             </div>
             <span className="font-serif text-xl text-white">{t('list.title') || 'Kategori Listesi'}</span>
          </div>
          <Badge className="bg-katalog-gold/10 text-katalog-gold border-none font-mono text-[10px] tracking-widest uppercase py-1 px-3">
            {t('list.total') || 'Toplam'}: {categories.length}
          </Badge>
        </div>

        <div>
          {busy && categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <RefreshCw className="h-10 w-10 text-katalog-gold/20 animate-spin" />
              <p className="text-sm text-katalog-text-dim italic">{t('list.loading') || 'Yükleniyor...'}</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Layers className="h-16 w-16 text-katalog-text-dim/10" />
              <p className="text-lg font-serif text-katalog-text-dim italic">{t('list.noData') || 'Kayıt bulunamadı.'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <Table>
                <TableHeader className="bg-white/2">
                  <TableRow className="hover:bg-transparent border-white/5">
                    <TableHead className="w-16 pl-6 text-white/40 text-[10px] font-black uppercase tracking-widest">GÖRSEL</TableHead>
                    <TableHead className="text-white font-bold">{t('table.name') || 'KATEGORİ ADI'}</TableHead>
                    <TableHead className="text-white font-bold w-32">{t('table.locale') || 'DİL'}</TableHead>
                    <TableHead className="text-white font-bold w-40">{t('table.module') || 'MODÜL'}</TableHead>
                    <TableHead className="w-24 text-center text-white font-bold">{t('table.active') || 'AKTİF'}</TableHead>
                    <TableHead className="w-24 text-center text-white font-bold">{t('table.featured') || 'ÖNE ÇIKAN'}</TableHead>
                    <TableHead className="w-24 text-right pr-6"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((item, index) => (
                    <TableRow key={item.id} className="hover:bg-white/2 border-white/5 transition-colors group">
                      <TableCell className="pl-6 py-4">
                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-white/5 bg-katalog-bg-deep group-hover:border-katalog-gold/20 transition-all">
                          {item.image_url ? (
                            <img
                              src={buildCategoryImageSrc(apiOrigin, item.image_url)}
                              alt={item.name || ''}
                              className="h-full w-full object-cover"
                              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                            />
                          ) : (
                            <Layers className="h-5 w-5 text-katalog-text-dim/40 group-hover:text-katalog-gold transition-colors" />
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-bold text-white group-hover:text-katalog-gold transition-colors">{item.name}</div>
                          <div className="flex items-center gap-2">
                             <code className="text-[10px] text-katalog-text-dim font-mono bg-white/5 px-1.5 py-0.5 rounded uppercase">{item.slug}</code>
                             {item.description && (
                               <span className="text-[11px] text-katalog-text-dim line-clamp-1 italic">— {item.description}</span>
                             )}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline" className="border-katalog-gold/20 text-katalog-gold bg-katalog-gold/5 font-mono text-xs font-bold">
                          {(item.locale || '').toUpperCase()}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <Badge variant="secondary" className="bg-white/5 text-katalog-text-dim hover:bg-white/10 transition-colors uppercase text-[10px] font-black tracking-widest border border-white/5">
                          {t(`modules.${item.module_key}`) || item.module_key}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-center">
                        <Switch
                          checked={item.is_active}
                          onCheckedChange={(value) => handleToggleActive(item, value)}
                          disabled={busy}
                          className="data-[state=checked]:bg-emerald-500"
                        />
                      </TableCell>

                      <TableCell className="text-center">
                        <Switch
                          checked={item.is_featured}
                          onCheckedChange={(value) => handleToggleFeatured(item, value)}
                          disabled={busy}
                          className="data-[state=checked]:bg-katalog-gold"
                        />
                      </TableCell>

                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(item)}
                            disabled={busy}
                            className="h-9 w-9 rounded-lg hover:bg-white/5 text-katalog-text-dim hover:text-white"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item)}
                            disabled={busy}
                            className="h-9 w-9 rounded-lg hover:bg-red-400/10 text-katalog-text-dim hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
