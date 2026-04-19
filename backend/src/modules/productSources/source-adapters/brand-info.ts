// src/modules/productSources/source-adapters/brand-info.ts

import type { MySql2Database } from 'drizzle-orm/mysql2';
import { fetchSourceSettings } from './source-settings';

type SourceDb = MySql2Database<Record<string, never>>;

export interface SourceBrandLogo {
  logo_url: string | null;
  logo_alt: string | null;
  favicon_url: string | null;
  apple_touch_icon_url: string | null;
}

export interface SourceBrandContact {
  companyName: string | null;
  shortName: string | null;
  phones: string[];
  whatsappNumber: string | null;
  email: string | null;
  address: string | null;
  addressSecondary: string | null;
  website: string | null;
  taxNumber: string | null;
  taxOffice: string | null;
}

export interface SourceBrandSocials {
  instagram: string | null;
  facebook: string | null;
  x: string | null;
  youtube: string | null;
  linkedin: string | null;
  tiktok: string | null;
}

export interface SourceBrandProfile {
  headline: string | null;
  subline: string | null;
  body: string | null;
}

export interface SourceBrandInfo {
  locale: string;
  site_title: string | null;
  logo: SourceBrandLogo;
  contact: SourceBrandContact;
  socials: SourceBrandSocials;
  profile: SourceBrandProfile;
}

const BRAND_KEYS = [
  'site_title',
  'site_logo',
  'site_logo_dark',
  'site_logo_light',
  'site_favicon',
  'site_apple_touch_icon',
  'contact_info',
  'company_brand',
  'company_profile',
  'socials',
] as const;

function asString(v: unknown): string | null {
  if (typeof v === 'string') {
    const t = v.trim();
    return t ? t : null;
  }
  if (typeof v === 'number') return String(v);
  return null;
}

function asObject(v: unknown): Record<string, unknown> {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  const out: string[] = [];
  for (const item of v) {
    const s = asString(item);
    if (s) out.push(s);
  }
  return out;
}

function pickLogoUrl(...candidates: unknown[]): string | null {
  for (const c of candidates) {
    const obj = asObject(c);
    const url = asString(obj.url) ?? asString(obj.logo_url);
    if (url) return url;
  }
  return null;
}

function pickLogoAlt(...candidates: unknown[]): string | null {
  for (const c of candidates) {
    const obj = asObject(c);
    const alt = asString(obj.alt) ?? asString(obj.logo_alt);
    if (alt) return alt;
  }
  return null;
}

function buildLogo(settings: Record<string, unknown>): SourceBrandLogo {
  return {
    logo_url: pickLogoUrl(settings.site_logo, settings.site_logo_dark, settings.site_logo_light),
    logo_alt: pickLogoAlt(settings.site_logo, settings.site_logo_dark, settings.site_logo_light),
    favicon_url: pickLogoUrl(settings.site_favicon, settings.site_apple_touch_icon),
    apple_touch_icon_url: pickLogoUrl(settings.site_apple_touch_icon, settings.site_favicon),
  };
}

function buildContact(settings: Record<string, unknown>): SourceBrandContact {
  const contact = asObject(settings.contact_info);
  const brand = asObject(settings.company_brand);

  return {
    companyName: asString(contact.companyName) ?? asString(brand.name),
    shortName: asString(brand.shortName),
    phones: asStringArray(contact.phones),
    whatsappNumber: asString(contact.whatsappNumber),
    email: asString(contact.email),
    address: asString(contact.address),
    addressSecondary: asString(contact.addressSecondary),
    website: asString(contact.website) ?? asString(brand.website),
    taxNumber: asString(contact.taxNumber),
    taxOffice: asString(contact.taxOffice),
  };
}

function buildSocials(settings: Record<string, unknown>): SourceBrandSocials {
  const s = asObject(settings.socials);
  return {
    instagram: asString(s.instagram),
    facebook: asString(s.facebook),
    x: asString(s.x) ?? asString(s.twitter),
    youtube: asString(s.youtube),
    linkedin: asString(s.linkedin),
    tiktok: asString(s.tiktok),
  };
}

function buildProfile(settings: Record<string, unknown>): SourceBrandProfile {
  const p = asObject(settings.company_profile);
  return {
    headline: asString(p.headline),
    subline: asString(p.subline),
    body: asString(p.body),
  };
}

/**
 * Kaynak DB'sinin site_settings tablosundan marka bilgisini (logo, iletişim,
 * sosyal medya, kurumsal profil) anlık olarak çeker. Hiçbir değer cache'lenmez.
 *
 * URL'ler relative (örn: /uploads/logo/x.png) ya da absolute olabilir; absolute
 * çevirme adminFetchSourceProducts ile aynı resolver tarafından üst katmanda yapılır.
 */
export async function fetchSourceBrandInfo(
  sourceDb: SourceDb,
  locale: string,
): Promise<SourceBrandInfo> {
  const settings = await fetchSourceSettings(sourceDb, BRAND_KEYS, locale);
  return {
    locale,
    site_title: asString(settings.site_title),
    logo: buildLogo(settings),
    contact: buildContact(settings),
    socials: buildSocials(settings),
    profile: buildProfile(settings),
  };
}
