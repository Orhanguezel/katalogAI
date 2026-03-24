import type { IlanStatus } from '@/integrations/shared/ilanlar';
import type { VariantProps } from 'class-variance-authority';
import type { badgeVariants } from '@/components/ui/badge';

export const ADMIN_ILANLAR_EMPTY_VALUE = '—';
export const ADMIN_ILANLAR_ROUTE_SEPARATOR = ' → ';

export function getAdminIlanStatusVariant(
  status: IlanStatus,
): VariantProps<typeof badgeVariants>['variant'] {
  if (status === 'active') return 'default';
  if (status === 'inactive') return 'secondary';
  if (status === 'pending') return 'outline';
  return 'destructive';
}

export function formatAdminIlanDate(iso: string) {
  return new Date(iso).toLocaleDateString('tr-TR');
}

export function formatAdminIlanWeight(kg: number) {
  return `${kg} kg`;
}

export function formatAdminIlanPrice(amount: number | string) {
  return `₺${amount}`;
}

export function getAdminIlanRouteLabel(fromCity: string, toCity: string) {
  return `${fromCity}${ADMIN_ILANLAR_ROUTE_SEPARATOR}${toCity}`;
}
