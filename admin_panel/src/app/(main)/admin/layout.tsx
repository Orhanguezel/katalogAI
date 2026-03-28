'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { AdminFooter } from './_components/sidebar/admin-footer';
import AdminAuthGate from './_components/admin-auth-gate';
import { AdminSettingsProvider } from './_components/admin-settings-provider';
import { AdminHeader } from './_components/header';

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const isBuilder = pathname?.includes('/admin/catalogs/') && pathname?.split('/').length > 3;

  return (
    <AdminAuthGate>
      <AdminSettingsProvider>
        <div className="flex min-h-screen flex-col bg-katalog-bg-deep text-white selection:bg-katalog-gold/30">
          {!isBuilder && <AdminHeader />}

          <div className="flex flex-1 flex-col overflow-hidden">
            <div
              className={cn(
                'flex-1 min-w-0 overflow-auto p-4 md:p-10',
                '[html[data-content-layout=centered]_&]:mx-auto [html[data-content-layout=centered]_&]:max-w-screen-2xl [html[data-content-layout=centered]_&]:w-full',
              )}
            >
              {children}
            </div>
            <AdminFooter />
          </div>
        </div>
      </AdminSettingsProvider>
    </AdminAuthGate>
  );
}
