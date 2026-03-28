'use client';

// =============================================================
// FILE: src/app/(main)/admin/_components/sidebar/admin-sidebar.tsx
// Left Sidebar — Premium Navigation (for Admin Panel)
// =============================================================

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useAdminUiCopy } from '@/app/(main)/admin/_components/common/use-admin-ui-copy';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { buildAdminSidebarItems } from '@/navigation/sidebar/sidebar-items';
import type { NavGroup, NavMainItem } from '@/navigation/sidebar/sidebar-items';
import { normalizeMeFromStatus } from '@/integrations/shared';
import { useStatusQuery } from '@/integrations/hooks';
import { useAdminSettings } from '../admin-settings-provider';
import type { PanelRole } from '@/navigation/permissions';

export function AdminSidebar() {
  const pathname = usePathname();
  const { copy } = useAdminUiCopy();
  const t = useAdminT();
  const { data: statusData } = useStatusQuery();
  
  const currentUser = React.useMemo(() => {
    const s = statusData?.user;
    const statusMe = normalizeMeFromStatus(statusData as any);
    const statusRole = statusMe?.isAdmin ? 'admin' : (statusMe?.role || s?.role);
    return {
      id: s?.id || 'me',
      email: s?.email || 'admin',
      role: statusRole || 'admin',
    };
  }, [statusData]);
  
  const navGroups: NavGroup[] = React.useMemo(() => {
    const role: PanelRole = currentUser.role === 'admin' ? 'admin' : 'admin';
    return buildAdminSidebarItems(copy.nav, t, role === 'admin' ? 'admin' : 'admin');
  }, [copy.nav, t, currentUser.role]);

  return (
    <Sidebar className="border-r border-white/5 bg-katalog-bg-panel text-white">
      <SidebarHeader className="h-20 flex items-center px-6">
        <div className="flex items-center gap-3">
           <div className="flex size-8 items-center justify-center rounded-lg bg-katalog-gold text-katalog-bg-deep shadow-lg ring-1 ring-white/10">
              <span className="font-serif font-bold text-lg">K</span>
           </div>
           <div className="flex flex-col">
             <span className="font-serif font-bold text-base tracking-tight leading-none">KatalogAI</span>
             <span className="text-[9px] font-bold text-katalog-gold uppercase tracking-widest opacity-60">Admin Panel</span>
           </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6 space-y-8">
        {navGroups.map((group) => (
          <SidebarGroup key={group.id} className="p-0">
            <SidebarGroupLabel className="px-2 mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-katalog-text-dim">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1.5">
                {group.items.map((item: NavMainItem) => {
                  const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`);
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive}
                        className={cn(
                          "h-10 px-3 transition-all duration-300 rounded-xl font-medium text-sm",
                          isActive 
                            ? "bg-katalog-gold/10 text-katalog-gold border border-katalog-gold/20" 
                            : "text-katalog-text-muted hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <Link href={item.url}>
                          {item.icon && <item.icon className={cn("size-4.5 shrink-0", isActive ? "text-katalog-gold" : "text-katalog-text-dim")} />}
                          <span className="ml-1 tracking-wide uppercase font-bold text-[10px]">{item.title}</span>
                          {item.comingSoon && (
                             <span className="ml-auto bg-white/5 text-[9px] px-1.5 py-0.5 rounded uppercase opacity-40">SOON</span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-6 border-t border-white/5">
        <div className="rounded-xl bg-katalog-bg-card/50 border border-white/5 p-4">
           <p className="text-[10px] font-bold text-katalog-text-dim uppercase tracking-widest mb-1">Quota</p>
           <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
             <div className="h-full w-2/3 bg-katalog-gold" />
           </div>
           <p className="text-[9px] mt-2 text-katalog-text-dim">Used 60 of 100 catalysts</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
