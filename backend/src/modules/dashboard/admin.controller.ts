// =============================================================
// FILE: src/modules/dashboard/admin.controller.ts
// Admin dashboard handlers
// =============================================================
import type { FastifyRequest, FastifyReply } from 'fastify';
import { handleRouteError } from "@/modules/_shared";
import { repoGetAdminSummary, repoGetRevenueStats, repoGetActivityStats } from './repository';

/** GET /admin/dashboard/summary */
export async function adminDashboardSummary(_req: FastifyRequest, reply: FastifyReply) {
  try {
    const items = await repoGetAdminSummary();
    return reply.send({ items });
  } catch (e) {
    return handleRouteError(reply, _req, e, 'admin_dashboard_summary');
  }
}

/** GET /admin/dashboard/stats/revenue */
export async function adminStatsRevenue(_req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = await repoGetRevenueStats();
    return reply.send(data);
  } catch (e) {
    return handleRouteError(reply, _req, e, 'admin_stats_revenue');
  }
}

/** GET /admin/dashboard/stats/activity */
export async function adminStatsActivity(_req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = await repoGetActivityStats();
    return reply.send(data);
  } catch (e) {
    return handleRouteError(reply, _req, e, 'admin_stats_activity');
  }
}
