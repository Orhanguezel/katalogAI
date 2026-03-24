export type PanelRole = 'admin' | 'seller';

export type AdminPermissionKey =
  | 'admin.dashboard'
  | 'admin.ilanlar'
  | 'admin.bookings'
  | 'admin.users'
  | 'admin.carriers'
  | 'admin.wallets'
  | 'admin.contacts'
  | 'admin.site_settings'
  | 'admin.storage'
  | 'admin.theme'
  | 'admin.email_templates'
  | 'admin.telegram'
  | 'admin.audit'
  | 'admin.categories'
  | 'admin.reports';

export type AdminNavKey =
  | 'dashboard'
  | 'ilanlar'
  | 'bookings'
  | 'users'
  | 'carriers'
  | 'wallets'
  | 'contacts'
  | 'site_settings'
  | 'storage'
  | 'theme'
  | 'email_templates'
  | 'telegram'
  | 'audit'
  | 'categories'
  | 'reports';

const ADMIN_ONLY: PanelRole[] = ['admin'];

const ADMIN_PERMISSION_ROLE_MAP: Record<AdminPermissionKey, PanelRole[]> = {
  'admin.dashboard': ADMIN_ONLY,
  'admin.ilanlar': ADMIN_ONLY,
  'admin.bookings': ADMIN_ONLY,
  'admin.users': ADMIN_ONLY,
  'admin.carriers': ADMIN_ONLY,
  'admin.wallets': ADMIN_ONLY,
  'admin.contacts': ADMIN_ONLY,
  'admin.site_settings': ADMIN_ONLY,
  'admin.storage': ADMIN_ONLY,
  'admin.theme': ADMIN_ONLY,
  'admin.email_templates': ADMIN_ONLY,
  'admin.telegram': ADMIN_ONLY,
  'admin.audit': ADMIN_ONLY,
  'admin.categories': ADMIN_ONLY,
  'admin.reports': ADMIN_ONLY,
};

export function canAccessAdminPermission(role: PanelRole, key: AdminPermissionKey): boolean {
  const allowed = ADMIN_PERMISSION_ROLE_MAP[key] ?? ADMIN_ONLY;
  return allowed.includes(role);
}

const ADMIN_NAV_PERMISSION_MAP: Partial<Record<AdminNavKey, AdminPermissionKey>> = {
  dashboard: 'admin.dashboard',
  ilanlar: 'admin.ilanlar',
  bookings: 'admin.bookings',
  users: 'admin.users',
  carriers: 'admin.carriers',
  wallets: 'admin.wallets',
  contacts: 'admin.contacts',
  site_settings: 'admin.site_settings',
  storage: 'admin.storage',
  theme: 'admin.theme',
  email_templates: 'admin.email_templates',
  telegram: 'admin.telegram',
  audit: 'admin.audit',
  categories: 'admin.categories',
  reports: 'admin.reports',
};

export function getAdminNavRoles(key: AdminNavKey): PanelRole[] {
  const permissionKey = ADMIN_NAV_PERMISSION_MAP[key];
  if (!permissionKey) return ADMIN_ONLY;
  return ADMIN_PERMISSION_ROLE_MAP[permissionKey] ?? ADMIN_ONLY;
}

const ADMIN_PERMISSION_PATHS: Record<AdminPermissionKey, string[]> = {
  'admin.dashboard': ['/admin/dashboard'],
  'admin.ilanlar': ['/admin/ilanlar'],
  'admin.bookings': ['/admin/bookings'],
  'admin.users': ['/admin/users'],
  'admin.carriers': ['/admin/carriers'],
  'admin.wallets': ['/admin/wallet'],
  'admin.contacts': ['/admin/contacts'],
  'admin.site_settings': ['/admin/site-settings'],
  'admin.storage': ['/admin/storage'],
  'admin.theme': ['/admin/theme'],
  'admin.email_templates': ['/admin/email-templates'],
  'admin.telegram': ['/admin/telegram'],
  'admin.audit': ['/admin/audit'],
  'admin.categories': ['/admin/categories'],
  'admin.reports': ['/admin/reports'],
};

function stripQueryAndHash(pathname: string): string {
  const [noHash] = pathname.split('#', 1);
  const [clean] = (noHash ?? pathname).split('?', 1);
  return clean || '/';
}

function matchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function canAccessAdminPath(role: PanelRole, pathname: string): boolean {
  if (role === 'admin') return true;
  const clean = stripQueryAndHash(pathname);

  return (Object.keys(ADMIN_PERMISSION_PATHS) as AdminPermissionKey[]).some((permissionKey) => {
    if (!canAccessAdminPermission(role, permissionKey)) return false;
    const prefixes = ADMIN_PERMISSION_PATHS[permissionKey] ?? [];
    return prefixes.some((prefix) => matchesPrefix(clean, prefix));
  });
}
