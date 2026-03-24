// src/routes.ts
// Tüm modül route kayıtları — public + admin

import type { FastifyInstance } from 'fastify';
import { requireAuth } from '@/common/middleware/auth';
import { requireAdmin } from '@/common/middleware/roles';

// ── Public modüller ──────────────────────────────────────────────────────────
import { registerAuth, registerUserAdmin } from '@/modules/auth';
import { registerStorage, registerStorageAdmin } from '@/modules/storage';
import { registerProfiles } from '@/modules/profiles';
import { registerSiteSettings, registerSiteSettingsAdmin } from '@/modules/siteSettings';
import { registerUserRoles } from '@/modules/userRoles';
import { registerHealth } from '@/modules/health';
import { registerMail } from '@/modules/mail';
import { registerNotifications } from '@/modules/notifications';
import { registerIlanlar, registerIlanlarAdmin } from '@/modules/ilanlar';
import { registerBookings, registerBookingsAdmin } from '@/modules/bookings';
import { registerBookingPayments } from '@/modules/bookings/payment.routes';
import { registerWallet, registerWalletAdmin } from '@/modules/wallet';
import { registerDashboard, registerDashboardAdmin } from '@/modules/dashboard';
import { registerRatings } from '@/modules/ratings';
import { registerAudit, registerAuditAdmin, registerAuditStream } from '@/modules/audit';
import { registerContacts, registerContactsAdmin } from '@/modules/contact';
import { registerCustomPages, registerCustomPagesAdmin } from '@/modules/customPages';
import { registerSupport, registerSupportAdmin } from '@/modules/support';
import { registerCategoriesAdmin } from '@/modules/categories';
import { registerTheme, registerThemeAdmin } from '@/modules/theme';
import { registerTelegram, registerTelegramAdmin } from '@/modules/telegram';
import { registerSubscription, registerSubscriptionAdmin } from '@/modules/subscription';
import { registerCarriersAdmin } from '@/modules/carriers';
import { registerCarrierBank } from '@/modules/carrier-bank';
import { registerWithdrawal, registerWithdrawalAdmin } from '@/modules/withdrawal';

import { registerEmailTemplatesAdmin } from '@/modules/emailTemplates/admin.routes';
import { registerReportsAdmin } from '@/modules/reports';

const PUBLIC_ROUTE_REGISTRARS = [
  registerAuth,
  registerHealth,
  registerStorage,
  registerProfiles,
  registerSiteSettings,
  registerUserRoles,
  registerMail,
  registerNotifications,
  registerIlanlar,
  registerBookings,
  registerBookingPayments,
  registerWallet,
  registerDashboard,
  registerRatings,
  registerAudit,
  registerContacts,
  registerCustomPages,
  registerSupport,
  registerTheme,
  registerTelegram,
  registerSubscription,
  registerCarrierBank,
  registerWithdrawal,
] as const;

const ADMIN_ROUTE_REGISTRARS = [
  registerSiteSettingsAdmin,
  registerUserAdmin,
  registerStorageAdmin,
  registerDashboardAdmin,
  registerWalletAdmin,
  registerIlanlarAdmin,
  registerBookingsAdmin,
  registerContactsAdmin,
  registerCustomPagesAdmin,
  registerSupportAdmin,
  registerCategoriesAdmin,
  registerThemeAdmin,
  registerEmailTemplatesAdmin,
  registerAuditAdmin,
  registerAuditStream,
  registerTelegramAdmin,
  registerReportsAdmin,
  registerSubscriptionAdmin,
  registerCarriersAdmin,
  registerWithdrawalAdmin,
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

    // Public — /api/*
    await registerPublicRoutes(api);
  }, { prefix: '/api' });
}
