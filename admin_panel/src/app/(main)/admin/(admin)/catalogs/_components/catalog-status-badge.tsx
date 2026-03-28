// =============================================================
// FILE: src/app/(main)/admin/(admin)/catalogs/_components/catalog-status-badge.tsx
// Catalog Status Badge
// =============================================================

'use client';

import { Badge } from '@/components/ui/badge';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import type { CatalogStatus } from '@/integrations/shared';

const STATUS_STYLES: Record<CatalogStatus, { variant: 'default' | 'secondary' | 'outline'; className?: string }> = {
  draft: { variant: 'secondary', className: 'bg-white/5 text-katalog-text-dim border-white/5 uppercase tracking-widest text-[9px] font-bold py-0.5 px-2' },
  published: { variant: 'default', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 uppercase tracking-widest text-[9px] font-bold py-0.5 px-2 hover:bg-emerald-500/20' },
  archived: { variant: 'outline', className: 'border-white/10 text-katalog-text-muted uppercase tracking-widest text-[9px] font-bold py-0.5 px-2' },
};

export default function CatalogStatusBadge({ status }: { status: CatalogStatus }) {
  const t = useAdminT('admin.catalogs');
  const style = STATUS_STYLES[status];
  return (
    <Badge variant={style.variant} className={style.className}>
      {t(`status.${status}`)}
    </Badge>
  );
}
