// src/routes.ts
// Tüm modül route kayıtları — public + admin

import type { FastifyInstance } from 'fastify';
import { requireAuth } from '@/common/middleware/auth';
import { requireAdmin } from '@/common/middleware/roles';

// ── Public modüller ──────────────────────────────────────────────────────────
import { registerAuth, registerUserAdmin } from '@/modules/auth';
import { registerStorage, registerStorageAdmin } from '@/modules/storage';
import { registerSiteSettings, registerSiteSettingsAdmin } from '@/modules/siteSettings';
import { registerUserRoles } from '@/modules/userRoles';
import { registerHealth } from '@/modules/health';
import { registerDashboard, registerDashboardAdmin } from '@/modules/dashboard';
import { registerCategoriesAdmin } from '@/modules/categories';
import { registerTheme, registerThemeAdmin } from '@/modules/theme';
import { registerProductSourcesAdmin } from '@/modules/productSources';
import { registerCatalogsAdmin } from '@/modules/catalogs';
import { registerExportsAdmin } from '@/modules/exports';
import { registerAiTasksAdmin } from '@/modules/aiTasks';
import { registerScraperAdmin } from '@/modules/scraper';
import { registerProfiles } from '@/modules/profiles';

const PUBLIC_ROUTE_REGISTRARS = [
  registerAuth,
  registerHealth,
  registerStorage,
  registerSiteSettings,
  registerUserRoles,
  registerDashboard,
  registerTheme,
] as const;

// Auth-protected (non-admin) routes
const AUTH_ROUTE_REGISTRARS = [
  registerProfiles,
] as const;

const ADMIN_ROUTE_REGISTRARS = [
  registerSiteSettingsAdmin,
  registerUserAdmin,
  registerStorageAdmin,
  registerDashboardAdmin,
  registerCategoriesAdmin,
  registerThemeAdmin,
  registerProductSourcesAdmin,
  registerCatalogsAdmin,
  registerExportsAdmin,
  registerAiTasksAdmin,
  registerScraperAdmin,
] as const;

// ── Public route kayıtları ───────────────────────────────────────────────────
async function registerPublicRoutes(api: FastifyInstance) {
  for (const registerRoute of PUBLIC_ROUTE_REGISTRARS) {
    await registerRoute(api);
  }
}

// ── Admin route kayıtları (requireAuth + requireAdmin guard) ─────────────────
async function registerAdminRoutes(adminApi: FastifyInstance) {
  for (const registerRoute of ADMIN_ROUTE_REGISTRARS) {
    await adminApi.register(registerRoute);
  }
}

// ── Ana kayıt fonksiyonu ─────────────────────────────────────────────────────
export async function registerAllRoutes(app: FastifyInstance) {
  await app.register(async (api) => {
    // Admin — /api/admin/*
    await api.register(async (adminApi) => {
      adminApi.addHook('onRequest', requireAuth);
      adminApi.addHook('onRequest', requireAdmin);
      await registerAdminRoutes(adminApi);
    }, { prefix: '/admin' });

    // Auth-protected (non-admin) — /api/* with requireAuth
    await api.register(async (authApi) => {
      authApi.addHook('onRequest', requireAuth);
      for (const registerRoute of AUTH_ROUTE_REGISTRARS) {
        await registerRoute(authApi);
      }
    });

    // Public — /api/*
    await registerPublicRoutes(api);
  }, { prefix: '/api' });
}
