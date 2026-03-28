// =============================================================
// FILE: src/modules/dashboard/admin.controller.ts
// Admin dashboard handlers — KatalogAI
// =============================================================
import type { FastifyRequest, FastifyReply } from 'fastify';
import { handleRouteError } from "@/modules/_shared";
import { repoGetAdminSummary } from './repository';

/** GET /admin/dashboard/summary */
export async function adminDashboardSummary(_req: FastifyRequest, reply: FastifyReply) {
  try {
    const items = await repoGetAdminSummary();
    return reply.send({ items });
  } catch (e) {
    return handleRouteError(reply, _req, e, 'admin_dashboard_summary');
  }
}
