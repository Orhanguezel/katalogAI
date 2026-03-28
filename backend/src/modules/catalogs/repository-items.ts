// src/modules/catalogs/repository-items.ts

import { db } from '@/db/client';
import { eq, sql, count } from 'drizzle-orm';
import { catalogPageItems, catalogPages, catalogs } from './schema';
import type { AddPageItemInput, UpdatePageItemInput } from './validation';

/* ── Add item ────────────────────────────────────────────────────── */

export async function repoAddPageItem(pageId: string, data: AddPageItemInput) {
  const id = crypto.randomUUID();

  await db.insert(catalogPageItems).values({
    id,
    page_id: pageId,
    slot_index: data.slot_index,
    source_id: data.source_id,
    source_product_id: data.source_product_id,
    snapshot_title: data.snapshot_title,
    snapshot_description: data.snapshot_description ?? null,
    snapshot_image_url: data.snapshot_image_url ?? null,
    snapshot_images: data.snapshot_images ?? null,
    snapshot_price: data.snapshot_price?.toString() ?? null,
    snapshot_category_name: data.snapshot_category_name ?? null,
    snapshot_specs: data.snapshot_specs ?? null,
    snapshot_locale: data.snapshot_locale ?? null,
  });

  // update product_count on catalog
  const [page] = await db.select().from(catalogPages).where(eq(catalogPages.id, pageId)).limit(1);
  if (page) {
    await repoRecalcProductCount(page.catalog_id);
  }

  return { id };
}

/* ── Update item ─────────────────────────────────────────────────── */

export async function repoUpdatePageItem(itemId: string, data: UpdatePageItemInput) {
  const set: Record<string, unknown> = {};
  if (data.override_title !== undefined) set.override_title = data.override_title;
  if (data.override_description !== undefined) set.override_description = data.override_description;
  if (data.override_image_url !== undefined) set.override_image_url = data.override_image_url;
  if (data.override_price !== undefined) set.override_price = data.override_price?.toString();

  if (Object.keys(set).length) {
    await db.update(catalogPageItems).set(set).where(eq(catalogPageItems.id, itemId));
  }
}

/* ── Delete item ─────────────────────────────────────────────────── */

export async function repoDeletePageItem(itemId: string) {
  const [item] = await db
    .select({ page_id: catalogPageItems.page_id })
    .from(catalogPageItems)
    .where(eq(catalogPageItems.id, itemId))
    .limit(1);

  await db.delete(catalogPageItems).where(eq(catalogPageItems.id, itemId));

  if (item) {
    const [page] = await db.select().from(catalogPages).where(eq(catalogPages.id, item.page_id)).limit(1);
    if (page) {
      await repoRecalcProductCount(page.catalog_id);
    }
  }

  return { ok: true };
}

/* ── Reorder items ───────────────────────────────────────────────── */

export async function repoReorderItems(
  _pageId: string,
  items: { id: string; display_order: number }[],
) {
  for (const item of items) {
    await db
      .update(catalogPageItems)
      .set({ display_order: item.display_order })
      .where(eq(catalogPageItems.id, item.id));
  }
}

/* ── Get item by id (helper) ─────────────────────────────────────── */

export async function repoGetPageItemById(itemId: string) {
  const [row] = await db
    .select()
    .from(catalogPageItems)
    .where(eq(catalogPageItems.id, itemId))
    .limit(1);
  return row ?? null;
}

/* ── Recalc product count ────────────────────────────────────────── */

async function repoRecalcProductCount(catalogId: string) {
  const [result] = await db
    .select({ total: count() })
    .from(catalogPageItems)
    .where(
      sql`${catalogPageItems.page_id} IN (
        SELECT ${catalogPages.id} FROM ${catalogPages}
        WHERE ${catalogPages.catalog_id} = ${catalogId}
      )`,
    );

  await db
    .update(catalogs)
    .set({ product_count: result?.total ?? 0 })
    .where(eq(catalogs.id, catalogId));
}
