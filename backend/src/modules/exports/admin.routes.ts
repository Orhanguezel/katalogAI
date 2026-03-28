// src/modules/exports/admin.routes.ts

import type { FastifyInstance } from 'fastify';
import { handleExportPdf, handleExportEmail } from './admin.controller';

export async function registerExportsAdmin(app: FastifyInstance) {
  app.post('/exports/pdf/:catalogId', handleExportPdf);
  app.post('/exports/email/:catalogId', handleExportEmail);
}
