// src/integrations/shared/catalogs/config.ts

export const CATALOGS_ADMIN_BASE = '/admin/catalogs';

export const CATALOG_STATUS_OPTIONS = [
  { value: 'draft', label: 'Taslak' },
  { value: 'published', label: 'Yayında' },
  { value: 'archived', label: 'Arşivlenmiş' },
] as const;

export const CATALOG_LOCALE_OPTIONS = [
  { value: 'de', label: 'Deutsch' },
  { value: 'tr', label: 'Türkçe' },
  { value: 'en', label: 'English' },
] as const;
