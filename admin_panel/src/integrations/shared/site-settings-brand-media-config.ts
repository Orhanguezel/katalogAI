import { getErrorMessage, toStr, trimStr, tryParseJsonVal, type UnknownRow } from '@/integrations/shared/common';

export type SiteSettingsBrandMediaData = {
  logo_url: string;
  logo_alt: string;
  logo_dark_url: string;
  favicon_url: string;
  apple_touch_icon_url: string;
};

export type SiteSettingsBrandMediaField = keyof SiteSettingsBrandMediaData;

export type SiteSettingsBrandMediaItem = {
  field: SiteSettingsBrandMediaField;
  labelKey: string;
  aspect: '4x3' | '1x1' | '16x9';
  fit: 'contain' | 'cover';
  folder: string;
};

export const SITE_SETTINGS_BRAND_MEDIA_ITEMS: SiteSettingsBrandMediaItem[] = [
  { field: 'logo_url', labelKey: 'logo_url', aspect: '1x1', fit: 'contain', folder: 'logo' },
  { field: 'logo_dark_url', labelKey: 'logo_dark_url', aspect: '1x1', fit: 'contain', folder: 'logo' },
  { field: 'favicon_url', labelKey: 'favicon_url', aspect: '1x1', fit: 'contain', folder: 'logo' },
  { field: 'apple_touch_icon_url', labelKey: 'apple_touch_icon_url', aspect: '1x1', fit: 'contain', folder: 'logo' },
];

const EMPTY_SITE_SETTINGS_BRAND_MEDIA_DATA: SiteSettingsBrandMediaData = {
  logo_url: '',
  logo_alt: '',
  logo_dark_url: '',
  favicon_url: '',
  apple_touch_icon_url: '',
};

export function createSiteSettingsBrandMediaData(
  logoAlt = '',
): SiteSettingsBrandMediaData {
  return { ...EMPTY_SITE_SETTINGS_BRAND_MEDIA_DATA, logo_alt: logoAlt };
}

export function extractSiteSettingsBrandMediaData(
  raw: unknown,
  logoAlt: string,
): SiteSettingsBrandMediaData {
  const row = raw && typeof raw === 'object' ? (raw as UnknownRow) : {};
  const source = typeof row.value === 'string' ? tryParseJsonVal(row.value) : row.value ?? raw;
  const input = source && typeof source === 'object' ? (source as UnknownRow) : {};

  return {
    logo_url: toStr(input.logo_url),
    logo_alt: trimStr(input.logo_alt) || logoAlt,
    logo_dark_url: toStr(input.logo_dark_url),
    favicon_url: toStr(input.favicon_url),
    apple_touch_icon_url: toStr(input.apple_touch_icon_url),
  };
}

export function buildSiteSettingsBrandMediaLegacyValue(
  value: SiteSettingsBrandMediaData,
) {
  return {
    logo_url: value.logo_url,
    logo_alt: value.logo_alt,
    favicon_url: value.favicon_url,
    logo_dark_url: value.logo_dark_url,
  };
}

export function getSiteSettingsBrandMediaErrorMessage(err: unknown, fallback: string): string {
  return getErrorMessage(err) || fallback;
}
