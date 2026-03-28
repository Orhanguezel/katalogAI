// =============================================================
// FILE: src/modules/scraper/admin.routes.ts
// Admin route registrations for scraper module
// =============================================================

import type { FastifyInstance } from 'fastify';
import {
  handleScrapeVistaSeeds,
  handleGetLastScrapeResult,
  handleExportScrapedData,
  handleImportScrapedToSource,
} from './admin.controller';

export async function registerScraperAdmin(app: FastifyInstance) {
  /** Run Vista Seeds web scraper */
  app.post('/scraper/vista-seeds', handleScrapeVistaSeeds);

  /** Get cached last scrape result */
  app.get('/scraper/last-result', handleGetLastScrapeResult);

  /** Export scraped data as JSON or CSV download */
  app.post('/scraper/export', handleExportScrapedData);

  /** Import scraped products into a productSource (import type) */
  app.post('/scraper/import-to-source/:sourceId', handleImportScrapedToSource);
}
