// src/modules/dashboard/index.ts
// External module surface for dashboard. Keep explicit; no export *.

export { registerDashboard } from './router';
export { registerDashboardAdmin } from './admin.routes';

export { carrierDashboard, customerDashboard } from './controller';

export {
  adminDashboardSummary,
  adminStatsRevenue,
  adminStatsActivity,
} from './admin.controller';

export {
  repoGetCarrierDashboard,
  repoGetCustomerDashboard,
  repoGetAdminSummary,
  repoGetRevenueStats,
  repoGetActivityStats,
} from './repository';

export {
  toDashboardCount,
  buildAdminDashboardSummaryItems,
  buildDashboardWalletSnapshot,
} from './helpers';
