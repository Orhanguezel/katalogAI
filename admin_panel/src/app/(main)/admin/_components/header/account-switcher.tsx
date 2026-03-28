'use client';

// =============================================================
// FILE: src/app/(main)/admin/_components/sidebar/account-switcher.tsx
// Panel – Account menu (minimal: user info + logout)
// =============================================================

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, LogOut } from 'lucide-react';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getInitials } from '@/lib/utils';

import { useLogoutMutation, useStatusQuery, useGetMyProfileQuery } from '@/integrations/hooks';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';

type Me = {
  id: string;
  email: string | null;
  role: string;
};

export function AccountSwitcher({ me: propMe }: { me: Me }) {
  const router = useRouter();
  const [logout, { isLoading }] = useLogoutMutation();
  const t = useAdminT();

  const { data: statusData } = useStatusQuery();
  const { data: profileData } = useGetMyProfileQuery();

  const me = useMemo(() => {
    const s = statusData?.user;
    return {
      id: s?.id || propMe?.id || 'me',
      email: s?.email || propMe?.email || 'admin',
      role: s?.role || propMe?.role || 'admin',
      displayName: profileData?.full_name || s?.email?.split('@')[0] || propMe?.email || 'Admin',
      avatar: profileData?.avatar_url || '',
    };
  }, [statusData, profileData, propMe]);

  const displayName = me.displayName;

  async function onLogout() {
    try {
      await logout().unwrap();
    } catch {
      // logout fail olsa bile login'e gönder
    } finally {
      router.replace('/auth/login');
      router.refresh();
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative cursor-pointer group">
          <Avatar className="size-10 rounded-xl ring-2 ring-white/10 group-hover:ring-katalog-gold/50 transition-all duration-300 shadow-lg">
            <AvatarImage src={me.avatar || undefined} alt={displayName} />
            <AvatarFallback className="rounded-xl bg-katalog-bg-card text-katalog-gold font-bold">{getInitials(displayName)}</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 size-3 bg-green-500 border-2 border-katalog-bg-deep rounded-full shadow-sm" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-72 bg-katalog-bg-panel border border-white/10 rounded-2xl p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-200" side="bottom" align="end" sideOffset={12}>
        <div className="px-4 py-4 flex items-center gap-3 bg-white/2 rounded-xl mb-2">
           <Avatar className="size-12 rounded-xl ring-1 ring-white/10">
              <AvatarImage src={me.avatar || undefined} alt={displayName} />
              <AvatarFallback className="rounded-xl bg-katalog-bg-card text-katalog-gold font-bold">{getInitials(displayName)}</AvatarFallback>
           </Avatar>
           <div className="flex flex-col min-w-0">
             <div className="text-sm font-bold text-white truncate">{displayName}</div>
             <div className="text-[10px] font-bold text-katalog-gold uppercase tracking-[0.2em] opacity-60 truncate">{me.role}</div>
           </div>
        </div>

        <DropdownMenuSeparator className="bg-white/5 mx-[-8px] my-2" />

        <div className="space-y-1">
          <DropdownMenuItem asChild className="rounded-xl focus:bg-white/5 focus:text-white cursor-pointer py-3 px-4">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center text-katalog-text-dim group-hover:text-white">
                 <LayoutDashboard className="size-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">{t('admin.dashboard.items.dashboard') || 'PANEL'}</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-white/5 mx-[-8px] my-2" />

          <DropdownMenuItem onClick={onLogout} disabled={isLoading} className="rounded-xl focus:bg-red-500/10 focus:text-red-400 text-katalog-text-dim cursor-pointer py-3 px-4 transition-colors">
            <div className="flex items-center gap-3 w-full">
               <div className="size-8 rounded-lg bg-red-500/5 flex items-center justify-center text-red-400/60">
                  <LogOut className="size-4" />
               </div>
               <span className="text-xs font-bold uppercase tracking-widest">{t('admin.sidebar.user.logout') || 'ÇIKIŞ YAP'}</span>
            </div>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
