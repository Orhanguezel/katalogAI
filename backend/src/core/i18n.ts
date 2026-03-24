// src/core/i18n.ts

import { db } from "@/db/client";
import { siteSettings } from "@/modules/siteSettings";
import { eq } from "drizzle-orm";
import {
  getActiveAppLocaleCodes,
  parseAppLocalesValueToMeta,
  pickDefaultAppLocaleCode,
} from '@/modules/_shared';

export const LOCALES: string[] = [];
export const DEFAULT_LOCALE = '';

export type SupportedLocale = string;

let runtimeDefaultLocale = DEFAULT_LOCALE;
let localesLoaded = false;

export function normalizeLocale(input?: string | null): string | null {
  if (!input) return null;
  const s = String(input).trim().toLowerCase().replace("_", "-");
  if (!s) return null;
  const base = s.split("-")[0]?.trim();
  return base || null;
}

export function isSupported(locale?: string | null): boolean {
  const l = normalizeLocale(locale);
  return !!l && LOCALES.includes(l);
}

export function getRuntimeDefaultLocale(): string {
  return runtimeDefaultLocale;
}

function parseSettingValue(raw: unknown): string | null {
  if (raw == null) return null;
  const s = String(raw).trim();
  if (!s) return null;
  try {
    const parsed = JSON.parse(s);
    if (typeof parsed === "string") return parsed.trim() || null;
    return s;
  } catch {
    return s;
  }
}

export async function ensureLocalesLoadedFromSettings(): Promise<void> {
  if (localesLoaded) return;
  localesLoaded = true;
  try {
    const rows = await db
      .select({ key: siteSettings.key, value: siteSettings.value })
      .from(siteSettings)
      .where(eq(siteSettings.locale, '*'));

    const appLocalesRaw = rows.find((row) => row.key === 'app_locales')?.value;
    const defaultLocaleRaw = rows.find((row) => row.key === 'default_locale')?.value;

    const metas = parseAppLocalesValueToMeta(parseSettingValue(appLocalesRaw));
    const activeLocales = getActiveAppLocaleCodes(metas);
    LOCALES.splice(0, LOCALES.length, ...activeLocales);

    const explicitDefault = normalizeLocale(parseSettingValue(defaultLocaleRaw));
    const fallbackDefault = pickDefaultAppLocaleCode(metas);
    const selectedDefault =
      (explicitDefault && activeLocales.includes(explicitDefault) ? explicitDefault : null) ??
      fallbackDefault;

    runtimeDefaultLocale = selectedDefault ?? '';
  } catch {
    LOCALES.splice(0, LOCALES.length);
    runtimeDefaultLocale = '';
  }
}
