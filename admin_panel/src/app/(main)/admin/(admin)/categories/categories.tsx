// =============================================================
// FILE: src/app/(main)/admin/(admin)/categories/categories.tsx
// Admin Categories — List + Create/Edit
// =============================================================

'use client';

import * as React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';

import CategoriesListPanel from './_components/categories-list-panel';

export default function CategoriesPage({ moduleKey }: { moduleKey?: string }) {
  const t = useAdminT('admin.categories');

  return (
    <div className="mx-auto max-w-7xl space-y-8 py-6 px-2">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-white">
            {t('header.title') || 'Kategori Yönetimi'}
          </h1>
          <p className="text-sm text-katalog-text-dim max-w-lg">
            {t('header.description') || 'Ürünlerinizi ve kataloglarınızı organize etmek için hiyerarşik kategori yapısı oluşturun.'}
          </p>
        </div>
      </div>

      <div className="bg-katalog-bg-panel border border-white/5 rounded-2xl overflow-hidden p-6">
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="bg-katalog-bg-card border-none mb-6">
            <TabsTrigger value="list" className="data-[state=active]:bg-katalog-gold data-[state=active]:text-katalog-bg-deep font-bold">
              {t('tabs.list') || 'Kategori Listesi'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-0">
            <CategoriesListPanel initialModuleKey={moduleKey} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
