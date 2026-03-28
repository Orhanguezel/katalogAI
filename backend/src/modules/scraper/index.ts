// =============================================================
// FILE: src/modules/scraper/index.ts
// Barrel export — scraper module
// =============================================================

export { registerScraperAdmin } from './admin.routes';

export {
  handleScrapeVistaSeeds,
  handleGetLastScrapeResult,
  handleExportScrapedData,
  handleImportScrapedToSource,
} from './admin.controller';

export { scrapeVistaSeeds } from './vista-seeds-scraper';
export { exportAsJson, exportAsCsv } from './export-service';

export type { ScrapedCategory, ScrapedProduct, ScrapeResult } from './types';
