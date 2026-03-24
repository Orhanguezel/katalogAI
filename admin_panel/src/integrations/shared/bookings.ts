export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in_transit'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface BookingAdminItem {
  id: string;
  ilan_id: string;
  customer_id: string;
  carrier_id: string;
  customer_name: string | null;
  from_city: string | null;
  to_city: string | null;
  kg: number;
  total_price: string;
  status: BookingStatus;
  payment_status: 'unpaid' | 'paid' | 'refunded';
  customer_notes: string | null;
  carrier_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookingAdminListResponse {
  data: BookingAdminItem[];
  total: number;
  page: number;
  limit: number;
}

export interface BookingAdminListParams {
  status?: string;
  page?: number;
  customer_id?: string;
  carrier_id?: string;
}

export interface UpdateBookingStatusAdminPayload {
  id: string;
  status: BookingStatus;
  carrier_notes?: string;
}
