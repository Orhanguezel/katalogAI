// src/integrations/shared/catalogs/types.ts

export type CatalogStatus = 'draft' | 'published' | 'archived';

export type LayoutType =
  | 'cover'
  | '2x2'
  | '3x2'
  | '2x3'
  | 'featured'
  | 'asymmetric'
  | 'single'
  | 'gallery'
  | 'free'
  | 'backcover';

export interface CatalogDto {
  id: string;
  title: string;
  slug: string;
  status: CatalogStatus;
  brand_name: string;
  season: string;
  contact_info: Record<string, string>;
  logo_url: string;
  cover_image_url: string;
  locale: string;
  color_theme: string;
  font_family: string;
  accent_color: string;
  show_prices: boolean | number;
  page_count: number;
  product_count: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CatalogPageDto {
  id: string;
  catalog_id: string;
  page_number: number;
  layout_type: LayoutType;
  background_color: string;
  created_at: string;
  updated_at: string;
  items: CatalogPageItemDto[];
}

export interface CatalogPageItemDto {
  id: string;
  page_id: string;
  slot_index: number;
  source_id: string | null;
  source_product_id: string | null;
  snapshot_title: string;
  snapshot_description: string;
  snapshot_image_url: string;
  snapshot_images: string[];
  snapshot_price: number | null;
  snapshot_category_name: string;
  snapshot_specs: Record<string, string>;
  snapshot_locale: string;
  override_title: string | null;
  override_description: string | null;
  override_image_url: string | null;
  override_price: number | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CatalogFullDto extends CatalogDto {
  pages: CatalogPageDto[];
}

export interface CatalogCreatePayload {
  title: string;
  slug?: string;
  brand_name?: string;
  season?: string;
  contact_info?: Record<string, string>;
  logo_url?: string;
  cover_image_url?: string;
  locale?: string;
  color_theme?: string;
  font_family?: string;
  accent_color?: string;
  template_id?: string;
  show_prices?: boolean;
}

export interface CatalogUpdatePayload {
  title?: string;
  slug?: string;
  status?: CatalogStatus;
  brand_name?: string;
  season?: string;
  contact_info?: Record<string, string>;
  logo_url?: string;
  cover_image_url?: string;
  locale?: string;
  color_theme?: string;
  font_family?: string;
  accent_color?: string;
  show_prices?: boolean;
}

export interface CatalogListQueryParams {
  search?: string;
  status?: CatalogStatus;
  page?: number;
  limit?: number;
}

export interface CatalogListResponse {
  items: CatalogDto[];
  total: number;
  page: number;
  limit: number;
}

export interface CatalogPageCreatePayload {
  layout_type?: LayoutType;
  background_color?: string;
  page_number?: number;
}

export interface CatalogPageUpdatePayload {
  layout_type?: LayoutType;
  background_color?: string;
}

export interface CatalogPageReorderPayload {
  page_ids: string[];
}

export interface CatalogPageItemCreatePayload {
  slot_index: number;
  source_id?: string | null;
  source_product_id?: string | null;
  snapshot_title: string;
  snapshot_description?: string;
  snapshot_image_url?: string;
  snapshot_images?: string[];
  snapshot_price?: number;
  snapshot_category_name?: string;
  snapshot_specs?: Record<string, string>;
  snapshot_locale?: string;
}

export interface CatalogPageItemUpdatePayload {
  override_title?: string | null;
  override_description?: string | null;
  override_image_url?: string | null;
  override_price?: number | null;
  display_order?: number;
}

export interface CatalogBulkAddPayload {
  source_id?: string | null;
  product_ids: string[];
  layout_type?: LayoutType;
}

export interface CatalogStatusPayload {
  status: CatalogStatus;
}

export interface CatalogSendEmailPayload {
  to: string;
  subject: string;
  message?: string;
}
