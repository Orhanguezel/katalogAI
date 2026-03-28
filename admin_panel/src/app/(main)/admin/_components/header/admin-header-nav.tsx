'use client';

// =============================================================
// FILE: src/app/(main)/admin/_components/header/admin-header-nav.tsx
// Desktop dropdown navigation using shadcn NavigationMenu
// =============================================================

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import type { NavGroup, NavMainItem } from '@/navigation/sidebar/sidebar-items';
import { isPathActive } from '@/navigation/nav-path-utils';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { cn } from '@/lib/utils';

interface AdminHeaderNavProps {
  readonly groups: readonly NavGroup[];
}

function ComingSoonBadge({ text }: { text: string }) {
  return (
    <span className="ml-auto rounded-md bg-muted px-1.5 py-0.5 text-muted-foreground text-[10px]">
      {text}
    </span>
  );
}

export function AdminHeaderNav({ groups }: AdminHeaderNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useAdminT();
  const comingSoonText = t('admin.sidebar.comingSoon');

  const isActive = (url: string, subItems?: NavMainItem['subItems']) => {
    if (subItems?.length) {
      return subItems.some((sub) => isPathActive(pathname, searchParams, sub.url));
    }
    return isPathActive(pathname, searchParams, url);
  };

  const isGroupActive = (group: NavGroup) => {
    return group.items.some((item) => isActive(item.url, item.subItems));
  };

  return (
    <NavigationMenu viewport={false} className="hidden lg:flex h-full">
      <NavigationMenuList className="gap-1 items-center h-full">
        {groups.map((group) => {
          if (group.items.length === 1) {
            const item = group.items[0];
            const active = isActive(item.url);
            return (
              <NavigationMenuItem key={group.id}>
                <Link href={item.url} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      'flex items-center gap-2 h-10 px-4 rounded-xl transition-all duration-300',
                      'font-bold text-[11px] uppercase tracking-[0.15em] whitespace-nowrap',
                      active 
                        ? 'bg-katalog-gold text-katalog-bg-deep shadow-[0_8px_20px_rgba(194,157,93,0.3)] ring-1 ring-katalog-gold/20' 
                        : 'text-white/70 hover:bg-white/5 hover:text-white',
                    )}
                  >
                    {item.icon && <item.icon className="size-3.5" />}
                    <span>{item.title}</span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            );
          }

          const groupActive = isGroupActive(group);
          return (
            <NavigationMenuItem key={group.id}>
              <NavigationMenuTrigger
                className={cn(
                  'h-10 px-4 rounded-xl bg-transparent transition-all duration-300',
                  'font-bold text-[11px] uppercase tracking-[0.15em] whitespace-nowrap',
                  groupActive 
                    ? 'text-katalog-gold' 
                    : 'text-white/70 hover:bg-white/5 hover:text-white',
                  'data-[state=open]:bg-white/5 data-[state=open]:text-white'
                )}
              >
                {group.label}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="bg-[#121512] border border-white/5 rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] min-w-[240px] animate-in fade-in zoom-in-95 duration-200">
                  <ul className="space-y-1">
                    {group.items.map((item) => {
                      const active = isActive(item.url);
                      return (
                        <li key={item.url}>
                          <Link href={item.url} legacyBehavior passHref>
                            <NavigationMenuLink
                              data-active={active || undefined}
                              className={cn(
                                'flex flex-row items-center gap-3 rounded-xl px-4 py-2.5 transition-all duration-200 group h-auto',
                                active 
                                  ? 'bg-katalog-gold/10 text-katalog-gold border border-katalog-gold/20' 
                                  : 'text-katalog-text-muted hover:bg-white/5 hover:text-white',
                                'font-medium'
                              )}
                            >
                              <div className={cn(
                                "size-8 rounded-lg flex items-center justify-center transition-all", 
                                active ? "bg-katalog-gold text-katalog-bg-deep" : "bg-white/5 group-hover:bg-katalog-gold/20"
                              )}>
                                {item.icon && <item.icon className="size-4 shrink-0" />}
                              </div>
                              <div className="flex flex-col flex-1 min-w-0">
                                <span className="uppercase font-bold tracking-widest text-[10px] truncate">{item.title}</span>
                                {item.comingSoon && <ComingSoonBadge text={comingSoonText} />}
                              </div>
                            </NavigationMenuLink>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
