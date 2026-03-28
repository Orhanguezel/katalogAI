// =============================================================
// FILE: src/modules/dashboard/admin.routes.ts
// =============================================================
import type { FastifyInstance } from 'fastify';
import { adminDashboardSummary } from './admin.controller';

const B = '/dashboard';

export async function registerDashboardAdmin(app: FastifyInstance) {
  app.get(`${B}/summary`, adminDashboardSummary);
}
