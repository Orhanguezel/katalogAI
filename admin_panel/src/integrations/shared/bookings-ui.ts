import type { BookingStatus } from '@/integrations/shared/bookings';
import type { VariantProps } from 'class-variance-authority';
import type { badgeVariants } from '@/components/ui/badge';

export const ADMIN_BOOKINGS_EMPTY_VALUE = '—';
export const ADMIN_BOOKINGS_UNKNOWN_CITY = '?';
export const ADMIN_BOOKINGS_ROUTE_SEPARATOR = ' → ';

export function getAdminBookingStatusVariant(
  status: BookingStatus,
): VariantProps<typeof badgeVariants>['variant'] {
  if (status === 'pending') return 'secondary';
  if (status === 'confirmed') return 'default';
  if (status === 'in_transit') return 'default';
  if (status === 'delivered') return 'outline';
  return 'destructive';
}

export function formatAdminBookingDate(iso: string) {
  return new Date(iso).toLocaleDateString('tr-TR');
}

export function formatAdminBookingWeight(kg: number) {
  return `${kg} kg`;
}

export function formatAdminBookingPrice(amount: number | string) {
  return `₺${amount}`;
}

export function getAdminBookingRouteLabel(fromCity?: string | null, toCity?: string | null) {
  return `${fromCity ?? ADMIN_BOOKINGS_UNKNOWN_CITY}${ADMIN_BOOKINGS_ROUTE_SEPARATOR}${toCity ?? ADMIN_BOOKINGS_UNKNOWN_CITY}`;
}
