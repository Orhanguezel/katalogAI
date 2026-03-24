// src/integrations/shared/carriers.ts

export const CARRIERS_ADMIN_BASE = '/admin/carriers';

export interface CarrierListItemDto {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  is_active: boolean;
  email_verified: boolean;
  created_at: string | Date;
  last_sign_in_at: string | Date | null;
  ilan_count: number;
  active_ilan_count: number;
  booking_count: number;
  delivered_booking_count: number;
  rating_avg: number;
  rating_count: number;
  wallet_balance: string;
  wallet_status: string | null;
}

export interface CarrierListItem {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  last_sign_in_at: string | null;
  ilan_count: number;
  active_ilan_count: number;
  booking_count: number;
  delivered_booking_count: number;
  rating_avg: number;
  rating_count: number;
  wallet_balance: string;
  wallet_status: string | null;
}

export interface CarrierListQueryParams {
  search?: string;
  is_active?: boolean;
  has_active_ilan?: boolean;
  limit?: number;
  offset?: number;
}

export interface CarrierDetailIlanDto {
  id: string;
  from_city: string;
  to_city: string;
  departure_date: string | Date;
  status: string;
  available_capacity_kg: string;
  price_per_kg: string;
  currency: string;
  created_at: string | Date;
}

export interface CarrierDetailBookingDto {
  id: string;
  customer_id: string;
  status: string;
  payment_status: string;
  kg_amount: string;
  total_price: string;
  currency: string;
  created_at: string | Date;
  delivered_at: string | Date | null;
}

export interface CarrierDetailRatingDto {
  id: string;
  customer_id: string;
  score: number;
  comment: string | null;
  created_at: string | Date;
}

export interface CarrierDetailStatsDto {
  ilan_count: number;
  active_ilan_count: number;
  booking_count: number;
  delivered_booking_count: number;
  rating_avg: number;
  rating_count: number;
  wallet_balance: string;
  wallet_status: string | null;
  wallet_total_earnings: string;
  wallet_total_withdrawn: string;
  total_transaction_count: number;
}

export interface CarrierDetailDto {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  is_active: boolean;
  email_verified: boolean;
  created_at: string | Date;
  last_sign_in_at: string | Date | null;
  stats: CarrierDetailStatsDto;
  recent_ilanlar: CarrierDetailIlanDto[];
  recent_bookings: CarrierDetailBookingDto[];
  recent_ratings: CarrierDetailRatingDto[];
}

export interface CarrierListResponseDto {
  data: CarrierListItemDto[];
  total: number;
  limit: number;
  offset: number;
}

export interface CarrierListResponse {
  data: CarrierListItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface CarrierDetailIlan {
  id: string;
  from_city: string;
  to_city: string;
  departure_date: string;
  status: string;
  available_capacity_kg: string;
  price_per_kg: string;
  currency: string;
  created_at: string;
}

export interface CarrierDetailBooking {
  id: string;
  customer_id: string;
  status: string;
  payment_status: string;
  kg_amount: string;
  total_price: string;
  currency: string;
  created_at: string;
  delivered_at: string | null;
}

export interface CarrierDetailRating {
  id: string;
  customer_id: string;
  score: number;
  comment: string | null;
  created_at: string;
}

export interface CarrierDetailStats {
  ilan_count: number;
  active_ilan_count: number;
  booking_count: number;
  delivered_booking_count: number;
  rating_avg: number;
  rating_count: number;
  wallet_balance: string;
  wallet_status: string | null;
  wallet_total_earnings: string;
  wallet_total_withdrawn: string;
  total_transaction_count: number;
}

export interface CarrierDetail {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  last_sign_in_at: string | null;
  stats: CarrierDetailStats;
  recent_ilanlar: CarrierDetailIlan[];
  recent_bookings: CarrierDetailBooking[];
  recent_ratings: CarrierDetailRating[];
}

export function normalizeCarrierListItem(dto: CarrierListItemDto): CarrierListItem {
  return {
    ...dto,
    created_at: typeof dto.created_at === 'string' ? dto.created_at : dto.created_at.toISOString(),
    last_sign_in_at:
      typeof dto.last_sign_in_at === 'string'
        ? dto.last_sign_in_at
        : dto.last_sign_in_at?.toISOString?.() ?? null,
    is_active: !!dto.is_active,
    email_verified: !!dto.email_verified,
    ilan_count: Number(dto.ilan_count ?? 0),
    active_ilan_count: Number(dto.active_ilan_count ?? 0),
    booking_count: Number(dto.booking_count ?? 0),
    delivered_booking_count: Number(dto.delivered_booking_count ?? 0),
    rating_avg: Number(dto.rating_avg ?? 0),
    rating_count: Number(dto.rating_count ?? 0),
    wallet_balance: dto.wallet_balance ?? '0.00',
    wallet_status: dto.wallet_status ?? null,
  };
}

export function normalizeCarrierListResponse(dto: CarrierListResponseDto): CarrierListResponse {
  return {
    data: Array.isArray(dto.data) ? dto.data.map(normalizeCarrierListItem) : [],
    total: Number(dto.total ?? 0),
    limit: Number(dto.limit ?? 0),
    offset: Number(dto.offset ?? 0),
  };
}

export function normalizeCarrierDetailIlan(dto: CarrierDetailIlanDto): CarrierDetailIlan {
  return {
    ...dto,
    departure_date:
      typeof dto.departure_date === 'string'
        ? dto.departure_date
        : dto.departure_date.toISOString(),
    created_at:
      typeof dto.created_at === 'string' ? dto.created_at : dto.created_at.toISOString(),
  };
}

export function normalizeCarrierDetailBooking(
  dto: CarrierDetailBookingDto,
): CarrierDetailBooking {
  return {
    ...dto,
    created_at:
      typeof dto.created_at === 'string' ? dto.created_at : dto.created_at.toISOString(),
    delivered_at:
      typeof dto.delivered_at === 'string'
        ? dto.delivered_at
        : dto.delivered_at?.toISOString?.() ?? null,
  };
}

export function normalizeCarrierDetailRating(
  dto: CarrierDetailRatingDto,
): CarrierDetailRating {
  return {
    ...dto,
    score: Number(dto.score ?? 0),
    created_at:
      typeof dto.created_at === 'string' ? dto.created_at : dto.created_at.toISOString(),
  };
}

export function normalizeCarrierDetailStats(
  dto: CarrierDetailStatsDto,
): CarrierDetailStats {
  return {
    ilan_count: Number(dto.ilan_count ?? 0),
    active_ilan_count: Number(dto.active_ilan_count ?? 0),
    booking_count: Number(dto.booking_count ?? 0),
    delivered_booking_count: Number(dto.delivered_booking_count ?? 0),
    rating_avg: Number(dto.rating_avg ?? 0),
    rating_count: Number(dto.rating_count ?? 0),
    wallet_balance: dto.wallet_balance ?? '0.00',
    wallet_status: dto.wallet_status ?? null,
    wallet_total_earnings: dto.wallet_total_earnings ?? '0.00',
    wallet_total_withdrawn: dto.wallet_total_withdrawn ?? '0.00',
    total_transaction_count: Number(dto.total_transaction_count ?? 0),
  };
}

export function normalizeCarrierDetail(dto: CarrierDetailDto): CarrierDetail {
  return {
    id: dto.id,
    email: dto.email,
    full_name: dto.full_name ?? null,
    phone: dto.phone ?? null,
    is_active: !!dto.is_active,
    email_verified: !!dto.email_verified,
    created_at:
      typeof dto.created_at === 'string' ? dto.created_at : dto.created_at.toISOString(),
    last_sign_in_at:
      typeof dto.last_sign_in_at === 'string'
        ? dto.last_sign_in_at
        : dto.last_sign_in_at?.toISOString?.() ?? null,
    stats: normalizeCarrierDetailStats(dto.stats),
    recent_ilanlar: Array.isArray(dto.recent_ilanlar)
      ? dto.recent_ilanlar.map(normalizeCarrierDetailIlan)
      : [],
    recent_bookings: Array.isArray(dto.recent_bookings)
      ? dto.recent_bookings.map(normalizeCarrierDetailBooking)
      : [],
    recent_ratings: Array.isArray(dto.recent_ratings)
      ? dto.recent_ratings.map(normalizeCarrierDetailRating)
      : [],
  };
}
