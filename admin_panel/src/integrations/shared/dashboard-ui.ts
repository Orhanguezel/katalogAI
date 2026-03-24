import type { AdminPermissionKey } from '@/navigation/permissions';
import { getAdminNavUrl } from '@/navigation/sidebar/sidebar-items';

export type DashboardModuleKey =
  | 'ilanlar'
  | 'bookings'
  | 'carriers'
  | 'contacts'
  | 'users'
  | 'wallets'
  | 'site_settings';

export type DashboardModule = {
  key: DashboardModuleKey;
  href: string;
  permission?: AdminPermissionKey;
};

export const ADMIN_DASHBOARD_ROUTE_MAP: Record<string, string> = {
  ilanlar: getAdminNavUrl('ilanlar'),
  bookings: getAdminNavUrl('bookings'),
  categories: getAdminNavUrl('categories'),
  contacts: getAdminNavUrl('contacts'),
  users: getAdminNavUrl('users'),
  carriers: getAdminNavUrl('carriers'),
  wallets: getAdminNavUrl('wallets'),
  site_settings: getAdminNavUrl('site_settings'),
  storage: getAdminNavUrl('storage'),
  theme: getAdminNavUrl('theme'),
  email_templates: getAdminNavUrl('email_templates'),
  telegram: getAdminNavUrl('telegram'),
  audit: getAdminNavUrl('audit'),
  reports: getAdminNavUrl('reports'),
};

export const ADMIN_DASHBOARD_SUMMARY_PERMISSION_MAP: Partial<Record<string, AdminPermissionKey>> = {
  ilanlar: 'admin.ilanlar',
  bookings: 'admin.bookings',
  contacts: 'admin.contacts',
  carriers: 'admin.carriers',
  wallets: 'admin.wallets',
};

export const ADMIN_DASHBOARD_MODULES: DashboardModule[] = [
  { key: 'ilanlar', href: getAdminNavUrl('ilanlar'), permission: 'admin.ilanlar' },
  { key: 'bookings', href: getAdminNavUrl('bookings'), permission: 'admin.bookings' },
  { key: 'carriers', href: getAdminNavUrl('carriers'), permission: 'admin.carriers' },
  { key: 'contacts', href: getAdminNavUrl('contacts'), permission: 'admin.contacts' },
  { key: 'users', href: getAdminNavUrl('users') },
  { key: 'wallets', href: getAdminNavUrl('wallets'), permission: 'admin.wallets' },
  { key: 'site_settings', href: getAdminNavUrl('site_settings') },
];
