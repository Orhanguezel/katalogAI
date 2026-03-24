// =============================================================
// FILE: src/modules/dashboard/controller.ts
// Public dashboard handlers (carrier + customer)
// =============================================================
import type { FastifyRequest, FastifyReply } from 'fastify';
import {
  CACHE_TTL,
  cacheKeys,
  getAuthUserId,
  handleRouteError,
  repoGetCacheJson,
  repoSetCacheJson,
} from "@/modules/_shared";
import { repoGetCarrierDashboard, repoGetCustomerDashboard } from './repository';

/** GET /dashboard/carrier */
export async function carrierDashboard(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = getAuthUserId(req);
    const cacheKey = cacheKeys.dashboard('carrier', userId);
    const cached = await repoGetCacheJson<Awaited<ReturnType<typeof repoGetCarrierDashboard>>>(cacheKey);
    if (cached) return reply.send(cached);

    const data = await repoGetCarrierDashboard(userId);
    await repoSetCacheJson(cacheKey, data, CACHE_TTL.dashboard);
    return reply.send(data);
  } catch (e) {
    return handleRouteError(reply, req, e, 'carrier_dashboard');
  }
}

/** GET /dashboard/customer */
export async function customerDashboard(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = getAuthUserId(req);
    const cacheKey = cacheKeys.dashboard('customer', userId);
    const cached = await repoGetCacheJson<Awaited<ReturnType<typeof repoGetCustomerDashboard>>>(cacheKey);
    if (cached) return reply.send(cached);

    const data = await repoGetCustomerDashboard(userId);
    await repoSetCacheJson(cacheKey, data, CACHE_TTL.dashboard);
    return reply.send(data);
  } catch (e) {
    return handleRouteError(reply, req, e, 'customer_dashboard');
  }
}
