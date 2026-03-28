'use client';

// =============================================================
// FILE: src/app/(main)/admin/_components/admin-dashboard-client.tsx
// Admin Dashboard Client (summary cards)
// - GET /admin/dashboard/summary → { items: [{ key, label, count }] }
// - Labels: nav copy > page copy > API label > key fallback
// - Cards link to their respective admin pages
// =============================================================

import * as React from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { useGetDashboardSummaryAdminQuery } from '@/integrations/hooks';
import { useStatusQuery } from '@/integrations/hooks';
import type { DashboardSummaryItem } from '@/integrations/shared';
import type { AuthStatusResponse } from '@/integrations/shared';
import {
  ADMIN_DASHBOARD_MODULES,
  ADMIN_DASHBOARD_ROUTE_MAP,
  ADMIN_DASHBOARD_SUMMARY_PERMISSION_MAP,
  getErrorMessage,
  normalizeMeFromStatus,
} from '@/integrations/shared';

import { useAdminUiCopy } from '@/app/(main)/admin/_components/common/use-admin-ui-copy';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { useAdminSettings } from './admin-settings-provider';
import { canAccessAdminPermission } from '@/navigation/permissions';
import type { PanelRole } from '@/navigation/permissions';

export default function AdminDashboardClient() {
  const { copy } = useAdminUiCopy();
  const t = useAdminT();
  const page = copy.pages?.dashboard ?? {};

  const { pageMeta } = useAdminSettings();
  const dashboardMeta = pageMeta?.dashboard;

  const q = useGetDashboardSummaryAdminQuery();
  const statusQ = useStatusQuery();
  const me = normalizeMeFromStatus(statusQ.data as AuthStatusResponse | undefined);
  const role: PanelRole = me?.isAdmin ? 'admin' : 'seller';

  React.useEffect(() => {
    if (!q.isError) return;
    toast.error(
      getErrorMessage(q.error) || copy.common?.states?.error || t('admin.common.error'),
    );
  }, [q.isError, q.error, copy.common?.states?.error, t]);

  const items = React.useMemo(() => {
    let data = [...(q.data?.items ?? [])] as DashboardSummaryItem[];
    if (dashboardMeta?.metrics && Array.isArray(dashboardMeta.metrics) && dashboardMeta.metrics.length > 0) {
      const metricsSet = new Set(dashboardMeta.metrics);
      data.sort((a, b) => {
        const aIn = metricsSet.has(a.key) ? 0 : 1;
        const bIn = metricsSet.has(b.key) ? 0 : 1;
        return aIn - bIn;
      });
    }

    const nav = copy.nav?.items ?? ({} as Record<string, string>);

    return data
      .filter((item) => {
        const permission = ADMIN_DASHBOARD_SUMMARY_PERMISSION_MAP[item.key];
        if (!permission) return role === 'admin';
        return canAccessAdminPermission(role, permission);
      })
      .map((item) => ({
        ...item,
        label:
          (nav as Record<string, string>)[item.key] ||
          page[`label_${item.key}`] ||
          page[item.key] ||
          t(`admin.dashboard.items.${item.key}` as any) ||
          item.label ||
          item.key.replace(/_/g, ' '),
        href: ADMIN_DASHBOARD_ROUTE_MAP[item.key] ?? null,
      }));
  }, [q.data, copy.nav?.items, page, t, dashboardMeta, role]);

  const modules = React.useMemo(
    () =>
      ADMIN_DASHBOARD_MODULES.filter((m) => {
        if (!m.permission) return true;
        return canAccessAdminPermission(role, m.permission);
      }).map((module) => ({
        ...module,
        title: t(`admin.dashboard.items.${module.key}` as const),
        subtitle: t(`admin.dashboard.modules.${module.key}` as const),
      })),
    [role],
  );

  return (
    <div className="mx-auto max-w-7xl space-y-10 py-8 px-2">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-1.5">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-white italic">
            {dashboardMeta?.title || page?.title || t('admin.dashboard.title')}
          </h1>
          <p className="text-md text-katalog-text-dim max-w-lg">
            {page?.subtitle || t('admin.dashboard.subtitle') || 'Sistem genelindeki güncel veriler ve hızlı erişim araçları.'}
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="h-11 rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all font-bold"
          onClick={() => q.refetch()}
          disabled={q.isFetching}
        >
          <RefreshCcw className={`mr-2 h-4 w-4 ${q.isFetching ? ' animate-spin' : ''}`} />
          {copy.common?.actions?.refresh || t('admin.common.refresh') || 'YENİLE'}
        </Button>
      </div>

      {/* Metric Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
           <div className="h-[1px] flex-1 bg-white/5" />
           <span className="text-[10px] font-bold text-katalog-gold uppercase tracking-[0.2em]">{t('admin.dashboard.metrics') || 'GENEL METRİKLER'}</span>
           <div className="h-[1px] flex-1 bg-white/5" />
        </div>

        {/* Loading skeleton */}
        {q.isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-katalog-bg-panel border border-white/5 rounded-2xl p-6 space-y-4">
                <Skeleton className="h-4 w-24 bg-white/5" />
                <Skeleton className="h-10 w-16 bg-white/5" />
              </div>
            ))}
          </div>
        )}

        {/* Summary cards */}
        {!q.isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {items.map((item) => {
              const card = (
                <div className={cn(
                  "relative group bg-katalog-bg-panel border border-white/5 rounded-2xl p-6 transition-all h-full overflow-hidden",
                  item.href ? 'hover:border-katalog-gold/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] cursor-pointer' : ''
                )}>
                  {/* Backdrop Glow */}
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-katalog-gold/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative z-10 space-y-4">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-katalog-text-dim group-hover:text-katalog-gold transition-colors">
                      {item.label}
                    </div>
                    <div className="flex items-end justify-between">
                       <div className="text-4xl font-serif font-bold text-white tabular-nums group-hover:scale-105 origin-left transition-transform">
                         {item.count}
                       </div>
                       {item.href && (
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-katalog-gold group-hover:text-katalog-bg-deep transition-all">
                             <RefreshCcw className="h-4 w-4 -rotate-45" />
                          </div>
                       )}
                    </div>
                  </div>
                </div>
              );

              return item.href ? (
                <Link key={item.key} href={item.href} prefetch={false}>
                  {card}
                </Link>
              ) : (
                <div key={item.key}>{card}</div>
              );
            })}

            {items.length === 0 && !q.isFetching && (
              <div className="sm:col-span-2 xl:col-span-4 py-20 text-center bg-katalog-bg-card/40 rounded-2xl border border-dashed border-white/5">
                <p className="text-katalog-text-dim font-mono text-xs uppercase tracking-widest italic">{copy.common?.states?.empty || t('admin.common.noData')}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Access Modules */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center gap-4">
           <h2 className="text-sm font-bold uppercase tracking-widest text-white/60">{t('admin.dashboard.modules.title') || 'HIZLI ERİŞİM'}</h2>
           <div className="h-[1px] flex-1 bg-white/5" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {modules.map((m) => (
            <Link key={m.key} href={m.href} prefetch={false} className="group">
              <div className="bg-katalog-bg-card border border-white/5 rounded-2xl p-6 transition-all hover:bg-white/5 h-full flex flex-col justify-between hover:shadow-xl hover:shadow-black/20">
                <div className="space-y-3">
                   <div className="w-10 h-10 rounded-xl bg-katalog-gold/10 flex items-center justify-center text-katalog-gold group-hover:scale-110 transition-transform">
                      {/* Icon placeholder or dynamic mapping could go here */}
                      <RefreshCcw className="h-5 w-5" />
                   </div>
                   <div className="space-y-1">
                     <h3 className="text-lg font-bold text-white group-hover:text-katalog-gold transition-colors">{m.title}</h3>
                     <p className="text-xs text-katalog-text-dim leading-relaxed">{m.subtitle}</p>
                   </div>
                </div>
                <div className="pt-4 flex items-center gap-2 text-[10px] font-bold text-katalog-gold opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                   {t('admin.dashboard.modules.goTo')} <RefreshCcw className="h-3 w-3 -rotate-90" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
