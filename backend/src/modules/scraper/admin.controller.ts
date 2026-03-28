// =============================================================
// FILE: src/modules/scraper/admin.controller.ts
// Admin handlers for web scraping & export
// =============================================================

import type { FastifyRequest, FastifyReply } from 'fastify';
import { scrapeVistaSeedsSchema, exportScrapedDataSchema } from './validation';
import { scrapeVistaSeeds } from './vista-seeds-scraper';
import { exportAsJson, exportAsCsv } from './export-service';
import type { ScrapeResult } from './types';

// In-memory cache of last scrape result (simple, no DB needed)
let lastScrapeResult: ScrapeResult | null = null;

/** POST /scraper/vista-seeds — Run Vista Seeds scraper */
export async function handleScrapeVistaSeeds(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const body = scrapeVistaSeedsSchema.parse(request.body ?? {});

  const result = await scrapeVistaSeeds(body.base_url);

  lastScrapeResult = result;

  return reply.send({
    ok: true,
    locale: body.locale,
    source: result.source,
    scraped_at: result.scraped_at,
    categories_count: result.categories.length,
    products_count: result.products.length,
    categories: result.categories,
    products: result.products,
  });
}

/** GET /scraper/last-result — Return cached last scrape */
export async function handleGetLastScrapeResult(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  if (!lastScrapeResult) {
    return reply.status(404).send({ error: 'No scrape result cached. Run the scraper first.' });
  }
  return reply.send(lastScrapeResult);
}

/** POST /scraper/export — Export scraped data as JSON or CSV */
export async function handleExportScrapedData(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (!lastScrapeResult) {
    return reply.status(404).send({ error: 'No scrape result cached. Run the scraper first.' });
  }

  const body = exportScrapedDataSchema.parse(request.body ?? {});

  if (body.format === 'csv') {
    const csv = exportAsCsv(lastScrapeResult);
    return reply
      .header('Content-Type', 'text/csv; charset=utf-8')
      .header(
        'Content-Disposition',
        `attachment; filename="vistaseeds-${Date.now()}.csv"`,
      )
      .send(csv);
  }

  // JSON
  const json = exportAsJson(lastScrapeResult);
  return reply
    .header('Content-Type', 'application/json; charset=utf-8')
    .header(
      'Content-Disposition',
      `attachment; filename="vistaseeds-${Date.now()}.json"`,
    )
    .send(json);
}

/** POST /scraper/import-to-source/:sourceId — Import scraped products into a productSource */
export async function handleImportScrapedToSource(
  request: FastifyRequest<{ Params: { sourceId: string } }>,
  reply: FastifyReply,
) {
  if (!lastScrapeResult) {
    return reply.status(404).send({ error: 'No scrape result cached. Run the scraper first.' });
  }

  const { sourceId } = request.params;

  // Lazy import to avoid circular deps
  const { repoImportProducts } = await import('@/modules/productSources');

  const products = lastScrapeResult.products.map((p) => ({
    id: crypto.randomUUID(),
    external_id: p.slug,
    title: p.title,
    description: p.description || undefined,
    image_url: p.image_url || undefined,
    images: p.images.length > 0 ? p.images : undefined,
    category_name: p.category || undefined,
    specs: Object.keys(p.specs).length > 0 ? p.specs : undefined,
    locale: 'tr',
    is_active: true,
  }));

  const result = await repoImportProducts(sourceId, products);

  return reply.send({
    ok: true,
    imported: result.inserted,
    source_id: sourceId,
  });
}
