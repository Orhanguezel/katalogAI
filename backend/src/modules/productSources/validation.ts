// src/modules/productSources/validation.ts

import { z } from 'zod';
import { boolLike, SLUG } from '@/modules/_shared';

/* ── Source CRUD ──────────────────────────────────────────────────── */

export const createProductSourceSchema = z.object({
  name: z.string().min(1).max(100),
  slug: SLUG,
  source_type: z.enum(['database', 'import']).default('database'),
  db_host: z.string().max(255).optional(),
  db_port: z.coerce.number().int().min(1).max(65535).default(3306),
  db_name: z.string().max(100).optional(),
  db_user: z.string().max(100).optional(),
  db_password: z.string().max(500).optional(),
  default_locale: z.string().max(8).default('de'),
  has_subcategories: boolLike.optional(),
  image_base_url: z.string().max(500).optional(),
  is_active: boolLike.optional(),
  connection_limit: z.coerce.number().int().min(1).max(50).default(5),
  brand_title: z.string().max(255).optional(),
  brand_subtitle: z.string().max(500).optional(),
  brand_logo_url: z.string().optional(),
  brand_contact: z.record(z.string(), z.string()).optional(),
});

export const updateProductSourceSchema = createProductSourceSchema.partial();

export const listProductSourcesSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  is_active: boolLike.optional(),
});

/* ── Import products ─────────────────────────────────────────────── */

const importProductItemSchema = z.object({
  external_id: z.string().max(100).optional(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  image_url: z.string().optional(),
  images: z.array(z.string()).optional(),
  price: z.coerce.number().min(0).optional(),
  product_code: z.string().max(64).optional(),
  category_name: z.string().max(255).optional(),
  subcategory_name: z.string().max(255).optional(),
  locale: z.string().max(8).default('de'),
  specs: z.record(z.string(), z.string()).optional(),
  tags: z.array(z.string()).optional(),
  is_active: boolLike.optional(),
});

export const importProductsSchema = z.object({
  products: z.array(importProductItemSchema).min(1).max(500),
});

/* ── Type exports ────────────────────────────────────────────────── */

export type CreateProductSourceInput = z.infer<typeof createProductSourceSchema>;
export type UpdateProductSourceInput = z.infer<typeof updateProductSourceSchema>;
export type ListProductSourcesInput = z.infer<typeof listProductSourcesSchema>;
export type ImportProductsInput = z.infer<typeof importProductsSchema>;
