// =============================================================
// FILE: src/modules/scraper/validation.ts
// Zod schemas for scraper endpoints
// =============================================================

import { z } from 'zod';

export const scrapeVistaSeedsSchema = z.object({
  /** Base URL override (default: https://www.vistaseeds.com.tr) */
  base_url: z.string().url().optional(),
  /** Locale tag to assign to scraped products */
  locale: z.string().max(8).default('tr'),
});

export const exportScrapedDataSchema = z.object({
  /** Export format */
  format: z.enum(['json', 'csv']),
  /** Optional source filter */
  source_slug: z.string().max(100).optional(),
});

export type ScrapeVistaSeedsInput = z.infer<typeof scrapeVistaSeedsSchema>;
export type ExportScrapedDataInput = z.infer<typeof exportScrapedDataSchema>;
