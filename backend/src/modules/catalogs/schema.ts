// src/modules/catalogs/schema.ts

import {
  mysqlTable,
  char,
  varchar,
  text,
  int,
  datetime,
  decimal,
  json,
  index,
  uniqueIndex,
  foreignKey,
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

/* ── catalogs ────────────────────────────────────────────────────── */

export const catalogs = mysqlTable(
  'catalogs',
  {
    id: char('id', { length: 36 }).primaryKey().notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    status: varchar('status', { length: 20 }).notNull().default('draft'),
    brand_name: varchar('brand_name', { length: 255 }),
    season: varchar('season', { length: 100 }),
    contact_info: json('contact_info').$type<{
      phone?: string;
      email?: string;
      website?: string;
      address?: string;
    }>(),
    logo_url: text('logo_url'),
    cover_image_url: text('cover_image_url'),
    locale: varchar('locale', { length: 8 }).default('de'),
    color_theme: varchar('color_theme', { length: 50 }).default('emerald'),
    font_family: varchar('font_family', { length: 100 }).default('DM Sans'),
    accent_color: varchar('accent_color', { length: 20 }),
    page_count: int('page_count').default(0),
    product_count: int('product_count').default(0),
    created_by: char('created_by', { length: 36 }),
    created_at: datetime('created_at', { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`),
    updated_at: datetime('updated_at', { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .$onUpdateFn(() => new Date()),
  },
  (t) => [
    uniqueIndex('catalogs_slug_uq').on(t.slug),
    index('catalogs_status_idx').on(t.status),
    index('catalogs_created_by_idx').on(t.created_by),
  ],
);

/* ── catalog_pages ───────────────────────────────────────────────── */

export const catalogPages = mysqlTable(
  'catalog_pages',
  {
    id: char('id', { length: 36 }).primaryKey().notNull(),
    catalog_id: char('catalog_id', { length: 36 }).notNull(),
    page_number: int('page_number').notNull(),
    layout_type: varchar('layout_type', { length: 20 }).default('2x2'),
    background_color: varchar('background_color', { length: 20 }),
    created_at: datetime('created_at', { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`),
    updated_at: datetime('updated_at', { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .$onUpdateFn(() => new Date()),
  },
  (t) => [
    uniqueIndex('catalog_pages_catalog_page_uq').on(t.catalog_id, t.page_number),
    index('catalog_pages_catalog_idx').on(t.catalog_id),
    foreignKey({
      columns: [t.catalog_id],
      foreignColumns: [catalogs.id],
      name: 'fk_catalog_pages_catalog',
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
  ],
);

/* ── catalog_page_items ──────────────────────────────────────────── */

export const catalogPageItems = mysqlTable(
  'catalog_page_items',
  {
    id: char('id', { length: 36 }).primaryKey().notNull(),
    page_id: char('page_id', { length: 36 }).notNull(),
    slot_index: int('slot_index').notNull(),
    source_id: char('source_id', { length: 36 }),
    source_product_id: char('source_product_id', { length: 36 }),
    snapshot_title: varchar('snapshot_title', { length: 255 }).notNull(),
    snapshot_description: text('snapshot_description'),
    snapshot_image_url: text('snapshot_image_url'),
    snapshot_images: json('snapshot_images').$type<string[]>(),
    snapshot_price: decimal('snapshot_price', { precision: 10, scale: 2 }),
    snapshot_category_name: varchar('snapshot_category_name', { length: 255 }),
    snapshot_specs: json('snapshot_specs').$type<Record<string, string>>(),
    snapshot_locale: varchar('snapshot_locale', { length: 8 }),
    override_title: varchar('override_title', { length: 255 }),
    override_description: text('override_description'),
    override_image_url: text('override_image_url'),
    override_price: decimal('override_price', { precision: 10, scale: 2 }),
    display_order: int('display_order').default(0),
    created_at: datetime('created_at', { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`),
    updated_at: datetime('updated_at', { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .$onUpdateFn(() => new Date()),
  },
  (t) => [
    index('catalog_page_items_page_idx').on(t.page_id),
    index('catalog_page_items_source_idx').on(t.source_id),
    foreignKey({
      columns: [t.page_id],
      foreignColumns: [catalogPages.id],
      name: 'fk_catalog_page_items_page',
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
  ],
);

/* ── Type exports ────────────────────────────────────────────────── */

export type Catalog = typeof catalogs.$inferSelect;
export type NewCatalog = typeof catalogs.$inferInsert;
export type CatalogPage = typeof catalogPages.$inferSelect;
export type NewCatalogPage = typeof catalogPages.$inferInsert;
export type CatalogPageItem = typeof catalogPageItems.$inferSelect;
export type NewCatalogPageItem = typeof catalogPageItems.$inferInsert;
