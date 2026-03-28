// =============================================================
// FILE: src/modules/scraper/export-service.ts
// JSON / CSV export for scraped product data
// =============================================================

import type { ScrapeResult, ScrapedProduct } from './types';

// ─── JSON export ────────────────────────────────────────────

export function exportAsJson(data: ScrapeResult): string {
  return JSON.stringify(data, null, 2);
}

// ─── CSV export ─────────────────────────────────────────────

function escapeCsv(value: string): string {
  if (value.includes('"') || value.includes(',') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

const CSV_HEADERS = [
  'slug',
  'title',
  'category',
  'description',
  'image_url',
  'images',
  'specs',
  'source_url',
] as const;

function productToCsvRow(p: ScrapedProduct): string {
  const values = [
    p.slug,
    p.title,
    p.category,
    p.description.replace(/\n/g, ' '),
    p.image_url,
    p.images.join(';'),
    Object.entries(p.specs)
      .map(([k, v]) => `${k}: ${v}`)
      .join('; '),
    p.source_url,
  ];
  return values.map(escapeCsv).join(',');
}

export function exportAsCsv(data: ScrapeResult): string {
  const header = CSV_HEADERS.join(',');
  const rows = data.products.map(productToCsvRow);
  return [header, ...rows].join('\n');
}
