import type { FastifyInstance } from 'fastify';

import { registerDashboard, registerDashboardAdmin } from '@/modules/dashboard';
import { registerProductSourcesAdmin } from '@/modules/productSources';
import { registerCatalogsAdmin } from '@/modules/catalogs';
import { registerExportsAdmin } from '@/modules/exports';
import { registerAiTasksAdmin } from '@/modules/aiTasks';
import { registerScraperAdmin } from '@/modules/scraper';

export async function registerProjectPublic(api: FastifyInstance) {
  await registerDashboard(api);
}

export async function registerProjectAdmin(adminApi: FastifyInstance) {
  for (const reg of [
    registerDashboardAdmin,
    registerProductSourcesAdmin,
    registerCatalogsAdmin,
    registerExportsAdmin,
    registerAiTasksAdmin,
    registerScraperAdmin,
  ]) {
    await adminApi.register(reg);
  }
}
