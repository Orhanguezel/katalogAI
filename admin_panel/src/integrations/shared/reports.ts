// =============================================================
// FILE: src/integrations/shared/reports.ts
// Admin reports DTOs — KatalogAI
// =============================================================

export type ReportRole = 'carrier' | 'customer';

export type KpiRow = {
  period: 'day' | 'week' | 'month' | string;
  bucket: string;
  bookings_total: number;
  delivered_bookings: number;
  cancelled_bookings: number;
  total_revenue: string;
  success_rate: number; // 0..1
};

export type UserPerformanceRow = {
  user_id: string;
  full_name: string | null;
  email: string | null;
  role: ReportRole | string;
  bookings_total: number;
  delivered_bookings: number;
  cancelled_bookings: number;
  total_revenue: string;
  success_rate: number; // 0..1
};

export type LocationRow = {
  from_city: string;
  to_city: string;
  bookings_total: number;
  delivered_bookings: number;
  cancelled_bookings: number;
  total_revenue: string;
  success_rate: number; // 0..1
};
