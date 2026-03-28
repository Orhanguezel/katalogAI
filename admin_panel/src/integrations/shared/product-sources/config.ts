// src/integrations/shared/product-sources/config.ts

export const PRODUCT_SOURCES_ADMIN_BASE = '/admin/product-sources';

export const SOURCE_TYPE_OPTIONS = [
  { value: 'database', label: 'Veritabanı' },
  { value: 'import', label: 'İçe Aktarma' },
] as const;
