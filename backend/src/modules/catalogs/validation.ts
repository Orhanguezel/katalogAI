// src/modules/catalogs/validation.ts

import { z } from 'zod';
import { boolLike, SLUG } from '@/modules/_shared';

const ENTITY_ID = z.coerce.string().min(1).max(100);

const contactInfoSchema = z.object({
  phone: z.string().max(50).optional().or(z.literal('')),
  email: z.string().email().max(255).optional().or(z.literal('')),
  website: z.string().max(500).optional().or(z.literal('')),
  address: z.string().max(500).optional().or(z.literal('')),
}).optional();

const statusEnum = z.enum(['draft', 'published', 'archived']);
const layoutEnum = z.enum(['cover', '2x2', '3x2', '2x3', 'featured', 'asymmetric', 'single', 'gallery', 'free', 'backcover']);

/* ── Catalog ─────────────────────────────────────────────────────── */

export const createCatalogSchema = z.object({
  title: z.string().min(1).max(255),
  slug: SLUG.optional(),
  brand_name: z.string().max(255).optional(),
  season: z.string().max(100).optional(),
  contact_info: contactInfoSchema,
  locale: z.string().max(8).optional(),
  color_theme: z.string().max(50).optional(),
  font_family: z.string().max(100).optional(),
  accent_color: z.string().max(20).optional(),
  logo_url: z.string().optional(),
  cover_image_url: z.string().optional(),
  template_id: z.string().max(100).optional(),
  show_prices: boolLike.optional(),
  show_cover: boolLike.optional(),
  show_back_cover: boolLike.optional(),
});

export const updateCatalogSchema = createCatalogSchema.partial();

export const listCatalogsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: statusEnum.optional(),
});

export const updateStatusSchema = z.object({
  status: statusEnum,
});

/* ── Pages ───────────────────────────────────────────────────────── */

export const addPageSchema = z.object({
  layout_type: layoutEnum.default('2x2'),
  background_color: z.string().max(20).optional(),
});

export const updatePageSchema = z.object({
  layout_type: layoutEnum.optional(),
  background_color: z.string().max(20).optional(),
  page_number: z.coerce.number().int().min(1).optional(),
});

export const reorderPagesSchema = z.object({
  pages: z.array(z.object({
    id: ENTITY_ID,
    page_number: z.coerce.number().int().min(1),
  })).min(1),
});

/* ── Items ───────────────────────────────────────────────────────── */

export const addPageItemSchema = z.object({
  source_id: ENTITY_ID.optional().nullable(),
  source_product_id: ENTITY_ID.optional().nullable(),
  slot_index: z.coerce.number().int().min(0),
  snapshot_title: z.string().min(1).max(255),
  snapshot_description: z.string().max(5000).optional(),
  snapshot_image_url: z.string().max(2000).optional(),
  snapshot_images: z.array(z.string().max(2000)).optional(),
  snapshot_price: z.coerce.number().min(0).optional(),
  snapshot_category_name: z.string().max(255).optional(),
  snapshot_specs: z.record(z.string()).optional(),
  snapshot_locale: z.string().max(8).optional(),
});

export const updatePageItemSchema = z.object({
  override_title: z.string().max(255).optional(),
  override_description: z.string().max(5000).optional(),
  override_image_url: z.string().max(2000).optional(),
  override_price: z.coerce.number().min(0).optional(),
});

export const reorderItemsSchema = z.object({
  items: z.array(z.object({
    id: ENTITY_ID,
    display_order: z.coerce.number().int().min(0),
  })).min(1),
});

/* ── Bulk ─────────────────────────────────────────────────────────── */

export const addProductsBulkSchema = z.object({
  products: z.array(z.object({
    source_id: ENTITY_ID.optional().nullable(),
    source_product_id: ENTITY_ID.optional().nullable(),
    snapshot_title: z.string().min(1).max(255),
    snapshot_description: z.string().max(5000).optional(),
    snapshot_image_url: z.string().max(2000).optional(),
    snapshot_images: z.array(z.string().max(2000)).optional(),
    snapshot_price: z.coerce.number().min(0).optional(),
    snapshot_category_name: z.string().max(255).optional(),
    snapshot_specs: z.record(z.string()).optional(),
    snapshot_locale: z.string().max(8).optional(),
  })).min(1),
  layout_type: layoutEnum.optional(),
});

/* ── Type exports ────────────────────────────────────────────────── */

export type CreateCatalogInput = z.infer<typeof createCatalogSchema>;
export type UpdateCatalogInput = z.infer<typeof updateCatalogSchema>;
export type ListCatalogsInput = z.infer<typeof listCatalogsSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type AddPageInput = z.infer<typeof addPageSchema>;
export type UpdatePageInput = z.infer<typeof updatePageSchema>;
export type AddPageItemInput = z.infer<typeof addPageItemSchema>;
export type UpdatePageItemInput = z.infer<typeof updatePageItemSchema>;
export type AddProductsBulkInput = z.infer<typeof addProductsBulkSchema>;
