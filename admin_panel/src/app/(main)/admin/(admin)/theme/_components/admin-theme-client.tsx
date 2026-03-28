'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Save, RotateCcw, Palette, Type, CircleDot } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

import {
  useGetThemeAdminQuery,
  useUpdateThemeAdminMutation,
  useResetThemeAdminMutation,
} from '@/integrations/hooks';

import type { ColorTokens, ThemeConfig } from '@/integrations/shared';
import {
  RADIUS_OPTIONS,
  THEME_DARK_MODE_OPTIONS,
  THEME_FONT_BODY_PLACEHOLDER,
  THEME_FONT_HEADING_PLACEHOLDER,
  THEME_RADIUS_PREVIEW_SIZES,
  groupThemeColorTokens,
  toThemeDraft,
} from '@/integrations/shared';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { ColorField } from './color-field';
import { ThemePreview } from './theme-preview';

/* ── Main Component ── */

const THEME_GROUP_LABEL_KEYS: Record<string, string> = {
  Brand: 'groups.brand',
  Surface: 'groups.surface',
  Text: 'groups.text',
  Shell: 'groups.shell',
};

const RADIUS_LABEL_KEYS: Record<string, string> = {
  None: 'radius.none',
  Small: 'radius.small',
  Default: 'radius.default',
  Medium: 'radius.medium',
  Large: 'radius.large',
  XL: 'radius.xl',
  '2XL': 'radius.2xl',
};

export default function AdminThemeClient() {
  const t = useAdminT('admin.theme');
  const { data: theme, isLoading } = useGetThemeAdminQuery();
  const [updateTheme, { isLoading: saving }] = useUpdateThemeAdminMutation();
  const [resetTheme, { isLoading: resetting }] = useResetThemeAdminMutation();

  const [draft, setDraft] = React.useState<ThemeConfig | null>(null);

  React.useEffect(() => {
    if (theme && !draft) setDraft(toThemeDraft(theme));
  }, [theme, draft]);

  if (isLoading || !draft) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="size-8" />
      </div>
    );
  }

  const setColor = (key: keyof ColorTokens, val: string) => {
    setDraft((prev) => prev ? { ...prev, colors: { ...prev.colors, [key]: val } } : prev);
  };

  const handleSave = async () => {
    if (!draft) return;
    try {
      await updateTheme({
        colors: {
          primary: draft.colors.primary,
          accent: draft.colors.accent,
          background: draft.colors.background,
          foreground: draft.colors.textStrong,
          mutedFg: draft.colors.textMuted,
          border: draft.colors.border,
          navBg: draft.colors.navBg,
          navFg: draft.colors.navFg,
          footerBg: draft.colors.footerBg,
          footerFg: draft.colors.footerFg,
        },
        fontFamily: draft.typography.fontBody,
        radius: draft.radius,
        darkMode: draft.darkMode,
      }).unwrap();
      toast.success(t('saved'));
    } catch {
      toast.error(t('saveError'));
    }
  };

  const handleReset = async () => {
    try {
      const result = await resetTheme().unwrap();
      setDraft(toThemeDraft(result));
      toast.success(t('reset'));
    } catch {
      toast.error(t('resetError'));
    }
  };

  // Group colors by group
  const groups = groupThemeColorTokens();

  return (
    <div className="mx-auto max-w-7xl space-y-8 py-6 px-2">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-white italic">
            {t('title')}
          </h1>
          <p className="text-sm text-katalog-text-dim max-w-lg">
            {t('description')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="lg"
            onClick={handleReset}
            disabled={saving || resetting}
            className="h-11 rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 font-bold transition-all"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            {t('resetButton')}
          </Button>
          <Button
            size="lg"
            onClick={handleSave}
            disabled={saving || resetting}
            className="h-11 rounded-xl bg-katalog-gold px-8 font-bold text-katalog-bg-deep shadow-[0_8px_30px_rgba(194,157,93,0.15)] hover:bg-katalog-gold-light active:scale-95 transition-all"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                 <Spinner className="h-4 w-4" /> {t('saving')}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                 <Save className="h-4 w-4" /> {t('saveButton')}
              </span>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Settings */}
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-katalog-bg-panel border border-white/5 rounded-2xl overflow-hidden p-6">
            <Tabs defaultValue="colors">
              <TabsList className="bg-katalog-bg-card border-none mb-8 p-1.5 h-12 rounded-xl">
                <TabsTrigger value="colors" className="data-[state=active]:bg-katalog-gold data-[state=active]:text-katalog-bg-deep font-bold gap-2 text-[11px] uppercase tracking-widest px-6 h-full rounded-lg">
                  <Palette className="size-4" />
                  {t('colorsTab')}
                </TabsTrigger>
                <TabsTrigger value="typography" className="data-[state=active]:bg-katalog-gold data-[state=active]:text-katalog-bg-deep font-bold gap-2 text-[11px] uppercase tracking-widest px-6 h-full rounded-lg">
                  <Type className="size-4" />
                  {t('typographyTab')}
                </TabsTrigger>
                <TabsTrigger value="general" className="data-[state=active]:bg-katalog-gold data-[state=active]:text-katalog-bg-deep font-bold gap-2 text-[11px] uppercase tracking-widest px-6 h-full rounded-lg">
                  <CircleDot className="size-4" />
                  {t('generalTab')}
                </TabsTrigger>
              </TabsList>

              {/* Colors Tab */}
              <TabsContent value="colors" className="space-y-6 mt-0">
                {Array.from(groups.entries()).map(([group, keys]) => (
                  <div key={group} className="space-y-4">
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-bold text-white/40 uppercase tracking-[.2em]">{t(THEME_GROUP_LABEL_KEYS[group] || '') || group}</span>
                       <div className="h-[1px] flex-1 bg-white/5" />
                    </div>
                    <div className="bg-katalog-bg-card/40 border border-white/5 rounded-2xl p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {keys.map((key) => (
                          <ColorField
                            key={key}
                            tokenKey={key}
                            value={draft.colors[key]}
                            onChange={setColor}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              {/* Typography Tab */}
              <TabsContent value="typography" className="space-y-6 mt-0">
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-bold text-white/40 uppercase tracking-[.2em]">{t('fonts')}</span>
                   <div className="h-[1px] flex-1 bg-white/5" />
                </div>
                <div className="bg-katalog-bg-card/40 border border-white/5 rounded-2xl p-6 space-y-8">
                  <div className="space-y-4">
                    <Label className="text-xs font-bold text-katalog-text-dim uppercase tracking-widest">{t('fontHeading')}</Label>
                    <Input
                      className="bg-katalog-bg-deep border-white/5 text-white h-11 rounded-lg"
                      value={draft.typography.fontHeading}
                      onChange={(e) => setDraft((p) => p ? { ...p, typography: { ...p.typography, fontHeading: e.target.value } } : p)}
                      placeholder={THEME_FONT_HEADING_PLACEHOLDER}
                    />
                    <div className="p-6 bg-white/2 rounded-xl border border-white/5">
                      <div className="text-4xl font-bold text-white leading-tight" style={{ fontFamily: draft.typography.fontHeading }}>
                        {t('fontHeadingPreview')}
                      </div>
                      <p className="mt-2 text-[10px] text-katalog-gold font-mono uppercase tracking-widest opacity-40">{t('fontHeadingLabel')}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label className="text-xs font-bold text-katalog-text-dim uppercase tracking-widest">{t('fontBody')}</Label>
                    <Input
                      className="bg-katalog-bg-deep border-white/5 text-white h-11 rounded-lg"
                      value={draft.typography.fontBody}
                      onChange={(e) => setDraft((p) => p ? { ...p, typography: { ...p.typography, fontBody: e.target.value } } : p)}
                      placeholder={THEME_FONT_BODY_PLACEHOLDER}
                    />
                    <div className="p-6 bg-white/2 rounded-xl border border-white/5">
                      <div className="text-sm text-katalog-text-dim leading-relaxed" style={{ fontFamily: draft.typography.fontBody }}>
                        {t('fontBodyPreview')}
                      </div>
                      <p className="mt-2 text-[10px] text-katalog-gold font-mono uppercase tracking-widest opacity-40">{t('fontBodyLabel')}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* General Tab */}
              <TabsContent value="general" className="space-y-8 mt-0">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] font-bold text-white/40 uppercase tracking-[.2em]">{t('borderRadius')}</span>
                     <div className="h-[1px] flex-1 bg-white/5" />
                  </div>
                  <div className="bg-katalog-bg-card/40 border border-white/5 rounded-2xl p-6">
                    <Select
                      value={draft.radius}
                      onValueChange={(v) => setDraft((p) => p ? { ...p, radius: v as any } : p)}
                    >
                      <SelectTrigger className="w-full sm:w-80 h-11 bg-katalog-bg-deep border-white/5 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-katalog-bg-panel border-white/10 text-white">
                        {RADIUS_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{t(RADIUS_LABEL_KEYS[opt.label] || '') || opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-4 mt-8">
                      {THEME_RADIUS_PREVIEW_SIZES.map((size, i) => (
                        <div
                          key={size}
                          className="size-20 bg-white/2 border border-white/5 flex flex-col items-center justify-center gap-2 transition-all hover:border-katalog-gold/40"
                          style={{
                            borderRadius: `calc(${draft.radius} * ${0.5 + i * 0.5})`,
                          }}
                        >
                          <div className="text-[10px] font-bold text-katalog-gold uppercase">{size}</div>
                          <div className="text-[8px] text-white/20 font-mono italic">{t('radiusSample')}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] font-bold text-white/40 uppercase tracking-[.2em]">{t('darkModeLabel')}</span>
                     <div className="h-[1px] flex-1 bg-white/5" />
                  </div>
                  <div className="bg-katalog-bg-card/40 border border-white/5 rounded-2xl p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {THEME_DARK_MODE_OPTIONS.map(({ value, icon: Icon, labelKey }) => (
                         <button
                          key={value}
                          onClick={() => setDraft((p) => p ? { ...p, darkMode: value } : p)}
                          className={cn(
                            "group flex flex-col items-center justify-center p-6 rounded-2xl border transition-all gap-3",
                            draft.darkMode === value 
                              ? "bg-katalog-gold border-katalog-gold text-katalog-bg-deep shadow-xl shadow-katalog-gold/20" 
                              : "bg-katalog-bg-deep border-white/5 text-katalog-text-dim hover:border-white/20 hover:text-white"
                          )}
                        >
                          <Icon className={cn("size-6 transition-transform group-active:scale-90", draft.darkMode === value ? "text-katalog-bg-deep" : "text-katalog-gold")} />
                          <span className="text-xs font-bold uppercase tracking-widest">{t(`darkMode.${value}`)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Live Preview */}
        <div className="space-y-6">
          <div className="sticky top-28">
            <div className="flex items-center gap-2 mb-4">
               <span className="text-[10px] font-bold text-katalog-gold uppercase tracking-[.2em]">{t('previewTitle')}</span>
               <div className="h-[1px] flex-1 bg-white/5" />
            </div>
            <div className="bg-katalog-bg-panel border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-katalog-gold/50 to-transparent opacity-40" />
               <ThemePreview colors={draft.colors} t={t} />
               <div className="mt-6 p-4 rounded-xl bg-katalog-gold/5 border border-katalog-gold/20 flex items-start gap-3">
                  <Palette className="size-4 text-katalog-gold shrink-0 mt-0.5" />
                  <p className="text-[11px] text-katalog-text-dim leading-relaxed italic">
                    {t('previewNote')}
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
