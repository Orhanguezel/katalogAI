'use client';

// =============================================================
// FILE: src/app/(main)/admin/_components/header/admin-header.tsx
// Main admin header — brand, navigation dropdowns, controls
// =============================================================

import { useMemo } from 'react';
import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';

import { buildAdminSidebarItems } from '@/navigation/sidebar/sidebar-items';
import type { NavGroup, AdminSidebarRole } from '@/navigation/sidebar/sidebar-items';
import { useAdminUiCopy } from '@/app/(main)/admin/_components/common/use-admin-ui-copy';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import type { TranslateFn } from '@/i18n';
import { normalizeMeFromStatus } from '@/integrations/shared';
import { useStatusQuery, useGetMyProfileQuery } from '@/integrations/hooks';
import { useAdminSettings } from '../admin-settings-provider';
import { cn } from '@/lib/utils';

import { AdminHeaderNav } from './admin-header-nav';
import { AdminMobileNav } from './admin-mobile-nav';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { LayoutControls } from './layout-controls';
import { ThemeSwitcher } from './theme-switcher';
import { AccountSwitcher } from './account-switcher';

function withPanelTitle(appNameRaw: string, isAdmin: boolean): string {
  const panelTitle = isAdmin ? 'Admin Panel' : 'Admin Panel';
  const cleaned = appNameRaw
    .replace(/\badmin\s*panel\b/gi, '')
    .replace(/\badmin panel\b/gi, '')
    .trim();
  return cleaned ? `${cleaned} ${panelTitle}` : panelTitle;
}

export function AdminHeader() {
  const { copy } = useAdminUiCopy();
  const t = useAdminT();
  const { pageMeta, branding } = useAdminSettings();
  const baseName = (copy.app_name || branding?.app_name || '').trim();

  const { data: statusData } = useStatusQuery();
  const { data: profileData } = useGetMyProfileQuery();

  const currentUser = useMemo(() => {
    const s = statusData?.user;
    const statusMe = normalizeMeFromStatus(statusData as any);
    const statusRole = statusMe?.isAdmin ? 'admin' : (statusMe?.role || s?.role);
    return {
      id: s?.id || 'me',
      email: s?.email || 'admin',
      role: statusRole || 'admin',
    };
  }, [statusData, profileData]);

  const wrappedT: TranslateFn = (key, params, fallback) => {
    if (
      typeof key === 'string' &&
      (key.startsWith('admin.dashboard.items.') || key.startsWith('admin.sidebar.items.'))
    ) {
      const itemKey = key
        .replace('admin.dashboard.items.', '')
        .replace('admin.sidebar.items.', '');
      if (pageMeta?.[itemKey]?.title) {
        return pageMeta[itemKey].title;
      }
    }
    return t(key, params, fallback);
  };

  const sidebarRole: AdminSidebarRole = currentUser.role === 'admin' ? 'admin' : 'admin';
  const navGroups: NavGroup[] = buildAdminSidebarItems(copy.nav, wrappedT, sidebarRole);
  const panelLabel = withPanelTitle(baseName, sidebarRole === 'admin');

  return (
    <header
      className={cn(
        'flex h-20 shrink-0 items-center gap-4 border-b border-white/5 bg-katalog-bg-deep dark:bg-katalog-bg-deep px-6 lg:px-10',
        'sticky top-0 z-50 backdrop-blur-xl transition-all duration-300',
      )}
    >
      {/* Mobile hamburger */}
      <AdminMobileNav groups={navGroups} brandTitle={panelLabel} />

      {/* Brand */}
      <Link
        prefetch={false}
        href="/admin"
        className="flex items-center gap-4 mr-8 shrink-0 group"
      >
        <div className="flex size-10 items-center justify-center rounded-xl bg-katalog-gold text-katalog-bg-deep shadow-[0_0_20px_rgba(194,157,93,0.3)] group-hover:scale-110 transition-transform duration-300 ring-2 ring-white/10">
          <LayoutDashboard className="size-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-serif font-bold text-lg tracking-tight text-white hidden md:block">
            {panelLabel || 'KatalogAI'}
          </span>
          <span className="text-[10px] font-bold text-katalog-gold uppercase tracking-[0.2em] hidden md:block opacity-60">
            PREMIUM PANEL
          </span>
        </div>
      </Link>

      {/* Desktop navigation */}
      <div className="flex-1 hidden lg:flex h-full items-center justify-center px-4">
        <AdminHeaderNav groups={navGroups} />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right controls */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2">
          <LayoutControls />
          <ThemeSwitcher />
        </div>
        <div className="h-8 w-[1px] bg-white/5 hidden sm:block mx-1" />
        <AccountSwitcher me={{ id: currentUser.id, email: currentUser.email, role: currentUser.role }} />
      </div>
    </header>
  );
}
