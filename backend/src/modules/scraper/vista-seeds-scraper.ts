// =============================================================
// FILE: src/modules/scraper/vista-seeds-scraper.ts
// Web scraper for vistaseeds.com.tr — cheerio-based
// =============================================================

import { load } from 'cheerio';
import type { ScrapedCategory, ScrapedProduct, ScrapeResult } from './types';

const DEFAULT_BASE = 'https://www.vistaseeds.com.tr';
const UA =
  'Mozilla/5.0 (compatible; KatalogAI/1.0; +https://katalogai.com)';

// ─── helpers ────────────────────────────────────────────────

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'text/html' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`);
  return res.text();
}

function abs(base: string, href: string): string {
  if (href.startsWith('http')) return href;
  return new URL(href, base).toString();
}

// ─── category discovery ─────────────────────────────────────

async function scrapeCategories(base: string): Promise<ScrapedCategory[]> {
  const html = await fetchHtml(`${base}/urunler`);
  const $ = load(html);
  const cats: ScrapedCategory[] = [];
  const seen = new Set<string>();

  // Look for links matching /urunler/{slug}
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') ?? '';
    const match = href.match(/\/urunler\/([a-z0-9-]+)\/?$/i);
    if (match && !seen.has(match[1])) {
      seen.add(match[1]);
      cats.push({
        slug: match[1],
        name: $(el).text().replace(/\s+/g, ' ').trim().toUpperCase() || match[1].toUpperCase(),
        url: abs(base, href),
      });
    }
  });

  return cats;
}

// ─── product list from category page ────────────────────────

async function scrapeProductSlugsFromCategory(
  base: string,
  categorySlug: string,
): Promise<{ slug: string; url: string }[]> {
  const html = await fetchHtml(`${base}/urunler/${categorySlug}`);
  const $ = load(html);
  const products: { slug: string; url: string }[] = [];
  const seen = new Set<string>();

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') ?? '';
    const match = href.match(/\/urun\/([a-z0-9-]+)\/?$/i);
    if (match && !seen.has(match[1])) {
      seen.add(match[1]);
      products.push({ slug: match[1], url: abs(base, href) });
    }
  });

  return products;
}

// ─── product detail ─────────────────────────────────────────

async function scrapeProductDetail(
  base: string,
  slug: string,
  categoryName: string,
): Promise<ScrapedProduct> {
  const url = `${base}/urun/${slug}`;
  const html = await fetchHtml(url);
  const $ = load(html);

  // Title — usually the main heading
  const title =
    $('h1').first().text().replace(/\s+/g, ' ').trim() ||
    $('h2').first().text().replace(/\s+/g, ' ').trim() ||
    slug.replace(/-/g, ' ').toUpperCase();

  // Description — look for paragraph blocks in the content area
  const descParagraphs: string[] = [];
  const contentSelectors = [
    '.product-description',
    '.product-content',
    '.content',
    'article',
    'main',
  ];

  for (const sel of contentSelectors) {
    const container = $(sel);
    if (container.length > 0) {
      container.first().find('p').each((_, el) => {
        const text = $(el).text().replace(/\s+/g, ' ').trim();
        if (text.length > 20) descParagraphs.push(text);
      });
      break;
    }
  }

  // Fallback: grab all <p> on the page that look descriptive
  if (descParagraphs.length === 0) {
    $('p').each((_, el) => {
      const text = $(el).text().replace(/\s+/g, ' ').trim();
      if (text.length > 30 && !text.includes('©')) {
        descParagraphs.push(text);
      }
    });
  }

  const description = descParagraphs.slice(0, 3).join('\n\n');

  // Images — look for product images
  const images: string[] = [];
  const seenImg = new Set<string>();

  $('img[src]').each((_, el) => {
    const src = $(el).attr('src') ?? '';
    if (src.includes('/storage/Products/') || src.includes('/storage/products/')) {
      const full = abs(base, src);
      if (!seenImg.has(full)) {
        seenImg.add(full);
        images.push(full);
      }
    }
  });

  // Also check data-src for lazy-loaded images
  $('img[data-src]').each((_, el) => {
    const src = $(el).attr('data-src') ?? '';
    if (src.includes('/storage/') && !seenImg.has(abs(base, src))) {
      seenImg.add(abs(base, src));
      images.push(abs(base, src));
    }
  });

  // Specs table — key/value pairs
  const specs: Record<string, string> = {};

  $('table tr, .specs tr, .specifications tr').each((_, row) => {
    const cells = $(row).find('td, th');
    if (cells.length >= 2) {
      const key = $(cells[0]).text().replace(/\s+/g, ' ').trim().replace(/:$/, '');
      const val = $(cells[1]).text().replace(/\s+/g, ' ').trim();
      if (key && val && key !== val) {
        specs[key] = val;
      }
    }
  });

  // Also try dl/dt/dd pattern
  $('dl dt').each((_, dt) => {
    const key = $(dt).text().replace(/\s+/g, ' ').trim().replace(/:$/, '');
    const dd = $(dt).next('dd');
    const val = dd.text().replace(/\s+/g, ' ').trim();
    if (key && val) specs[key] = val;
  });

  return {
    slug,
    title,
    description,
    category: categoryName,
    image_url: images[0] ?? '',
    images,
    specs,
    source_url: url,
  };
}

// ─── main orchestrator ──────────────────────────────────────

export async function scrapeVistaSeeds(
  baseUrl?: string,
): Promise<ScrapeResult> {
  const base = (baseUrl ?? DEFAULT_BASE).replace(/\/$/, '');

  // 1. Discover categories
  const categories = await scrapeCategories(base);

  // 2. For each category, get product slugs
  const allProducts: ScrapedProduct[] = [];
  const seenSlugs = new Set<string>();

  for (const cat of categories) {
    const productLinks = await scrapeProductSlugsFromCategory(base, cat.slug);

    for (const link of productLinks) {
      if (seenSlugs.has(link.slug)) continue;
      seenSlugs.add(link.slug);

      const product = await scrapeProductDetail(base, link.slug, cat.name);
      allProducts.push(product);
    }
  }

  return {
    source: 'vistaseeds.com.tr',
    scraped_at: new Date().toISOString(),
    categories,
    products: allProducts,
  };
}
