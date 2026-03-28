// =============================================================
// FILE: src/app/(main)/admin/(admin)/catalogs/_components/catalogs-grid.tsx
// Catalogs — Grid View
// =============================================================

'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpenCheck, RefreshCw } from 'lucide-react';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { useListCatalogsAdminQuery } from '@/integrations/hooks';

import CatalogCard from './catalog-card';

export default function CatalogsGrid() {
  const t = useAdminT('admin.catalogs');
  const { data, isLoading } = useListCatalogsAdminQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 bg-katalog-bg-card/50 rounded-3xl border border-white/5">
        <RefreshCw className="h-10 w-10 text-katalog-gold animate-spin" />
        <p className="text-sm text-katalog-text-dim italic">{t('list.loading') || 'Kataloglar yükleniyor...'}</p>
      </div>
    );
  }

  if (!data?.items?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-katalog-bg-card border border-white/5 rounded-3xl shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-katalog-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center mb-2">
            <BookOpenCheck className="h-10 w-10 text-katalog-gold/40" />
          </div>
          <div className="space-y-2 text-center">
            <p className="font-serif text-2xl text-white">{t('list.empty') || 'Henüz katalog oluşturulmamış.'}</p>
            <p className="text-sm text-katalog-text-dim max-w-xs mx-auto">
              Yeni bir katalog oluşturarak ürünlerinizi profesyonel bir tasarımla sunmaya başlayın.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {data.items.map((catalog) => (
        <CatalogCard key={catalog.id} catalog={catalog} />
      ))}
    </div>
  );
}
