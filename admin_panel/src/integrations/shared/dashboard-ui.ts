import type { AdminPermissionKey } from '@/navigation/permissions';
import { getAdminNavUrl } from '@/navigation/sidebar/sidebar-items';

export type DashboardModuleKey =
  | 'users'
  | 'catalogs'
  | 'categories'
  | 'site_settings';

export type DashboardModule = {
  key: DashboardModuleKey;
  href: string;
  permission?: AdminPermissionKey;
};

export const ADMIN_DASHBOARD_ROUTE_MAP: Record<string, string> = {
  catalogs: getAdminNavUrl('catalogs'),
  categories: getAdminNavUrl('categories'),
  users: getAdminNavUrl('users'),
  site_settings: getAdminNavUrl('site_settings'),
  storage: getAdminNavUrl('storage'),
  theme: getAdminNavUrl('theme'),
};

export const ADMIN_DASHBOARD_SUMMARY_PERMISSION_MAP: Partial<Record<string, AdminPermissionKey>> = {};

export const ADMIN_DASHBOARD_MODULES: DashboardModule[] = [
  { key: 'catalogs', href: getAdminNavUrl('catalogs'), permission: 'admin.catalogs' },
  { key: 'categories', href: getAdminNavUrl('categories'), permission: 'admin.categories' },
  { key: 'users', href: getAdminNavUrl('users'), permission: 'admin.users' },
  { key: 'site_settings', href: getAdminNavUrl('site_settings') },
];
