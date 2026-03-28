// =============================================================
// FILE: src/app/(main)/admin/(admin)/product-sources/product-sources.tsx
// Admin Product Sources — List + CRUD
// =============================================================

'use client';

import * as React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';

import ProductSourcesList from './_components/product-sources-list';

export default function ProductSourcesPage() {
  const t = useAdminT('admin.productSources');

  return (
    <div className="mx-auto max-w-7xl space-y-8 py-6 px-2">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-white">
            {t('header.title') || 'Veri Kaynakları'}
          </h1>
          <p className="text-sm text-katalog-text-dim max-w-md">
            {t('header.description') || 'Ürün verilerinin çekileceği MySQL veritabanlarını veya API kaynaklarını buradan yönetin.'}
          </p>
        </div>
      </div>

      <div className="bg-katalog-bg-panel border border-white/5 rounded-2xl overflow-hidden p-6">
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="bg-katalog-bg-card border-none mb-6">
            <TabsTrigger value="list" className="data-[state=active]:bg-katalog-gold data-[state=active]:text-katalog-bg-deep font-bold">
              {t('tabs.list') || 'Kaynak Listesi'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-0">
            <ProductSourcesList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
