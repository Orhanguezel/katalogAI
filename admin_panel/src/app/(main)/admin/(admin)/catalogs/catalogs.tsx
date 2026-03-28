// =============================================================
// FILE: src/app/(main)/admin/(admin)/catalogs/catalogs.tsx
// Admin Catalogs — Grid List + Create
// =============================================================

'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';

import CatalogsGrid from './_components/catalogs-grid';
import CatalogCreateDialog from './_components/catalog-create-dialog';
import { CATALOG_TEMPLATES } from './[id]/_config/catalog-templates';

export default function CatalogsPage() {
  const t = useAdminT('admin.catalogs');
  const [showCreate, setShowCreate] = React.useState(false);

  return (
    <div className="mx-auto max-w-7xl space-y-8 py-6">
      <div className="flex items-center justify-between px-2">
        <div className="space-y-1">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-white">
            {t('header.title') || 'Kataloglarım'}
          </h1>
          <p className="text-sm text-katalog-text-dim max-w-md">
            {t('header.description') || 'Tüm ürün kataloglarınızı buradan yönetebilir veya yeni tasarımlar oluşturabilirsiniz.'}
          </p>
        </div>
        <Button 
          size="lg" 
          onClick={() => setShowCreate(true)}
          className="rounded-xl bg-katalog-gold px-6 font-bold text-katalog-bg-deep shadow-[0_8px_30px_rgba(194,157,93,0.15)] hover:bg-katalog-gold-light hover:shadow-[0_12px_40px_rgba(194,157,93,0.25)] transition-all"
        >
          <Plus className="mr-2 h-5 w-5" />
          {t('actions.create') || 'Yeni Katalog Oluştur'}
        </Button>
      </div>

      <div className="px-2">
        <div className="mb-6 rounded-[28px] border border-white/5 bg-katalog-bg-card/70 p-5 shadow-2xl">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl text-white">
                {t('showcase.title') || 'Örnek Katalog Şablonları'}
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-katalog-text-dim">
                {t('showcase.description') || 'catalog-editor.html referansındaki düzen mantığına uygun hazır şablonlardan birini seçip yeni katalog başlatabilirsiniz.'}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowCreate(true)}
              className="hidden rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 lg:inline-flex"
            >
              {t('showcase.cta') || 'Şablondan Başla'}
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {CATALOG_TEMPLATES.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => setShowCreate(true)}
                className="group overflow-hidden rounded-2xl border border-white/5 bg-katalog-bg-panel text-left transition-all duration-300 hover:-translate-y-1 hover:border-katalog-gold/30 hover:shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
              >
                <div
                  className="relative aspect-[4/3] overflow-hidden border-b border-white/5 p-6"
                  style={{ background: `linear-gradient(135deg, ${template.defaults.backgroundColor} 0%, ${template.defaults.colorTheme}22 100%)` }}
                >
                  <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(194,157,93,0.14) 1px, transparent 0)', backgroundSize: '18px 18px' }} />
                  <div className="relative mx-auto flex h-full max-w-[220px] flex-col rounded-md bg-white p-4 shadow-2xl">
                    <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                      <div>
                        <div className="font-serif text-xl" style={{ color: template.defaults.colorTheme }}>
                          {template.name}
                        </div>
                        <div className="mt-1 text-[9px] uppercase tracking-[0.28em] text-slate-400">
                          KatalogAI Template
                        </div>
                      </div>
                      <div className="text-right text-[9px] uppercase text-slate-400">
                        <div>Page 01</div>
                        <div>{template.defaults.layoutPreset}</div>
                      </div>
                    </div>
                    <div className="mt-4 grid flex-1 grid-cols-2 gap-3">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="rounded-sm border border-dashed border-slate-200 bg-slate-50/70" />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-serif text-lg text-white transition-colors group-hover:text-katalog-gold">
                      {t(`templates.${template.id}`) || template.name}
                    </h3>
                    <span className="rounded-full border border-katalog-gold/20 bg-katalog-gold/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-katalog-gold">
                      {template.defaults.layoutPreset}
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-katalog-text-dim">
                    {t(`templates.${template.id}Desc`) || template.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <CatalogsGrid />
      </div>

      <CatalogCreateDialog
        open={showCreate}
        onOpenChange={setShowCreate}
      />
    </div>
  );
}
