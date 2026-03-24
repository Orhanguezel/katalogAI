// =============================================================
// FILE: src/app/(main)/admin/(admin)/categories/_components/category-detail-client.tsx
// Category Detail/Edit Form
// =============================================================

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { usePreferencesStore } from '@/stores/preferences/preferences-provider';
import { AdminLocaleSelect } from '@/app/(main)/admin/_components/common/admin-locale-select';
import { AdminImageUploadField } from '@/app/(main)/admin/_components/common/admin-image-upload-field';
import { useAdminLocales } from '@/app/(main)/admin/_components/common/use-admin-locales';
import { toast } from 'sonner';
import {
  useGetCategoryAdminQuery,
  useCreateCategoryAdminMutation,
  useUpdateCategoryAdminMutation,
} from '@/integrations/endpoints/admin/categories-admin-endpoints';
import {
  buildCategoryLocaleOptions,
  buildCategorySeoPreviewUrl,
  CATEGORY_DETAIL_INPUT_CLASS,
  CATEGORY_DEFAULT_LOCALE,
  CATEGORY_META_DESCRIPTION_LIMIT,
  CATEGORY_META_TITLE_LIMIT,
  CATEGORY_MODULE_KEYS,
  createEmptyCategoryDetailForm,
  mapCategoryToDetailForm,
  type AdminLocaleOption,
  type CategoryDetailTabKey,
} from '@/integrations/shared';

interface Props {
  id: string;
}

export default function CategoryDetailClient({ id }: Props) {
  const t = useAdminT('admin.categories');
  const router = useRouter();
  const adminLocale = usePreferencesStore((s) => s.adminLocale);
  const isNew = id === 'new';

  // Locale management
  const { localeOptions } = useAdminLocales();
  const [activeLocale, setActiveLocale] = React.useState<string>(adminLocale || CATEGORY_DEFAULT_LOCALE);
  const [activeTab, setActiveTab] = React.useState<CategoryDetailTabKey>('content');

  // RTK Query
  const { data: category, isFetching, refetch } = useGetCategoryAdminQuery(
    { id, locale: activeLocale },
    { skip: isNew }
  );

  const [createCategory, { isLoading: isCreating }] = useCreateCategoryAdminMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryAdminMutation();

  // Form state
  const [formData, setFormData] = React.useState(() => createEmptyCategoryDetailForm(activeLocale));

  // Load data when editing/locale changes
  React.useEffect(() => {
    if (category && !isNew) {
      setFormData(
        mapCategoryToDetailForm(category as unknown as Partial<typeof formData>, activeLocale),
      );
    }
  }, [category, isNew, activeLocale]);

  React.useEffect(() => {
    if (!isNew && id) {
      refetch();
    }
  }, [activeLocale, id, isNew, refetch]);

  const handleBack = () => router.push('/admin/categories');

  const handleLocaleChange = (nextLocale: string) => {
    setActiveLocale(nextLocale);
    setFormData((prev) => ({ ...prev, locale: nextLocale }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!formData.name || !formData.slug) {
      toast.error(t('messages.requiredError'));
      return;
    }

    try {
      const payload = { ...formData, locale: activeLocale };

      if (isNew) {
        await createCategory(payload).unwrap();
        toast.success(t('messages.created'));
      } else {
        await updateCategory({ id, patch: payload }).unwrap();
        toast.success(t('messages.updated'));
      }
      router.push('/admin/categories');
    } catch (error: any) {
      const errMsg = error?.data?.error?.message || error?.message || t('messages.unknownError');
      toast.error(`${t('messages.errorPrefix')}: ${errMsg}`);
    }
  };

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (url: string) => {
    setFormData((prev) => ({ ...prev, image_url: url }));
  };

  const isLoading = isFetching || isCreating || isUpdating;

  const localesForSelect = React.useMemo(() => {
    return buildCategoryLocaleOptions(localeOptions, (value) => String(value || ''));
  }, [localeOptions]);

  // SEO preview URL
  const seoPreviewUrl = buildCategorySeoPreviewUrl(
    t('detail.seoPreviewBaseUrl'),
    formData.slug,
    t('detail.seoPreviewSlugFallback'),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle className="text-base">
                  {isNew ? t('actions.create') : t('actions.edit')}
                </CardTitle>
                <CardDescription>
                  {isNew
                    ? t('detail.createDesc')
                    : t('detail.editDescWithName', { name: category?.name || '' })}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AdminLocaleSelect
                options={localesForSelect}
                value={activeLocale}
                onChange={handleLocaleChange}
                disabled={isLoading}
              />
              <Button onClick={() => handleSubmit()} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {t('actions.save')}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as CategoryDetailTabKey)}>
        <TabsList>
          <TabsTrigger value="content">{t('tabs.content')}</TabsTrigger>
          <TabsTrigger value="seo">{t('tabs.seo')}</TabsTrigger>
          <TabsTrigger value="image">{t('tabs.image')}</TabsTrigger>
        </TabsList>

        {/* İçerik Tab */}
        <TabsContent value="content">
          <Card>
            <CardContent className="pt-6 space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">{t('form.name')} {t('form.requiredMark')}</Label>
                <input
                  id="name"
                  className={CATEGORY_DETAIL_INPUT_CLASS}
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  disabled={isLoading}
                  placeholder={t('detail.namePlaceholder')}
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug">{t('form.slug')} {t('form.requiredMark')}</Label>
                <input
                  id="slug"
                  className={CATEGORY_DETAIL_INPUT_CLASS}
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  disabled={isLoading}
                  placeholder={t('detail.slugPlaceholder')}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">{t('form.description')}</Label>
                <textarea
                  id="description"
                  className={`${CATEGORY_DETAIL_INPUT_CLASS} resize-y`}
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  disabled={isLoading}
                  rows={4}
                  placeholder={t('form.descriptionPlaceholder')}
                />
              </div>

              {/* Module */}
              <div className="space-y-2">
                <Label htmlFor="module">{t('table.module')}</Label>
                <Select
                  value={formData.module_key}
                  onValueChange={(v) => handleChange('module_key', v)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="module">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_MODULE_KEYS.map((moduleKeyOption) => (
                      <SelectItem key={moduleKeyOption} value={moduleKeyOption}>
                        {t(`modules.${moduleKeyOption}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Icon & Alt */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="icon">{t('form.icon')}</Label>
                  <input
                    id="icon"
                    className={CATEGORY_DETAIL_INPUT_CLASS}
                    value={formData.icon}
                    onChange={(e) => handleChange('icon', e.target.value)}
                    disabled={isLoading}
                    placeholder={t('detail.iconPlaceholder')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alt">{t('form.alt')}</Label>
                  <input
                    id="alt"
                    className={CATEGORY_DETAIL_INPUT_CLASS}
                    value={formData.alt}
                    onChange={(e) => handleChange('alt', e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Display Order */}
              <div className="space-y-2">
                <Label htmlFor="display_order">{t('form.displayOrder')}</Label>
                <input
                  id="display_order"
                  type="number"
                  className={CATEGORY_DETAIL_INPUT_CLASS}
                  value={formData.display_order}
                  onChange={(e) => handleChange('display_order', Number(e.target.value))}
                  disabled={isLoading}
                />
              </div>

              {/* Toggles */}
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(v) => handleChange('is_active', v)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="is_active" className="cursor-pointer">
                    {t('table.active')}
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(v) => handleChange('is_featured', v)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="is_featured" className="cursor-pointer">
                    {t('table.featured')}
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo">
          <Card>
            <CardContent className="pt-6 space-y-6">
              {/* Meta Title */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="meta_title">{t('detail.metaTitle')}</Label>
                  <span className={`text-xs ${(formData.meta_title?.length || 0) > CATEGORY_META_TITLE_LIMIT ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {formData.meta_title?.length || 0}/{CATEGORY_META_TITLE_LIMIT}
                  </span>
                </div>
                <input
                  id="meta_title"
                  className={CATEGORY_DETAIL_INPUT_CLASS}
                  value={formData.meta_title}
                  onChange={(e) => handleChange('meta_title', e.target.value)}
                  disabled={isLoading}
                  placeholder={t('detail.metaTitlePlaceholder')}
                />
              </div>

              {/* Meta Description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="meta_description">{t('detail.metaDescription')}</Label>
                  <span className={`text-xs ${(formData.meta_description?.length || 0) > CATEGORY_META_DESCRIPTION_LIMIT ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {formData.meta_description?.length || 0}/{CATEGORY_META_DESCRIPTION_LIMIT}
                  </span>
                </div>
                <textarea
                  id="meta_description"
                  className={`${CATEGORY_DETAIL_INPUT_CLASS} resize-y`}
                  value={formData.meta_description}
                  onChange={(e) => handleChange('meta_description', e.target.value)}
                  disabled={isLoading}
                  rows={3}
                  placeholder={t('detail.metaDescriptionPlaceholder')}
                />
              </div>

              {/* Google Search Preview */}
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wide">{t('detail.seoPreview')}</Label>
                <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-1">
                  <div className="text-xs text-green-700 truncate">{seoPreviewUrl}</div>
                  <div className="text-base text-blue-700 font-medium truncate">
                    {formData.meta_title || formData.name || t('detail.seoPreviewTitleFallback')}
                  </div>
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {formData.meta_description || formData.description || t('detail.seoPreviewDescriptionFallback')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Görsel Tab */}
        <TabsContent value="image">
          <Card>
            <CardContent className="pt-6">
              <div className="max-w-md">
                <AdminImageUploadField
                  label={t('form.image')}
                  value={formData.image_url}
                  onChange={handleImageChange}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
