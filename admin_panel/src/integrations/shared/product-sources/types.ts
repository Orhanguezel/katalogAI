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
  /** @deprecated Marka bilgileri artık kaynak DB'sinin site_settings tablosundan anlık çekilir. */
  brand_title: string | null;
  /** @deprecated Bkz. brand-info endpoint. */
  brand_subtitle: string | null;
  /** @deprecated Bkz. brand-info endpoint. */
  brand_logo_url: string | null;
  /** @deprecated Bkz. brand-info endpoint. */
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

/* ── Brand-info (anlık marka bilgisi) ────────────────────────────── */

export interface ProductSourceBrandLogo {
  logo_url: string | null;
  logo_alt: string | null;
  favicon_url: string | null;
  apple_touch_icon_url: string | null;
}

export interface ProductSourceBrandContact {
  companyName: string | null;
  shortName: string | null;
  phones: string[];
  whatsappNumber: string | null;
  email: string | null;
  address: string | null;
  addressSecondary: string | null;
  website: string | null;
  taxNumber: string | null;
  taxOffice: string | null;
}

export interface ProductSourceBrandSocials {
  instagram: string | null;
  facebook: string | null;
  x: string | null;
  youtube: string | null;
  linkedin: string | null;
  tiktok: string | null;
}

export interface ProductSourceBrandProfile {
  headline: string | null;
  subline: string | null;
  body: string | null;
}

export interface ProductSourceBrandInfo {
  locale: string;
  site_title: string | null;
  logo: ProductSourceBrandLogo;
  contact: ProductSourceBrandContact;
  socials: ProductSourceBrandSocials;
  profile: ProductSourceBrandProfile;
}

export interface ProductSourceBrandInfoQueryParams {
  id: string;
  locale?: string;
}
