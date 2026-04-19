// src/modules/catalogs/repository-pages.ts

import { db } from '@/db/client';
import { eq, count, asc } from 'drizzle-orm';
import { catalogPages, catalogs } from './schema';
import type { AddPageInput, UpdatePageInput } from './validation';

/* ── Add page ─────────────────────────────────────────────────────────
 *
 * Sayfa ekleme kuralı:
 *  - layout_type='cover'    → her zaman 1. sayfa (var olan tüm sayfalar +1 push)
 *  - layout_type='backcover'→ her zaman son sayfa (max+1)
 *  - diğerleri              → eğer mevcut son sayfa backcover ise onun yerine
 *                            eklenir, backcover bir sıra ileri itilir; aksi
 *                            takdirde max+1 (sona).
 */
export async function repoAddPage(catalogId: string, data: AddPageInput) {
  const layout = data.layout_type ?? '2x2';
  const allPages = await db
    .select()
    .from(catalogPages)
    .where(eq(catalogPages.catalog_id, catalogId))
    .orderBy(asc(catalogPages.page_number));

  const id = crypto.randomUUID();
  let nextPage: number;

  if (layout === 'cover') {
    nextPage = 1;
    for (const p of allPages) {
      await db
        .update(catalogPages)
        .set({ page_number: p.page_number + 1 })
        .where(eq(catalogPages.id, p.id));
    }
  } else {
    const lastPage = allPages[allPages.length - 1];
    const lastIsBackCover = lastPage?.layout_type === 'backcover';

    if (layout !== 'backcover' && lastIsBackCover && lastPage) {
      nextPage = lastPage.page_number;
      await db
        .update(catalogPages)
        .set({ page_number: lastPage.page_number + 1 })
        .where(eq(catalogPages.id, lastPage.id));
    } else {
      nextPage = (lastPage?.page_number ?? 0) + 1;
    }
  }

  await db.insert(catalogPages).values({
    id,
    catalog_id: catalogId,
    page_number: nextPage,
    layout_type: layout,
    background_color: data.background_color ?? null,
  });

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
