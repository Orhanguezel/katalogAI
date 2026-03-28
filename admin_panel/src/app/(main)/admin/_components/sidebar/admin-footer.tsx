'use client';

import { useAdminUiCopy } from '@/app/(main)/admin/_components/common/use-admin-ui-copy';
import { useAdminSettings } from '../admin-settings-provider';
import { useStatusQuery } from '@/integrations/hooks';
import { normalizeMeFromStatus } from '@/integrations/shared';

function withPanelTitle(appNameRaw: string, isAdmin: boolean): string {
  const panelTitle = isAdmin ? 'Admin Panel' : 'Admin Panel';
  const cleaned = appNameRaw
    .replace(/\badmin\s*panel\b/gi, '')
    .replace(/\badmin panel\b/gi, '')
    .trim();
  return cleaned ? `${cleaned} ${panelTitle}` : panelTitle;
}

export function AdminFooter() {
  const { copy } = useAdminUiCopy();
  const { branding } = useAdminSettings();
  const statusQ = useStatusQuery();
  const me = normalizeMeFromStatus(statusQ.data as any);
  const isAdmin = me?.isAdmin === true;
  const appNameRaw = copy.app_name || branding?.app_name || '';
  const appName = withPanelTitle(appNameRaw, isAdmin);
  const appVersion = copy.app_version || '';
  const copyright = branding?.app_copyright || '';

  return (
    <footer className="mt-auto border-t border-white/5 py-8 px-10 bg-katalog-bg-deep/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px] uppercase tracking-[0.2em] font-bold">
        <div className="flex items-center gap-4">
          <span className="font-serif text-white tracking-normal normal-case text-base font-bold italic">{appName}</span>
          <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
          <span className="text-katalog-gold opacity-50 font-mono tracking-widest">{appVersion || 'v1.0.0'}</span>
        </div>

        <div className="flex items-center gap-6">
          {copyright ? <div className="text-white/30 italic font-medium tracking-normal normal-case">{copyright}</div> : null}
          <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
          <div className="text-white/20">PREMIUM EDITION</div>
        </div>
      </div>
    </footer>
  );
}
