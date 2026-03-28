// src/modules/productSources/schema.ts

import {
  mysqlTable,
  char,
  varchar,
  text,
  tinyint,
  int,
  decimal,
  datetime,
  json,
  index,
  uniqueIndex,
  foreignKey,
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

/* ── product_sources ─────────────────────────────────────────────── */

export const productSources = mysqlTable(
  'product_sources',
  {
    id: char('id', { length: 36 }).primaryKey().notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    slug: varchar('slug', { length: 100 }).notNull(),
    source_type: varchar('source_type', { length: 20 }).notNull().default('database'),
    db_host: varchar('db_host', { length: 255 }),
    db_port: int('db_port').default(3306),
    db_name: varchar('db_name', { length: 100 }),
    db_user: varchar('db_user', { length: 100 }),
    db_password: varchar('db_password', { length: 500 }),
    default_locale: varchar('default_locale', { length: 8 }).default('de'),
    has_subcategories: tinyint('has_subcategories').default(0),
    image_base_url: varchar('image_base_url', { length: 500 }),
    is_active: tinyint('is_active').default(1),
    connection_limit: int('connection_limit').default(5),
    brand_title: varchar('brand_title', { length: 255 }),
    brand_subtitle: varchar('brand_subtitle', { length: 500 }),
    brand_logo_url: text('brand_logo_url'),
    brand_contact: json('brand_contact').$type<{
      phone?: string;
      email?: string;
      website?: string;
      address?: string;
    }>(),
    created_at: datetime('created_at', { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`),
    updated_at: datetime('updated_at', { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .$onUpdateFn(() => new Date()),
  },
  (t) => [
    uniqueIndex('product_sources_slug_uq').on(t.slug),
    index('product_sources_active_idx').on(t.is_active),
  ],
);

/* ── source_products ─────────────────────────────────────────────── */

export const sourceProducts = mysqlTable(
  'source_products',
  {
    id: char('id', { length: 36 }).primaryKey().notNull(),
    source_id: char('source_id', { length: 36 }).notNull(),
    external_id: varchar('external_id', { length: 100 }),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    image_url: text('image_url'),
    images: json('images').$type<string[]>(),
    price: decimal('price', { precision: 10, scale: 2 }),
    product_code: varchar('product_code', { length: 64 }),
    category_name: varchar('category_name', { length: 255 }),
    subcategory_name: varchar('subcategory_name', { length: 255 }),
    locale: varchar('locale', { length: 8 }).default('de'),
    specs: json('specs').$type<Record<string, string>>(),
    tags: json('tags').$type<string[]>(),
    is_active: tinyint('is_active').default(1),
    created_at: datetime('created_at', { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`),
    updated_at: datetime('updated_at', { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .$onUpdateFn(() => new Date()),
  },
  (t) => [
    index('source_products_source_idx').on(t.source_id),
    index('source_products_external_idx').on(t.source_id, t.external_id),
    index('source_products_active_idx').on(t.is_active),
    foreignKey({
      columns: [t.source_id],
      foreignColumns: [productSources.id],
      name: 'fk_source_products_source',
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
  ],
);

/* ── Type exports ────────────────────────────────────────────────── */

export type ProductSource = typeof productSources.$inferSelect;
export type NewProductSource = typeof productSources.$inferInsert;
export type SourceProduct = typeof sourceProducts.$inferSelect;
export type NewSourceProduct = typeof sourceProducts.$inferInsert;
