// =============================================================
// FILE: src/modules/scraper/types.ts
// Shared types for scraper module
// =============================================================

export interface ScrapedCategory {
  slug: string;
  name: string;
  url: string;
}

export interface ScrapedProduct {
  slug: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  images: string[];
  specs: Record<string, string>;
  source_url: string;
}

export interface ScrapeResult {
  source: string;
  scraped_at: string;
  categories: ScrapedCategory[];
  products: ScrapedProduct[];
}
