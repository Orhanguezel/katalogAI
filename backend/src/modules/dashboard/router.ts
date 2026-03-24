// =============================================================
// FILE: src/modules/dashboard/router.ts
// =============================================================
import type { FastifyInstance } from 'fastify';
import { requireAuth } from '@/common/middleware/auth';
import { carrierDashboard, customerDashboard } from './controller';

const B = '/dashboard';

export async function registerDashboard(app: FastifyInstance) {
  const auth = { preHandler: [requireAuth] };
  app.get(`${B}/carrier`, auth, carrierDashboard);
  app.get(`${B}/customer`, auth, customerDashboard);
}
