// =============================================================
// FILE: src/modules/dashboard/router.ts
// =============================================================
import type { FastifyInstance } from 'fastify';
import { dashboardStatus } from './controller';

const B = '/dashboard';

export async function registerDashboard(app: FastifyInstance) {
  app.get(`${B}/status`, dashboardStatus);
}
