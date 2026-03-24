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
    <div className="space-y-4">
      {/* Header + Filters */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4">
            {/* Top Row: Search + Filters */}
            <div className="flex flex-col lg:flex-row gap-3">
              {/* Search */}
              <div className="flex-1">
                <Input
                  placeholder={t('filters.searchPlaceholder')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  disabled={isFetching}
                />
              </div>

              {/* Locale Filter - Dynamic from DB using admin-locale-select */}
              <div className="w-full lg:w-45">
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
                <SelectTrigger className="w-full lg:w-45">
                  <SelectValue placeholder={t('filters.allModules')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('filters.allModules')}</SelectItem>
                  {CATEGORY_MODULE_KEYS.map((moduleKeyOption) => (
                    <SelectItem key={moduleKeyOption} value={moduleKeyOption}>
                      {t(`modules.${moduleKeyOption}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Bottom Row: Toggles + Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              {/* Toggles */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id="active-filter"
                    checked={showOnlyActive}
                    onCheckedChange={setShowOnlyActive}
                    disabled={busy}
                  />
                  <Label htmlFor="active-filter" className="text-sm cursor-pointer">
                    {t('filters.onlyActive')}
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="featured-filter"
                    checked={showOnlyFeatured}
                    onCheckedChange={setShowOnlyFeatured}
                    disabled={busy}
                  />
                  <Label htmlFor="featured-filter" className="text-sm cursor-pointer">
                    {t('filters.onlyFeatured')}
                  </Label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={busy}>
                  <RefreshCw className={`h-4 w-4 ${busy ? 'animate-spin' : ''}`} />
                </Button>
                <Button size="sm" onClick={handleCreate} disabled={busy}>
                  <Plus className="h-4 w-4" />
                  {t('actions.create')}
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* List */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t('list.title')}</span>
            <Badge variant="secondary">
              {t('list.total')}: {categories.length}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {busy && categories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {t('list.loading')}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {t('list.noData')}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-14">{t('table.image')}</TableHead>
                    <TableHead className="w-12.5">{t('table.order')}</TableHead>
                    <TableHead>{t('table.name')}</TableHead>
                    <TableHead>{t('table.slug')}</TableHead>
                    <TableHead className="w-25">{t('table.locale')}</TableHead>
                    <TableHead className="w-30">{t('table.module')}</TableHead>
                    <TableHead className="w-20 text-center">{t('table.active')}</TableHead>
                    <TableHead className="w-25 text-center">{t('table.featured')}</TableHead>
                    <TableHead className="w-40 text-right">{t('table.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded border bg-muted/20">
                          {item.image_url ? (
                            <img
                              src={buildCategoryImageSrc(apiOrigin, item.image_url)}
                              alt={item.name || ''}
                              className="h-full w-full object-cover"
                              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                            />
                          ) : (
                            <Layers className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-muted-foreground text-sm">
                        {index + 1}
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-sm">{item.name}</div>
                          {item.description && (
                            <div className="text-xs text-muted-foreground line-clamp-1">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <code className="text-xs">{item.slug}</code>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {item.locale}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {t(`modules.${item.module_key}`)}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-center">
                        <Switch
                          checked={item.is_active}
                          onCheckedChange={(value) => handleToggleActive(item, value)}
                          disabled={busy}
                        />
                      </TableCell>

                      <TableCell className="text-center">
                        <Switch
                          checked={item.is_featured}
                          onCheckedChange={(value) => handleToggleFeatured(item, value)}
                          disabled={busy}
                        />
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleEdit(item)}
                            disabled={busy}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleDelete(item)}
                            disabled={busy}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
