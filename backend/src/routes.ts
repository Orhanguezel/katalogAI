import type { FastifyInstance } from 'fastify';
import { requireAuth } from '@agro/shared-backend/middleware/auth';
import { requireAdmin } from '@agro/shared-backend/middleware/roles';
import { registerSharedPublic, registerSharedAdmin } from './routes/shared';
import { registerProjectPublic, registerProjectAdmin } from './routes/project';

/**
 * Endpoint pattern (ekosistem standardi):
 *   /api/health                — versionsuz health probe
 *   /api/v1/<modul>/...        — public modul rotalari
 *   /api/v1/admin/<modul>/...  — admin (auth + role gateli) rotalar
 *
 * Tum is endpoint'leri /api/v1 altindadir. Ileride /api/v2 yan yana
 * register edilebilir; mevcut v1 client'lari kirilmaz.
 */
export async function registerAllRoutes(app: FastifyInstance) {
  await app.register(async (api) => {
    api.get('/health', async () => ({ ok: true }));

    await api.register(async (v1) => {
      await v1.register(async (adminApi) => {
        adminApi.addHook('onRequest', requireAuth);
        adminApi.addHook('onRequest', requireAdmin);
        await registerSharedAdmin(adminApi);
        await registerProjectAdmin(adminApi);
      }, { prefix: '/admin' });

      await registerSharedPublic(v1);
      await registerProjectPublic(v1);
    }, { prefix: '/v1' });
  }, { prefix: '/api' });
}
