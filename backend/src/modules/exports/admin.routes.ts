// src/modules/exports/admin.routes.ts

import type { FastifyInstance } from 'fastify';
import {
  handleExportPdf,
  handleExportEmail,
  handleListPublishTargets,
  handlePublishCatalog,
} from './admin.controller';

export async function registerExportsAdmin(app: FastifyInstance) {
  app.post('/exports/pdf/:catalogId', handleExportPdf);
  app.post('/exports/email/:catalogId', handleExportEmail);
  app.get('/exports/publish/targets', handleListPublishTargets);
  app.post('/exports/publish/:catalogId', handlePublishCatalog);
}
