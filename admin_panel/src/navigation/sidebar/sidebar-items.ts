// =============================================================
// FILE: src/navigation/sidebar/sidebar-items.ts
// KatalogAI — Sidebar navigation
// =============================================================

import {
  BarChart3,
  BookOpen,
  Contact2,
  FolderTree,
  HardDrive,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Palette,
  Send,
  Settings,
  Truck,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import type { TranslateFn } from '@/i18n/translation-utils';
import { getAdminNavRoles } from '@/navigation/permissions';
import type { AdminNavKey } from '@/navigation/permissions';
import type { PanelRole } from '@/navigation/permissions';

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export type AdminSidebarRole = PanelRole;

export type AdminNavItemKey = AdminNavKey;

export type AdminNavGroupKey = 'general' | 'listings' | 'finance' | 'support' | 'system';

export type AdminNavConfigItem = {
  key: AdminNavItemKey;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  roles?: AdminSidebarRole[];
};

export type AdminNavConfigGroup = {
  id: number;
  key: AdminNavGroupKey;
  items: AdminNavConfigItem[];
};

export const adminNavConfig: AdminNavConfigGroup[] = [
  {
    id: 1,
    key: 'general',
    items: [
      { key: 'dashboard', url: '/admin/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    id: 2,
    key: 'listings',
    items: [
      { key: 'ilanlar', url: '/admin/ilanlar', icon: Truck },
      { key: 'bookings', url: '/admin/bookings', icon: BookOpen },
      { key: 'categories', url: '/admin/categories', icon: FolderTree },
    ],
  },
  {
    id: 3,
    key: 'finance',
    items: [
      { key: 'users', url: '/admin/users', icon: Users },
      {
        key: 'carriers',
        url: '/admin/carriers',
        icon: Users,
      },
      { key: 'wallets', url: '/admin/wallet', icon: Wallet },
      {
        key: 'reports',
        url: '/admin/dashboard/coming-soon?module=reports',
        icon: BarChart3,
        comingSoon: true,
      },
    ],
  },
  {
    id: 4,
    key: 'support',
    items: [
      { key: 'contacts', url: '/admin/contacts', icon: Contact2 },
      {
        key: 'email_templates',
        url: '/admin/dashboard/coming-soon?module=email-templates',
        icon: Mail,
        comingSoon: true,
      },
    ],
  },
  {
    id: 5,
    key: 'system',
    items: [
      { key: 'site_settings', url: '/admin/site-settings', icon: Settings },
      { key: 'storage', url: '/admin/storage', icon: HardDrive },
      { key: 'theme', url: '/admin/theme', icon: Palette },
      { key: 'telegram', url: '/admin/telegram', icon: Send },
      { key: 'audit', url: '/admin/audit', icon: MessageSquare },
    ],
  },
];

export const ADMIN_NAV_TITLE_KEY_PREFIX = 'admin.sidebar.items';
export const ADMIN_NAV_LEGACY_TITLE_KEY_PREFIX = 'admin.dashboard.items';
export const ADMIN_NAV_GROUP_LABEL_KEY_PREFIX = 'admin.sidebar.groups';

export type AdminNavCopy = {
  labels: Record<AdminNavGroupKey, string>;
  items: Record<AdminNavItemKey, string>;
};

const FALLBACK_GROUP_LABELS: Record<AdminNavGroupKey, string> = {
  general:  'Genel',
  listings: 'İlan Yönetimi',
  finance:  'Kullanıcılar & Finans',
  support:  'Destek',
  system:   'Sistem',
};

const FALLBACK_TITLES: Record<AdminNavItemKey, string> = {
  dashboard: 'Dashboard',
  ilanlar: 'İlanlar',
  bookings: 'Rezervasyonlar',
  categories: 'Kategoriler',
  users: 'Kullanıcılar',
  carriers: 'Taşıyıcılar',
  wallets: 'Cüzdanlar',
  reports: 'Raporlar',
  contacts: 'İletişim',
  email_templates: 'E-posta Şablonları',
  site_settings: 'Site Ayarları',
  telegram: 'Telegram',
  theme: 'Tema',
  storage: 'Depolama',
  audit: 'Denetim',
};

export const ADMIN_NAV_ROUTE_MAP: Record<AdminNavItemKey, string> = adminNavConfig
  .flatMap((group) => group.items)
  .reduce(
    (acc, item) => {
      acc[item.key] = item.url;
      return acc;
    },
    {} as Record<AdminNavItemKey, string>,
  );

export function getAdminNavGroupLabelKey(groupKey: AdminNavGroupKey): `${typeof ADMIN_NAV_GROUP_LABEL_KEY_PREFIX}.${AdminNavGroupKey}` {
  return `${ADMIN_NAV_GROUP_LABEL_KEY_PREFIX}.${groupKey}`;
}

export function getAdminNavTitleKey(key: AdminNavItemKey): `${typeof ADMIN_NAV_TITLE_KEY_PREFIX}.${AdminNavItemKey}` {
  return `${ADMIN_NAV_TITLE_KEY_PREFIX}.${key}`;
}

export function getAdminLegacyNavTitleKey(
  key: AdminNavItemKey,
): `${typeof ADMIN_NAV_LEGACY_TITLE_KEY_PREFIX}.${AdminNavItemKey}` {
  return `${ADMIN_NAV_LEGACY_TITLE_KEY_PREFIX}.${key}`;
}

export function getAdminNavFallbackTitle(key: AdminNavItemKey): string {
  return FALLBACK_TITLES[key] || key;
}

export function getAdminNavFallbackGroupLabel(groupKey: AdminNavGroupKey): string {
  return FALLBACK_GROUP_LABELS[groupKey] || '';
}

export function getAdminNavUrl(key: AdminNavItemKey): string {
  return ADMIN_NAV_ROUTE_MAP[key];
}

export function buildAdminSidebarItems(
  copy?: Partial<AdminNavCopy> | null,
  t?: TranslateFn,
  role: AdminSidebarRole = 'admin',
): NavGroup[] {
  const labels = copy?.labels ?? ({} as AdminNavCopy['labels']);
  const items  = copy?.items  ?? ({} as AdminNavCopy['items']);

  return adminNavConfig.map((group) => {
    const label =
      labels[group.key] ||
      (t ? t(getAdminNavGroupLabelKey(group.key) as any) : '') ||
      getAdminNavFallbackGroupLabel(group.key) ||
      '';

    return {
      id: group.id,
      label,
      items: group.items
        .filter((item) => {
          const allowed = item.roles ?? getAdminNavRoles(item.key);
          if (!allowed?.length) return role === 'admin';
          return allowed.includes(role);
        })
        .map((item) => {
          const title =
            items[item.key] ||
            (t ? t(getAdminNavTitleKey(item.key) as any) : '') ||
            (t ? t(getAdminLegacyNavTitleKey(item.key) as any) : '') ||
            getAdminNavFallbackTitle(item.key) ||
            item.key;

          return {
            title,
            url: item.url,
            icon: item.icon,
            comingSoon: item.comingSoon,
          };
        }),
    };
  }).filter((group) => group.items.length > 0);
}
