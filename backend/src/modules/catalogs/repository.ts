// src/modules/catalogs/repository.ts

import { db } from '@/db/client';
import { eq, desc, sql, count } from 'drizzle-orm';
import { catalogs, catalogPages, catalogPageItems } from './schema';
import type { CreateCatalogInput, UpdateCatalogInput } from './validation';
import { toBool } from '@/modules/_shared';

type ListParams = { page: number; limit: number; offset: number; status?: string };

function toCatalogSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 240) || `catalog-${Date.now()}`;
}

export async function repoListCatalogs(params: ListParams) {
  const where = params.status ? eq(catalogs.status, params.status) : undefined;
  const [rows, total] = await Promise.all([
    db.select().from(catalogs).where(where).orderBy(desc(catalogs.created_at)).limit(params.limit).offset(params.offset),
    db.select({ total: count() }).from(catalogs).where(where),
  ]);
  return { rows, total: total[0]?.total ?? 0 };
}

export async function repoGetCatalogById(id: string) {
  const [row] = await db.select().from(catalogs).where(eq(catalogs.id, id)).limit(1);
  return row ?? null;
}

export async function repoGetCatalogFull(id: string) {
  const catalog = await repoGetCatalogById(id);
  if (!catalog) return null;

  const pages = await db
    .select()
    .from(catalogPages)
    .where(eq(catalogPages.catalog_id, id))
    .orderBy(catalogPages.page_number);

  const pageIds = pages.map((p) => p.id);
  let items: (typeof catalogPageItems.$inferSelect)[] = [];

  if (pageIds.length) {
    items = await db
      .select()
      .from(catalogPageItems)
      .where(sql`${catalogPageItems.page_id} IN (${sql.join(pageIds.map((pid) => sql`${pid}`), sql`, `)})`)
      .orderBy(catalogPageItems.display_order);
  }

  const pagesWithItems = pages.map((page) => ({
    ...page,
    items: items.filter((item) => item.page_id === page.id),
  }));

  return { ...catalog, pages: pagesWithItems };
}

export async function repoCreateCatalog(data: CreateCatalogInput, userId: string) {
  const id = crypto.randomUUID();
  const slug = data.slug ?? `${toCatalogSlug(data.title)}-${Date.now()}`;

  await db.insert(catalogs).values({
    id,
    title: data.title,
    slug,
    target_source_id: data.target_source_id ?? null,
    brand_name: data.brand_name ?? null,
    season: data.season ?? null,
    contact_info: data.contact_info ?? null,
    locale: data.locale ?? 'tr',
    color_theme: data.color_theme ?? '#2d6a4f',
    font_family: data.font_family ?? 'Cormorant Garamond',
    accent_color: data.accent_color ?? '#c29d5d',
    logo_url: (data as Record<string, unknown>).logo_url as string ?? null,
    cover_image_url: (data as Record<string, unknown>).cover_image_url as string ?? null,
    show_prices: data.show_prices !== undefined ? (toBool(data.show_prices) ? 1 : 0) : 0,
    show_cover: data.show_cover !== undefined ? (toBool(data.show_cover) ? 1 : 0) : 1,
    show_back_cover: data.show_back_cover !== undefined ? (toBool(data.show_back_cover) ? 1 : 0) : 1,
    created_by: userId,
    page_count: 3,
  });

  // Otomatik kapak + icerik + arka kapak olustur
  await db.insert(catalogPages).values([
    { id: crypto.randomUUID(), catalog_id: id, page_number: 1, layout_type: 'cover' },
    { id: crypto.randomUUID(), catalog_id: id, page_number: 2, layout_type: '2x2' },
    { id: crypto.randomUUID(), catalog_id: id, page_number: 3, layout_type: 'backcover' },
  ]);

  return { id };
}

export async function repoUpdateCatalog(id: string, data: UpdateCatalogInput) {
  const set: Record<string, unknown> = {};
  if (data.title !== undefined) set.title = data.title;
  if (data.slug !== undefined) set.slug = data.slug;
  if (data.target_source_id !== undefined) set.target_source_id = data.target_source_id;
  if (data.brand_name !== undefined) set.brand_name = data.brand_name;
  if (data.season !== undefined) set.season = data.season;
  if (data.contact_info !== undefined) set.contact_info = data.contact_info;
  if (data.locale !== undefined) set.locale = data.locale;
  if (data.color_theme !== undefined) set.color_theme = data.color_theme;
  if (data.font_family !== undefined) set.font_family = data.font_family;
  if (data.accent_color !== undefined) set.accent_color = data.accent_color;
  if (data.logo_url !== undefined) set.logo_url = data.logo_url;
  if (data.cover_image_url !== undefined) set.cover_image_url = data.cover_image_url;
  if (data.show_prices !== undefined) set.show_prices = toBool(data.show_prices) ? 1 : 0;
  if (data.show_cover !== undefined) set.show_cover = toBool(data.show_cover) ? 1 : 0;
  if (data.show_back_cover !== undefined) set.show_back_cover = toBool(data.show_back_cover) ? 1 : 0;

  if (Object.keys(set).length) {
    await db.update(catalogs).set(set).where(eq(catalogs.id, id));
  }
}

export async function repoDeleteCatalog(id: string) {
  await db.delete(catalogs).where(eq(catalogs.id, id));
}

export async function repoUpdateCatalogStatus(id: string, status: string) {
  await db.update(catalogs).set({ status }).where(eq(catalogs.id, id));
}

export async function repoDuplicateCatalog(id: string, userId: string) {
  const source = await repoGetCatalogFull(id);
  if (!source) return null;

  const newId = crypto.randomUUID();
  const newSlug = `${source.slug}-copy-${Date.now()}`;

  await db.insert(catalogs).values({
    id: newId,
    title: `${source.title} (Copy)`,
    slug: newSlug,
    status: 'draft',
    brand_name: source.brand_name,
    season: source.season,
    contact_info: source.contact_info,
    logo_url: source.logo_url,
    cover_image_url: source.cover_image_url,
    locale: source.locale,
    color_theme: source.color_theme,
    font_family: source.font_family,
    accent_color: source.accent_color,
    page_count: source.page_count,
    product_count: source.product_count,
    created_by: userId,
  });

  for (const page of source.pages) {
    const newPageId = crypto.randomUUID();
    await db.insert(catalogPages).values({
      id: newPageId,
      catalog_id: newId,
      page_number: page.page_number,
      layout_type: page.layout_type,
      background_color: page.background_color,
    });

    for (const item of page.items) {
      await db.insert(catalogPageItems).values({
        id: crypto.randomUUID(),
        page_id: newPageId,
        slot_index: item.slot_index,
        source_id: item.source_id,
        source_product_id: item.source_product_id,
        snapshot_title: item.snapshot_title,
        snapshot_description: item.snapshot_description,
        snapshot_image_url: item.snapshot_image_url,
        snapshot_images: item.snapshot_images,
        snapshot_price: item.snapshot_price,
        snapshot_category_name: item.snapshot_category_name,
        snapshot_specs: item.snapshot_specs,
        snapshot_locale: item.snapshot_locale,
        display_order: item.display_order,
      });
    }
  }

  return { id: newId };
}

export async function repoUpdateCatalogCounts(catalogId: string) {
  const [pageResult] = await db
    .select({ total: count() })
    .from(catalogPages)
    .where(eq(catalogPages.catalog_id, catalogId));

  const [itemResult] = await db
    .select({ total: count() })
    .from(catalogPageItems)
    .where(
      sql`${catalogPageItems.page_id} IN (
        SELECT ${catalogPages.id} FROM ${catalogPages}
        WHERE ${catalogPages.catalog_id} = ${catalogId}
      )`,
    );

  await db.update(catalogs).set({
    page_count: pageResult?.total ?? 0,
    product_count: itemResult?.total ?? 0,
  }).where(eq(catalogs.id, catalogId));
}
