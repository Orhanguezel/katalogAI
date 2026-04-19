// src/modules/productSources/source-adapters/source-settings.ts

import { sql } from 'drizzle-orm';
import type { MySql2Database } from 'drizzle-orm/mysql2';

type SourceDb = MySql2Database<Record<string, never>>;

type SettingRow = { key: string; locale: string; value: string };

/** Tek bir site_settings kaydını JSON parse ederek döner; başarısızsa raw string döner. */
function parseSettingValue(raw: string | null | undefined): unknown {
  if (raw == null) return null;
  const trimmed = String(raw).trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('{') || trimmed.startsWith('[') || trimmed.startsWith('"')) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed;
    }
  }
  return trimmed;
}

/**
 * Kaynak DB'sindeki `site_settings` tablosundan istenen anahtarları toplu okur.
 * Her anahtar için: önce `locale` eşleşeni, yoksa `*` (locale-agnostic) seçilir.
 *
 * Dönüş: `{ [key]: parsedValue | null }`
 */
export async function fetchSourceSettings(
  sourceDb: SourceDb,
  keys: readonly string[],
  locale: string,
): Promise<Record<string, unknown>> {
  if (!keys.length) return {};

  const placeholders = sql.join(
    keys.map((k) => sql`${k}`),
    sql`, `,
  );

  const result = await sourceDb.execute(sql`
    SELECT \`key\`, \`locale\`, \`value\`
    FROM site_settings
    WHERE \`key\` IN (${placeholders})
      AND \`locale\` IN (${locale}, '*')
  `);

  const rows = (Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result) as SettingRow[];

  // locale = istenen locale > '*' fallback önceliğiyle map'le
  const byKey = new Map<string, SettingRow>();
  for (const row of rows) {
    const existing = byKey.get(row.key);
    if (!existing) {
      byKey.set(row.key, row);
      continue;
    }
    if (existing.locale !== locale && row.locale === locale) {
      byKey.set(row.key, row);
    }
  }

  const out: Record<string, unknown> = {};
  for (const key of keys) {
    const row = byKey.get(key);
    out[key] = row ? parseSettingValue(row.value) : null;
  }
  return out;
}
