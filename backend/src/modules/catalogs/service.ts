// src/modules/catalogs/service.ts

import { db } from '@/db/client';
import { eq, and } from 'drizzle-orm';
import { catalogPages, catalogPageItems } from './schema';
import { repoAddPage } from './repository-pages';
import { repoAddPageItem } from './repository-items';
import { repoUpdateCatalogCounts } from './repository';
import { sourceProducts } from '@/modules/productSources/schema';
import type { AddProductsBulkInput } from './validation';

/* ── Layout slot counts ──────────────────────────────────────────── */

const LAYOUT_SLOTS: Record<string, number> = {
  '2x2': 4,
  '3x2': 6,
  '2x3': 6,
  featured: 1,
  asymmetric: 3,
  cover: 1,
  single: 1,
  gallery: 8,
};

function getSlotsPerPage(layout: string): number {
  return LAYOUT_SLOTS[layout] ?? 4;
}

/* ── Bulk add products ───────────────────────────────────────────── */

export async function bulkAddProducts(
  catalogId: string,
  input: AddProductsBulkInput,
) {
  const layout = input.layout_type ?? '2x2';
  const slotsPerPage = getSlotsPerPage(layout);
  const products = input.products;

  let slotIndex = 0;
  let currentPageId: string | null = null;

  for (let i = 0; i < products.length; i++) {
    // create a new page when needed
    if (slotIndex === 0 || slotIndex >= slotsPerPage) {
      const result = await repoAddPage(catalogId, { layout_type: layout });
      currentPageId = result.id;
      slotIndex = 0;
    }

    const p = products[i];
    await repoAddPageItem(currentPageId!, {
      source_id: p.source_id,
      source_product_id: p.source_product_id,
      slot_index: slotIndex,
      snapshot_title: p.snapshot_title,
      snapshot_description: p.snapshot_description,
      snapshot_image_url: p.snapshot_image_url,
      snapshot_images: p.snapshot_images,
      snapshot_price: p.snapshot_price,
      snapshot_category_name: p.snapshot_category_name,
      snapshot_specs: p.snapshot_specs,
      snapshot_locale: p.snapshot_locale,
    });

    slotIndex++;
  }

  await repoUpdateCatalogCounts(catalogId);
  return { added: products.length };
}

/* ── Refresh snapshots ───────────────────────────────────────────── */

export async function refreshSnapshots(catalogId: string) {
  const pages = await db
    .select()
    .from(catalogPages)
    .where(eq(catalogPages.catalog_id, catalogId));

  let updated = 0;

  for (const page of pages) {
    const items = await db
      .select()
      .from(catalogPageItems)
      .where(eq(catalogPageItems.page_id, page.id));

    for (const item of items) {
      if (!item.source_id || !item.source_product_id) continue;

      const [product] = await db
        .select()
        .from(sourceProducts)
        .where(
          and(
            eq(sourceProducts.id, item.source_product_id),
            eq(sourceProducts.source_id, item.source_id),
          ),
        )
        .limit(1);

      if (product) {
        await db
          .update(catalogPageItems)
          .set({
            snapshot_title: product.title,
            snapshot_description: product.description,
            snapshot_image_url: product.image_url,
            snapshot_images: product.images,
            snapshot_price: product.price,
            snapshot_category_name: product.category_name,
            snapshot_specs: product.specs,
            snapshot_locale: product.locale,
          })
          .where(eq(catalogPageItems.id, item.id));

        updated++;
      }
    }
  }

  return { updated };
}
