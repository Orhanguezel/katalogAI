// src/integrations/shared/product-sources/types.ts

export type SourceType = 'database' | 'import';

export interface ProductSourceDto {
  id: string;
  name: string;
  slug: string;
  source_type: SourceType;
  db_host: string | null;
  db_port: number | null;
  db_name: string | null;
  db_user: string | null;
  db_password: string | null;
  default_locale: string;
  has_subcategories: boolean | number;
  image_base_url: string | null;
  is_active: boolean | number;
  connection_limit: number;
  brand_title: string | null;
  brand_subtitle: string | null;
  brand_logo_url: string | null;
  brand_contact: { phone?: string; email?: string; website?: string; address?: string } | null;
  created_at: string;
  updated_at: string;
}

export interface ProductSourceCreatePayload {
  name: string;
  slug: string;
  source_type: SourceType;
  db_host?: string;
  db_port?: number;
  db_name?: string;
  db_user?: string;
  db_password?: string;
  default_locale?: string;
  has_subcategories?: boolean;
  image_base_url?: string;
  is_active?: boolean;
  connection_limit?: number;
}

export interface ProductSourceUpdatePayload {
  name?: string;
  slug?: string;
  db_host?: string;
  db_port?: number;
  db_name?: string;
  db_user?: string;
  db_password?: string;
  default_locale?: string;
  has_subcategories?: boolean;
  image_base_url?: string;
  is_active?: boolean;
  connection_limit?: number;
}

export interface ProductSourceListQueryParams {
  search?: string;
  source_type?: SourceType;
  is_active?: boolean;
}

export interface SourceCategory {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  product_count?: number;
}

export interface SourceProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  image_url: string;
  images: string[];
  price: number | null;
  category_name: string;
  category_id: string;
  specs: Record<string, string>;
  locale: string;
}

export interface SourceProductsQueryParams {
  locale?: string;
  category_id?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface SourceProductsResponse {
  items: SourceProduct[];
  total: number;
  page: number;
  limit: number;
}

export interface SourceCategoriesResponse {
  items: SourceCategory[];
}

export interface ProductSourceTestResult {
  success: boolean;
  error: string | null;
  ok?: boolean;
  message?: string;
  table_count?: number;
}

export interface ProductSourceImportPayload {
  products: Array<{
    title: string;
    slug?: string;
    description?: string;
    image_url?: string;
    images?: string[];
    price?: number;
    category_name?: string;
    specs?: Record<string, string>;
    locale?: string;
  }>;
}

export interface ProductSourceImportResult {
  imported: number;
  skipped: number;
  errors: string[];
}
