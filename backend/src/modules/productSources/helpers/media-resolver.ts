// src/modules/productSources/helpers/media-resolver.ts

const ABSOLUTE = /^https?:\/\//i;
const LOCALHOST = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?/i;

/** localhost / 127.0.0.1 host'lu base URL'leri kullanışsız sayar — production'da başkasının makinesinde 8078'e gitmek anlamsız. */
export function sanitizeBaseUrl(raw: string | null | undefined): string | null {
  const s = String(raw ?? '').trim();
  if (!s) return null;
  if (LOCALHOST.test(s)) return null;
  return s.replace(/\/+$/, '');
}

function pickFirstValidBase(...candidates: Array<string | null | undefined>): string | null {
  for (const c of candidates) {
    const ok = sanitizeBaseUrl(c);
    if (ok) return ok;
  }
  return null;
}

/**
 * Verilen relative path'i kaynağa ait base URL'ler içinden ilk geçerli olanla absolute yapar.
 * `null` döndüyse path tek başına kullanılabilir hâlde değildir (caller dilerse boş string'e çevirir).
 *
 * Sıralama: `manualOverride` (admin ayarı) → `sourceWebsite` (kaynak DB'sinin company_brand.website'i).
 * localhost değerleri her aşamada ignore edilir.
 */
export function resolveSourceMediaUrl(
  rawPath: string | null | undefined,
  opts: { manualOverride?: string | null; sourceWebsite?: string | null },
): string | null {
  const path = String(rawPath ?? '').trim();
  if (!path) return null;
  if (ABSOLUTE.test(path)) {
    return LOCALHOST.test(path) ? null : path;
  }
  const base = pickFirstValidBase(opts.manualOverride, opts.sourceWebsite);
  if (!base) return null;
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${base}${suffix}`;
}
