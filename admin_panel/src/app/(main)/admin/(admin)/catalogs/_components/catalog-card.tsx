// =============================================================
// FILE: src/app/(main)/admin/(admin)/catalogs/_components/catalog-card.tsx
// Single Catalog Card
// =============================================================

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BookOpen, Copy, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import {
  useDeleteCatalogAdminMutation,
  useDuplicateCatalogAdminMutation,
} from '@/integrations/hooks';
import type { CatalogDto } from '@/integrations/shared';

import CatalogStatusBadge from './catalog-status-badge';

interface Props {
  catalog: CatalogDto;
}

export default function CatalogCard({ catalog }: Props) {
  const t = useAdminT('admin.catalogs');
  const router = useRouter();
  const [deleteCatalog] = useDeleteCatalogAdminMutation();
  const [duplicateCatalog] = useDuplicateCatalogAdminMutation();

  const href = `/admin/catalogs/${catalog.id}`;

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(t('messages.confirmDelete', { title: catalog.title }))) return;
    await deleteCatalog(catalog.id);
  };

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-katalog-bg-card transition-all duration-300 hover:-translate-y-1 hover:border-katalog-gold/40 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] cursor-pointer"
      onClick={() => router.push(href)}
    >
      <div className="relative aspect-3/4 w-full overflow-hidden bg-katalog-bg-accent flex items-center justify-center p-8">
        {catalog.cover_image_url ? (
          <img
            src={catalog.cover_image_url}
            alt={catalog.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div
            className="w-full h-full rounded border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-3 opacity-40 group-hover:opacity-60 transition-opacity"
            style={{ backgroundColor: (catalog.color_theme || '#000000') + '22' }}
          >
            <BookOpen className="h-10 w-10 text-katalog-gold" />
            <span className="text-[10px] uppercase tracking-widest font-bold">KAPAK YOK</span>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-katalog-bg-deep/60 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-lg border-white/20 bg-white/10 text-white hover:bg-white hover:text-katalog-bg-deep"
            onClick={(e) => { e.stopPropagation(); router.push(href); }}
          >
            {t('actions.openBuilder') || 'Düzenle'}
          </Button>
        </div>

        <div className="absolute top-4 left-4 z-20">
          <CatalogStatusBadge status={catalog.status} />
        </div>
      </div>

      <div className="p-5 space-y-3">
        <div className="space-y-1">
          <h3 className="font-serif text-lg font-bold leading-tight text-white group-hover:text-katalog-gold transition-colors truncate">{catalog.title}</h3>
          {catalog.brand_name && (
            <p className="text-[11px] uppercase tracking-widest text-katalog-text-dim font-bold truncate">{catalog.brand_name}</p>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-white/5 pt-3">
          <div className="flex items-center gap-3 font-mono text-[10px] text-katalog-text-muted">
            <div className="flex items-center gap-1.5">
              <span className="text-white font-bold">{catalog.page_count}</span>
              <span className="opacity-50 uppercase">{t('table.pages') || 'SAYFA'}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/10" />
            <div className="flex items-center gap-1.5">
              <span className="text-white font-bold">{catalog.product_count || 0}</span>
              <span className="opacity-50 uppercase">{t('table.products') || 'ÜRÜN'}</span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-katalog-text-dim hover:text-white"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-katalog-bg-panel border-white/10">
              <DropdownMenuItem onClick={() => router.push(href)}>
                <Pencil className="mr-2 h-4 w-4" />
                {t('actions.openBuilder') || 'Düzenle'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); duplicateCatalog(catalog.id); }}>
                <Copy className="mr-2 h-4 w-4" />
                {t('actions.duplicate') || 'Kopyala'}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-400 focus:text-red-400 focus:bg-red-400/10" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                {t('actions.delete') || 'Sil'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
