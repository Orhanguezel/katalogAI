// =============================================================
// FILE: src/modules/dashboard/controller.ts
// Public dashboard handler (placeholder)
// =============================================================
import type { FastifyRequest, FastifyReply } from 'fastify';

/** GET /dashboard/status — minimal public health-like check */
export async function dashboardStatus(_req: FastifyRequest, reply: FastifyReply) {
  return reply.send({ ok: true });
}
