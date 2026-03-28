// src/app/(main)/admin/_components/header/layout-controls.tsx

"use client";

import { Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { type FontKey, fontOptions } from "@/lib/fonts/registry";
import type { ContentLayout, NavbarStyle } from "@/lib/preferences/layout";
import {
  applyContentLayout,
  applyFont,
  applyNavbarStyle,
} from "@/lib/preferences/layout-utils";
import { PREFERENCE_DEFAULTS } from "@/lib/preferences/preferences-config";
import { persistPreference } from "@/lib/preferences/preferences-storage";
import { THEME_PRESET_OPTIONS, type ThemeMode, type ThemePreset } from "@/lib/preferences/theme";
import { applyThemeMode, applyThemePreset } from "@/lib/preferences/theme-utils";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";
import { useAdminSettings } from '../admin-settings-provider';
import { useAdminTranslations, ADMIN_LOCALE_OPTIONS } from '@/i18n';

export function LayoutControls() {
  const { saveAdminConfig } = useAdminSettings();
  const adminLocale = usePreferencesStore((s) => s.adminLocale);
  const setAdminLocale = usePreferencesStore((s) => s.setAdminLocale);
  const t = useAdminTranslations(adminLocale || undefined);
  const themeMode = usePreferencesStore((s) => s.themeMode);
  const setThemeMode = usePreferencesStore((s) => s.setThemeMode);
  const themePreset = usePreferencesStore((s) => s.themePreset);
  const setThemePreset = usePreferencesStore((s) => s.setThemePreset);
  const contentLayout = usePreferencesStore((s) => s.contentLayout);
  const setContentLayout = usePreferencesStore((s) => s.setContentLayout);
  const navbarStyle = usePreferencesStore((s) => s.navbarStyle);
  const setNavbarStyle = usePreferencesStore((s) => s.setNavbarStyle);
  const font = usePreferencesStore((s) => s.font);
  const setFont = usePreferencesStore((s) => s.setFont);

  const onThemePresetChange = async (preset: ThemePreset) => {
    applyThemePreset(preset);
    setThemePreset(preset);
    persistPreference("theme_preset", preset);
    saveAdminConfig();
  };

  const onThemeModeChange = async (mode: ThemeMode | "") => {
    if (!mode) return;
    applyThemeMode(mode);
    setThemeMode(mode);
    persistPreference("theme_mode", mode);
    saveAdminConfig();
  };

  const onContentLayoutChange = async (layout: ContentLayout | "") => {
    if (!layout) return;
    applyContentLayout(layout);
    setContentLayout(layout);
    persistPreference("content_layout", layout);
    saveAdminConfig();
  };

  const onNavbarStyleChange = async (style: NavbarStyle | "") => {
    if (!style) return;
    applyNavbarStyle(style);
    setNavbarStyle(style);
    persistPreference("navbar_style", style);
    saveAdminConfig();
  };

  const onFontChange = async (value: FontKey | "") => {
    if (!value) return;
    applyFont(value);
    setFont(value);
    persistPreference("font", value);
    saveAdminConfig();
  };

  const onAdminLocaleChange = (value: string) => {
    const next = String(value || '').trim();
    if (!next) return;
    setAdminLocale(next);
    persistPreference("admin_locale", next);
    saveAdminConfig();
  };

  const handleRestore = () => {
    onThemePresetChange(PREFERENCE_DEFAULTS.theme_preset);
    onThemeModeChange(PREFERENCE_DEFAULTS.theme_mode);
    onContentLayoutChange(PREFERENCE_DEFAULTS.content_layout);
    onNavbarStyleChange(PREFERENCE_DEFAULTS.navbar_style);
    onFontChange(PREFERENCE_DEFAULTS.font);
    onAdminLocaleChange(PREFERENCE_DEFAULTS.admin_locale);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
          <Settings className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 bg-katalog-bg-panel border border-white/10 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col gap-6">
          <div className="space-y-1.5">
            <h4 className="font-serif text-xl font-bold text-white italic leading-none">{t('admin.sidebar.preferences.title') || 'Görünüm Ayarları'}</h4>
            <p className="text-katalog-text-dim text-xs leading-relaxed">{t('admin.sidebar.preferences.description') || 'Panel arayüzünü kendi çalışma düzeninize göre özelleştirin.'}</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
               <div className="h-[1px] flex-1 bg-white/5" />
               <span className="text-[10px] font-bold text-katalog-gold uppercase tracking-widest">{t('admin.sidebar.preferences.general') || 'GENEL'}</span>
               <div className="h-[1px] flex-1 bg-white/5" />
            </div>

            <div className="space-y-3 **:data-[slot=toggle-group]:w-full **:data-[slot=toggle-group-item]:flex-1 **:data-[slot=toggle-group-item]:text-[10px] **:data-[slot=toggle-group-item]:font-bold **:data-[slot=toggle-group-item]:uppercase **:data-[slot=toggle-group-item]:tracking-widest">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{t('admin.sidebar.preferences.themePreset')}</Label>
                <Select value={themePreset} onValueChange={onThemePresetChange}>
                  <SelectTrigger size="sm" className="w-full text-xs h-10 bg-katalog-bg-card border-white/5 text-white">
                    <SelectValue placeholder={t('admin.sidebar.preferences.themePresetPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent className="bg-katalog-bg-panel border-white/10 text-white">
                    {THEME_PRESET_OPTIONS.map((preset) => (
                      <SelectItem key={preset.value} className="text-xs" value={preset.value}>
                        <div className="flex items-center gap-2">
                          <span
                            className="size-3 rounded-full ring-1 ring-white/10"
                            style={{
                              backgroundColor: themeMode === "dark" ? preset.primary.dark : preset.primary.light,
                            }}
                          />
                          {preset.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{t('admin.sidebar.preferences.fonts')}</Label>
                <Select value={font} onValueChange={onFontChange}>
                  <SelectTrigger size="sm" className="w-full text-xs h-10 bg-katalog-bg-card border-white/5 text-white">
                    <SelectValue placeholder={t('admin.sidebar.preferences.fontsPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent className="bg-katalog-bg-panel border-white/10 text-white">
                    {fontOptions.map((font) => (
                      <SelectItem key={font.key} className="text-xs" value={font.key}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{t('admin.sidebar.preferences.language')}</Label>
                <Select value={adminLocale || 'tr'} onValueChange={onAdminLocaleChange}>
                  <SelectTrigger size="sm" className="w-full text-xs h-10 bg-katalog-bg-card border-white/5 text-white">
                    <SelectValue placeholder={t('admin.sidebar.preferences.languagePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent className="bg-katalog-bg-panel border-white/10 text-white">
                    {ADMIN_LOCALE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} className="text-xs" value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{t('admin.sidebar.preferences.themeMode')}</Label>
                <ToggleGroup
                  size="sm"
                  type="single"
                  value={themeMode}
                  onValueChange={onThemeModeChange}
                  className="bg-katalog-bg-card p-1 rounded-xl border border-white/5"
                >
                  <ToggleGroupItem value="light" className="rounded-lg text-white/40 transition-all data-[state=on]:bg-katalog-gold data-[state=on]:text-katalog-bg-deep data-[state=on]:shadow-lg">
                    {t('admin.sidebar.theme.light')}
                  </ToggleGroupItem>
                  <ToggleGroupItem value="dark" className="rounded-lg text-white/40 transition-all data-[state=on]:bg-katalog-gold data-[state=on]:text-katalog-bg-deep data-[state=on]:shadow-lg">
                    {t('admin.sidebar.theme.dark')}
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              <div className="pt-4">
                <Button type="button" size="sm" variant="outline" className="w-full h-10 border-white/10 bg-white/5 text-white hover:bg-white/10 font-bold text-[10px] uppercase tracking-widest" onClick={handleRestore}>
                  {t('admin.sidebar.preferences.restoreDefaults') || 'VARSAYILANLARA DÖN'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
