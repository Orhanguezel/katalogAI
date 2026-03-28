// src/modules/dashboard/index.ts
// External module surface for dashboard. Keep explicit; no export *.

export { registerDashboard } from './router';
export { registerDashboardAdmin } from './admin.routes';

export { dashboardStatus } from './controller';
export { adminDashboardSummary } from './admin.controller';
export { repoGetAdminSummary } from './repository';

export {
  toDashboardCount,
  buildAdminDashboardSummaryItems,
} from './helpers';
