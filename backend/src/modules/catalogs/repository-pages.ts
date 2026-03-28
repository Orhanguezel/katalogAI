// src/modules/catalogs/repository-pages.ts

import { db } from '@/db/client';
import { eq, sql, count } from 'drizzle-orm';
import { catalogPages, catalogPageItems, catalogs } from './schema';
import type { AddPageInput, UpdatePageInput } from './validation';

/* ── Add page ────────────────────────────────────────────────────── */

export async function repoAddPage(catalogId: string, data: AddPageInput) {
  const [maxRow] = await db
    .select({ maxPage: sql<number>`COALESCE(MAX(${catalogPages.page_number}), 0)` })
    .from(catalogPages)
    .where(eq(catalogPages.catalog_id, catalogId));

  const nextPage = (maxRow?.maxPage ?? 0) + 1;
  const id = crypto.randomUUID();

  await db.insert(catalogPages).values({
    id,
    catalog_id: catalogId,
    page_number: nextPage,
    layout_type: data.layout_type ?? '2x2',
    background_color: data.background_color ?? null,
  });

  // update page_count
  const [countRow] = await db
    .select({ total: count() })
    .from(catalogPages)
    .where(eq(catalogPages.catalog_id, catalogId));

  await db.update(catalogs).set({ page_count: countRow?.total ?? 0 }).where(eq(catalogs.id, catalogId));

  return { id, page_number: nextPage };
}

/* ── Update page ─────────────────────────────────────────────────── */

export async function repoUpdatePage(pageId: string, data: UpdatePageInput) {
  const set: Record<string, unknown> = {};
  if (data.layout_type !== undefined) set.layout_type = data.layout_type;
  if (data.background_color !== undefined) set.background_color = data.background_color;
  if (data.page_number !== undefined) set.page_number = data.page_number;

  if (Object.keys(set).length) {
    await db.update(catalogPages).set(set).where(eq(catalogPages.id, pageId));
  }
}

/* ── Delete page ─────────────────────────────────────────────────── */

export async function repoDeletePage(pageId: string) {
  const [page] = await db.select().from(catalogPages).where(eq(catalogPages.id, pageId)).limit(1);
  if (!page) return null;

  await db.delete(catalogPages).where(eq(catalogPages.id, pageId));

  // update page_count
  const [countRow] = await db
    .select({ total: count() })
    .from(catalogPages)
    .where(eq(catalogPages.catalog_id, page.catalog_id));

  await db.update(catalogs).set({ page_count: countRow?.total ?? 0 }).where(eq(catalogs.id, page.catalog_id));

  return { catalog_id: page.catalog_id };
}

/* ── Reorder pages ───────────────────────────────────────────────── */

export async function repoReorderPages(
  _catalogId: string,
  pages: { id: string; page_number: number }[],
) {
  for (const p of pages) {
    await db
      .update(catalogPages)
      .set({ page_number: p.page_number })
      .where(eq(catalogPages.id, p.id));
  }
}

/* ── Get page by id (helper) ─────────────────────────────────────── */

export async function repoGetPageById(pageId: string) {
  const [row] = await db.select().from(catalogPages).where(eq(catalogPages.id, pageId)).limit(1);
  return row ?? null;
}
