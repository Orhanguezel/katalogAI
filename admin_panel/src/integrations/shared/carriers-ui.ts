import type { CarrierListItem, CarrierListQueryParams } from '@/integrations/shared/carriers';

type AdminCarrierIdentity = Pick<CarrierListItem, 'full_name' | 'email'>;

export type AdminCarriersActiveFilter = 'all' | 'active' | 'inactive';
export type AdminCarriersHasIlanFilter = 'all' | 'yes' | 'no';

export type AdminCarriersFilters = {
  search: string;
  isActive: AdminCarriersActiveFilter;
  hasActiveIlan: AdminCarriersHasIlanFilter;
};

export const ADMIN_CARRIERS_DEFAULT_FILTERS: AdminCarriersFilters = {
  search: '',
  isActive: 'all',
  hasActiveIlan: 'all',
};

export const ADMIN_CARRIERS_RECENT_LIMIT = 5;

export const ADMIN_CARRIERS_ACTIVE_OPTIONS = [
  { value: 'all', labelKey: 'all' },
  { value: 'active', labelKey: 'active' },
  { value: 'inactive', labelKey: 'inactive' },
] as const;

export const ADMIN_CARRIERS_ACTIVE_ILAN_OPTIONS = [
  { value: 'all', labelKey: 'all' },
  { value: 'yes', labelKey: 'yes' },
  { value: 'no', labelKey: 'no' },
] as const;

export function buildAdminCarriersListParams(
  filters: AdminCarriersFilters,
): CarrierListQueryParams {
  return {
    search: filters.search.trim() || undefined,
    is_active:
      filters.isActive === 'all' ? undefined : filters.isActive === 'active',
    has_active_ilan:
      filters.hasActiveIlan === 'all' ? undefined : filters.hasActiveIlan === 'yes',
    limit: 100,
    offset: 0,
  };
}

export function getAdminCarrierDisplayName(item: AdminCarrierIdentity): string {
  return item.full_name?.trim() || item.email;
}

export function buildAdminCarrierDetailHref(id: string): string {
  return `/admin/carriers/${id}`;
}

export function formatAdminCarrierDate(value: string | null): string {
  if (!value) return '-';
  return value.slice(0, 10);
}

export function formatAdminCarrierRating(value: number): string {
  return Number.isFinite(value) ? value.toFixed(1) : '0.0';
}

export function formatAdminCarrierMoney(
  value: string | number,
  currency = 'TRY',
): string {
  const amount =
    typeof value === 'number' ? value : Number.parseFloat(value || '0');
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeAmount);
}

export function getAdminCarrierStatusKey(value: boolean): 'active' | 'inactive' {
  return value ? 'active' : 'inactive';
}

export function getAdminCarrierWalletStatusKey(
  value: string | null,
): 'active' | 'suspended' | 'closed' | 'unknown' {
  if (value === 'active') return 'active';
  if (value === 'suspended') return 'suspended';
  if (value === 'closed') return 'closed';
  return 'unknown';
}
