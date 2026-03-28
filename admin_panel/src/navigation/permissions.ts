export type PanelRole = 'admin';

export type AdminPermissionKey =
  | 'admin.dashboard'
  | 'admin.users'
  | 'admin.site_settings'
  | 'admin.storage'
  | 'admin.theme'
  | 'admin.categories'
  | 'admin.catalogs'
  | 'admin.product_sources';

export type AdminNavKey =
  | 'dashboard'
  | 'users'
  | 'site_settings'
  | 'storage'
  | 'theme'
  | 'categories'
  | 'catalogs'
  | 'product_sources';

const ADMIN_ONLY: PanelRole[] = ['admin'];

const ADMIN_PERMISSION_ROLE_MAP: Record<AdminPermissionKey, PanelRole[]> = {
  'admin.dashboard': ADMIN_ONLY,
  'admin.users': ADMIN_ONLY,
  'admin.site_settings': ADMIN_ONLY,
  'admin.storage': ADMIN_ONLY,
  'admin.theme': ADMIN_ONLY,
  'admin.categories': ADMIN_ONLY,
  'admin.catalogs': ADMIN_ONLY,
  'admin.product_sources': ADMIN_ONLY,
};

export function canAccessAdminPermission(role: PanelRole, key: AdminPermissionKey): boolean {
  const allowed = ADMIN_PERMISSION_ROLE_MAP[key] ?? ADMIN_ONLY;
  return allowed.includes(role);
}

const ADMIN_NAV_PERMISSION_MAP: Partial<Record<AdminNavKey, AdminPermissionKey>> = {
  dashboard: 'admin.dashboard',
  users: 'admin.users',
  site_settings: 'admin.site_settings',
  storage: 'admin.storage',
  theme: 'admin.theme',
  categories: 'admin.categories',
  catalogs: 'admin.catalogs',
  product_sources: 'admin.product_sources',
};

export function getAdminNavRoles(key: AdminNavKey): PanelRole[] {
  const permissionKey = ADMIN_NAV_PERMISSION_MAP[key];
  if (!permissionKey) return ADMIN_ONLY;
  return ADMIN_PERMISSION_ROLE_MAP[permissionKey] ?? ADMIN_ONLY;
}

const ADMIN_PERMISSION_PATHS: Record<AdminPermissionKey, string[]> = {
  'admin.dashboard': ['/admin/dashboard'],
  'admin.users': ['/admin/users'],
  'admin.site_settings': ['/admin/site-settings'],
  'admin.storage': ['/admin/storage'],
  'admin.theme': ['/admin/theme'],
  'admin.categories': ['/admin/categories'],
  'admin.catalogs': ['/admin/catalogs'],
  'admin.product_sources': ['/admin/product-sources'],
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
