import { withQuery } from '@/integrations/shared/api';

export const ILANLAR_ADMIN_BASE = '/admin/ilanlar';

export type IlanStatus = 'active' | 'inactive' | 'pending' | 'cancelled';
export type VehicleType = 'car' | 'van' | 'truck' | 'motorcycle' | 'other';

export interface IlanAdminItem {
  id: string;
  user_id: string;
  carrier_name: string | null;
  from_city: string;
  to_city: string;
  departure_date: string;
  arrival_date: string | null;
  vehicle_type: VehicleType;
  available_kg: number;
  price_per_kg: string;
  min_kg: number | null;
  max_kg: number | null;
  status: IlanStatus;
  phone: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface IlanAdminListResponse {
  data: IlanAdminItem[];
  total: number;
  page: number;
  limit: number;
}

export interface IlanAdminListParams {
  status?: string;
  page?: number;
  user_id?: string;
  from_city?: string;
  to_city?: string;
}

export interface UpdateIlanStatusAdminPayload {
  id: string;
  status: IlanStatus;
}

export const buildIlanlarAdminListUrl = (params: IlanAdminListParams = {}): string =>
  withQuery(ILANLAR_ADMIN_BASE, {
    status: params.status,
    page: params.page && params.page > 1 ? params.page : undefined,
    user_id: params.user_id,
    from_city: params.from_city,
    to_city: params.to_city,
  });
