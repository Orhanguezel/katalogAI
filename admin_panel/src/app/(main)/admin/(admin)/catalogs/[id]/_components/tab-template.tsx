// =============================================================
// FILE: src/app/(main)/admin/(admin)/catalogs/[id]/_components/tab-template.tsx
// Settings Tab — Template Selection
// =============================================================

'use client';

import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { useCatalogBuilderStore } from '../_store/catalog-builder-store';
import { CATALOG_TEMPLATES } from '../_config/catalog-templates';

export default function TabTemplate() {
  const t = useAdminT('admin.catalogs');
  const { templateId, applyTemplate } = useCatalogBuilderStore();

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">{t('settings.templateWarning')}</p>

      <div className="grid grid-cols-2 gap-2">
        {CATALOG_TEMPLATES.map((tmpl) => (
          <button
            key={tmpl.id}
            type="button"
            onClick={() => applyTemplate(tmpl.id)}
            className={`rounded-lg border-2 p-2 text-left transition-all ${
              templateId === tmpl.id
                ? 'border-primary ring-2 ring-primary/20'
                : 'border-border hover:border-muted-foreground/30'
            }`}
          >
            <div className="flex justify-between items-start mb-1.5">
              <div
                className="w-10 h-14 rounded-md flex items-center justify-center shrink-0"
                style={{ backgroundColor: tmpl.defaults.colorTheme }}
              >
                <span
                  className="text-lg font-bold"
                  style={{
                    color: tmpl.defaults.backgroundColor,
                    fontFamily: tmpl.defaults.headingFont,
                  }}
                >
                  Aa
                </span>
              </div>
              {tmpl.category === 'luxury' && (
                <span className="text-[8px] bg-katalog-gold/20 text-katalog-gold px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider border border-katalog-gold/20">
                  PRO
                </span>
              )}
            </div>
            <p className="text-[10px] font-bold text-white mb-0.5">{t(`templates.${tmpl.id}`) || tmpl.name}</p>
            <p className="text-[9px] text-katalog-text-dim leading-tight">{t(`templates.${tmpl.id}Desc`) || tmpl.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
