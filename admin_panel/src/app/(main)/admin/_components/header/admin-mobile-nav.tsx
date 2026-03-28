'use client';

// =============================================================
// FILE: src/app/(main)/admin/_components/header/admin-mobile-nav.tsx
// Mobile hamburger navigation using Sheet
// =============================================================

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronRight } from 'lucide-react';
import type { NavGroup, NavMainItem } from '@/navigation/sidebar/sidebar-items';
import { isPathActive } from '@/navigation/nav-path-utils';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { cn } from '@/lib/utils';

interface AdminMobileNavProps {
  readonly groups: readonly NavGroup[];
  readonly brandTitle: string;
}

export function AdminMobileNav({ groups, brandTitle }: AdminMobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useAdminT();
  const comingSoonText = t('admin.sidebar.comingSoon');

  // Close sheet on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (url: string, subItems?: NavMainItem['subItems']) => {
    if (subItems?.length) {
      return subItems.some((sub) => isPathActive(pathname, searchParams, sub.url));
    }
    return isPathActive(pathname, searchParams, url);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="size-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b px-4 py-3">
          <SheetTitle className="text-sm font-bold tracking-tight">
            {brandTitle}
          </SheetTitle>
        </SheetHeader>

        <nav className="flex-1 overflow-y-auto px-2 py-3">
          {groups.map((group) => {
            if (group.items.length === 1) {
              const item = group.items[0];
              const active = isActive(item.url);
              return (
                <Link
                  key={group.id}
                  href={item.url}
                  className={cn(
                    'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    'hover:bg-accent hover:text-accent-foreground',
                    active && 'bg-accent text-accent-foreground',
                  )}
                >
                  {item.icon && <item.icon className="size-4" />}
                  <span>{item.title}</span>
                </Link>
              );
            }

            const groupActive = group.items.some((item) => isActive(item.url));
            return (
              <Collapsible key={group.id} defaultOpen={groupActive}>
                <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                  <span>{group.label}</span>
                  <ChevronRight className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-90 [[data-state=open]>&]:rotate-90" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="ml-2 border-l pl-2 space-y-0.5">
                    {group.items.map((item) => {
                      const active = isActive(item.url);
                      return (
                        <Link
                          key={item.url}
                          href={item.url}
                          className={cn(
                            'flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm transition-colors',
                            'hover:bg-accent hover:text-accent-foreground',
                            active && 'bg-accent/50 text-accent-foreground font-medium',
                          )}
                        >
                          {item.icon && <item.icon className="size-4 shrink-0 text-muted-foreground" />}
                          <span>{item.title}</span>
                          {item.comingSoon && (
                            <span className="ml-auto rounded-md bg-muted px-1.5 py-0.5 text-muted-foreground text-[10px]">
                              {comingSoonText}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
