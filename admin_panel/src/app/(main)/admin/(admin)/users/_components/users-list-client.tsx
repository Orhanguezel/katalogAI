'use client';

// =============================================================
// FILE: src/app/(main)/admin/(admin)/users/_components/users-list-client.tsx
// Admin Users List
// =============================================================

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, RefreshCcw, ChevronLeft, ChevronRight, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

import {
  ADMIN_USERS_ALL_ROLES,
  ADMIN_USERS_DEFAULT_LIMIT,
  getAdminUserDisplayName,
  getAdminUserPrimaryRole,
  getAdminUserRoleLocaleKey,
  getAdminUsersNextOffset,
  getAdminUsersPreviousOffset,
  pickAdminUsersQuery,
  toAdminUsersSearchParams,
  type UserRoleName,
  type AdminUserView,
  type AdminUsersListParams,
} from '@/integrations/shared';
import { useListUsersAdminQuery } from '@/integrations/hooks';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';

export default function UsersListClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const t = useAdminT('admin.users');

  function roleLabel(r: UserRoleName) {
    return t(`roles.${getAdminUserRoleLocaleKey(r)}`);
  }

  function statusBadge(u: AdminUserView) {
    if (!u.is_active) return <Badge variant="destructive">{t('list.table.statusInactive')}</Badge>;
    return <Badge variant="secondary">{t('list.table.statusActive')}</Badge>;
  }

  function displayName(u: Pick<AdminUserView, 'full_name'>) {
    return getAdminUserDisplayName(u, t('list.table.unknownUser'));
  }

  const params = React.useMemo(() => pickAdminUsersQuery(sp), [sp]);
  const usersQ = useListUsersAdminQuery(params);

  // UI state (controlled) – URL ile senkron
  const [q, setQ] = React.useState(params.q ?? '');
  const [role, setRole] = React.useState<UserRoleName | 'all'>((params.role as any) ?? 'all');
  const [onlyActive, setOnlyActive] = React.useState<boolean | 'all'>(
    typeof params.is_active === 'boolean' ? (params.is_active ? true : false) : 'all',
  );

  React.useEffect(() => {
    setQ(params.q ?? '');
    setRole((params.role as any) ?? 'all');
    setOnlyActive(
      typeof params.is_active === 'boolean' ? (params.is_active ? true : false) : 'all',
    );
  }, [params.q, params.role, params.is_active]);

  function apply(next: Partial<AdminUsersListParams>) {
    const merged: AdminUsersListParams = {
      ...params,
      ...next,
      offset: next.offset != null ? next.offset : 0,
    };

    if (!merged.q) delete (merged as any).q;
    if (!merged.role) delete (merged as any).role;
    if (typeof merged.is_active !== 'boolean') delete (merged as any).is_active;

    const qs = toAdminUsersSearchParams(merged);
    router.push(qs ? `/admin/users?${qs}` : `/admin/users`);
  }

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    apply({ q: q.trim() || undefined });
  }

  const limit = params.limit ?? ADMIN_USERS_DEFAULT_LIMIT;
  const offset = params.offset ?? 0;

  const canPrev = offset > 0;
  const canNext = (usersQ.data?.length ?? 0) >= limit;

  return (
    <div className="mx-auto max-w-7xl space-y-8 py-6 px-2">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-white">
            {t('list.title') || 'Kullanıcı Yönetimi'}
          </h1>
          <p className="text-sm text-katalog-text-dim max-w-lg">
            Sistemdeki kullanıcıları yönetin, erişim yetkilerini düzenleyin.
          </p>
        </div>
        <Link href="/auth/register">
          <Button className="h-10 bg-katalog-gold text-katalog-bg-deep font-bold hover:bg-katalog-gold-light">
            <UserPlus className="mr-2 h-4 w-4" />
            Kullanıcı Ekle
          </Button>
        </Link>
      </div>

      {/* Filters Section */}
      <div className="bg-katalog-bg-panel border border-white/5 rounded-2xl overflow-hidden p-6">
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-katalog-gold mb-1">{t('list.filters.title')}</h2>
          <p className="text-[10px] text-katalog-text-dim uppercase tracking-wider">{t('list.filters.description')}</p>
        </div>

        <form onSubmit={onSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-4 space-y-2">
            <Label htmlFor="q" className="text-xs font-bold text-white/60 uppercase tracking-widest">{t('list.filters.searchLabel')}</Label>
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-focus-within:text-katalog-gold transition-colors" />
              <Input
                id="q"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t('list.filters.searchPlaceholder')}
                className="pl-11 h-10 bg-katalog-bg-card border-white/5 text-white placeholder:text-katalog-text-dim focus:border-katalog-gold transition-all"
              />
            </div>
          </div>

          <div className="md:col-span-3 space-y-2">
            <Label className="text-xs font-bold text-white/60 uppercase tracking-widest">{t('list.filters.roleLabel')}</Label>
            <Select
              value={role}
              onValueChange={(v) => {
                const vv = v as UserRoleName | 'all';
                setRole(vv);
                apply({ role: vv === 'all' ? undefined : (vv as UserRoleName) });
              }}
            >
              <SelectTrigger className="h-10 bg-katalog-bg-card border-white/5 text-white">
                <SelectValue placeholder={t('list.filters.rolePlaceholder')} />
              </SelectTrigger>
              <SelectContent className="bg-katalog-bg-panel border-white/10 text-white">
                <SelectItem value="all">{t('roles.all')}</SelectItem>
                {ADMIN_USERS_ALL_ROLES.map((roleOption) => (
                  <SelectItem key={roleOption} value={roleOption}>
                    {roleLabel(roleOption)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2 flex flex-col justify-end pb-3">
            <div className="flex items-center gap-3">
              <Switch
                id="active-only"
                checked={onlyActive === true}
                onCheckedChange={(v) => {
                  const next = v ? true : 'all';
                  setOnlyActive(next);
                  apply({ is_active: v ? true : undefined });
                }}
              />
              <Label htmlFor="active-only" className="text-xs font-medium text-white/80 cursor-pointer">{t('list.filters.onlyActive')}</Label>
            </div>
          </div>

          <div className="md:col-span-3 flex items-center justify-end gap-2 pr-1 pb-1">
            <Button 
               type="submit" 
               disabled={usersQ.isFetching}
               className="h-10 px-6 rounded-lg bg-katalog-gold text-katalog-bg-deep font-bold hover:bg-katalog-gold-light transition-all"
            >
              {t('list.filters.searchButton')}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 border-white/10 bg-white/5 text-white hover:bg-white/10"
              onClick={() => {
                setQ('');
                setRole('all');
                setOnlyActive('all');
                router.push('/admin/users');
              }}
              disabled={usersQ.isFetching}
            >
              {t('list.filters.resetButton')}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="h-10 w-10 p-0 text-white/40 hover:text-white hover:bg-white/5"
              onClick={() => usersQ.refetch()}
              disabled={usersQ.isFetching}
            >
              <RefreshCcw className={`size-4 ${usersQ.isFetching ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </form>
      </div>

      {/* Table Section */}
      <div className="bg-katalog-bg-panel border border-white/5 rounded-2xl overflow-hidden p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
             <h2 className="text-xs font-bold uppercase tracking-widest text-katalog-gold">KULLANICI LİSTESİ</h2>
             <p className="text-[10px] text-katalog-text-dim uppercase tracking-wider font-mono">
               {usersQ.isFetching ? t('list.table.loading') : `${usersQ.data?.length || 0} KAYIT BULUNDU`}
             </p>
          </div>
        </div>

        {usersQ.isError ? (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center">
            <p className="text-red-400 text-sm mb-4">{t('list.table.loadError')}</p>
            <Button
              variant="outline"
              className="border-red-500/30 text-red-500 hover:bg-red-500/10"
              onClick={() => usersQ.refetch()}
            >
              {t('list.table.retryButton')}
            </Button>
          </div>
        ) : (
          <div className="rounded-xl border border-white/5 bg-katalog-bg-card overflow-hidden">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="hover:bg-transparent border-white/5">
                  <TableHead className="text-white font-bold h-12">{t('list.table.fullName')}</TableHead>
                  <TableHead className="text-white font-bold h-12">{t('list.table.email')}</TableHead>
                  <TableHead className="text-white font-bold h-12">{t('list.table.status')}</TableHead>
                  <TableHead className="text-white font-bold h-12">{t('list.table.role')}</TableHead>
                  <TableHead className="w-[100px] text-right pr-6 h-12"></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {(usersQ.data ?? []).map((u) => (
                  <TableRow key={u.id} className="hover:bg-white/2 border-white/5 transition-colors">
                    <TableCell className="font-medium text-white py-4 pl-6">
                      <div className="flex items-center gap-3">
                         <div className="w-9 h-9 rounded-lg bg-katalog-gold/10 flex items-center justify-center font-serif font-bold text-katalog-gold">
                            {displayName(u).charAt(0)}
                         </div>
                         <div className="flex flex-col">
                            <span>{displayName(u)}</span>
                            <span className="text-[10px] text-katalog-text-dim font-mono">{u.phone || '—'}</span>
                         </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-katalog-text-dim text-sm">{u.email ?? '—'}</TableCell>
                    <TableCell>{statusBadge(u)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`border-none uppercase tracking-widest text-[10px] font-bold ${u.roles.includes('admin') ? 'bg-katalog-gold/10 text-katalog-gold' : 'bg-white/5 text-katalog-text-dim'}`}>
                        {roleLabel(getAdminUserPrimaryRole(u))}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button asChild variant="ghost" size="sm" className="h-9 px-4 text-white hover:bg-white/10 hover:text-katalog-gold">
                        <Link prefetch={false} href={`/admin/users/${encodeURIComponent(u.id)}`}>
                          {t('list.table.viewButton') || 'Detay'}
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {!usersQ.isFetching && (usersQ.data?.length ?? 0) === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-20 text-center text-katalog-text-dim/40 italic">
                      {t('list.table.noRecords')}
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex items-center justify-between mt-8 pr-1">
          <div className="font-mono text-[10px] text-katalog-text-dim uppercase tracking-widest">
            {t('list.pagination.offset', { offset })} • {t('list.pagination.limit', { limit })}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-lg border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-20 transition-all font-bold px-4"
              disabled={!canPrev || usersQ.isFetching}
              onClick={() => apply({ offset: getAdminUsersPreviousOffset(offset, limit) })}
            >
              <ChevronLeft className="mr-2 size-4" />
              {t('list.pagination.previous')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-lg border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-20 transition-all font-bold px-4"
              disabled={!canNext || usersQ.isFetching}
              onClick={() => apply({ offset: getAdminUsersNextOffset(offset, limit) })}
            >
              {t('list.pagination.next')}
              <ChevronRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
