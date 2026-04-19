// src/modules/productSources/source-adapters/vistainsaat.ts
//
// VistaInşaat ekosistem patternini kullanir ama iki kritik fark vardir:
//   - categories.module_key bircok modul icin (news, vistainsaat, ...)
//     ortak — adapter SADECE module_key='vistainsaat' kategorileri donmelidir.
//   - products.item_type alaninda inşaat projeleri 'vistainsaat' olarak
//     etiketlenir (item_type='product' degil).
//   - sub_categories tablosu yok; kategori filtresi dogrudan p.category_id
//     uzerinden yapilir.
//
// Adapter SADECE SELECT yapar — VistaInsaat kanitli DB'sine yazma yok.

import { sql } from 'drizzle-orm';
import type { MySql2Database } from 'drizzle-orm/mysql2';

type SourceDb = MySql2Database<Record<string, never>>;

type FetchParams = {
  locale: string;
  categoryId?: string;
  search?: string;
  page: number;
  limit: number;
};

type CategoryRow = { id: string; name: string; slug: string; image_url: string | null };
type ProductRow = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  images: string | null;
  price: string | null;
  product_code: string | null;
  category_name: string | null;
  subcategory_name: string | null;
};

const MODULE_KEY = 'vistainsaat';
const ITEM_TYPE = 'vistainsaat';

function unwrapRows<T>(result: unknown): T[] {
  if (Array.isArray(result) && Array.isArray(result[0])) return result[0] as T[];
  if (Array.isArray(result)) return result as T[];
  return [];
}

/** VistaInşaat DB'sinden proje kategorilerini ceker (module_key=vistainsaat filtresi) */
export async function fetchVistaInsaatCategories(
  sourceDb: SourceDb,
  locale: string,
): Promise<CategoryRow[]> {
  const result = await sourceDb.execute(sql`
    SELECT c.id, ci.name, ci.slug, c.image_url
    FROM categories c
    JOIN category_i18n ci ON ci.category_id = c.id AND ci.locale = ${locale}
    WHERE c.is_active = 1 AND c.module_key = ${MODULE_KEY}
    ORDER BY c.display_order, ci.name
  `);
  return unwrapRows<CategoryRow>(result);
}

/** VistaInşaat DB'sinden inşaat projelerini ceker (item_type=vistainsaat, sub_category yok) */
export async function fetchVistaInsaatProducts(
  sourceDb: SourceDb,
  params: FetchParams,
): Promise<{ rows: ProductRow[]; total: number }> {
  const offset = (params.page - 1) * params.limit;

  const conditions = [sql`p.is_active = 1`, sql`p.item_type = ${ITEM_TYPE}`];

  if (params.categoryId) {
    conditions.push(sql`p.category_id = ${params.categoryId}`);
  }
  if (params.search) {
    const term = `%${params.search}%`;
    conditions.push(sql`(pi.title LIKE ${term} OR pi.description LIKE ${term})`);
  }

  const where = conditions.reduce((acc, cond) => sql`${acc} AND ${cond}`);

  const countRaw = await sourceDb.execute(sql`
    SELECT COUNT(*) as total
    FROM products p
    JOIN product_i18n pi ON pi.product_id = p.id AND pi.locale = ${params.locale}
    WHERE ${where}
  `);
  const total = Number(unwrapRows<{ total: number }>(countRaw)[0]?.total ?? 0);

  const rowsRaw = await sourceDb.execute(sql`
    SELECT p.id, pi.title, pi.description, p.image_url, p.images,
           p.price, p.product_code,
           ci.name AS category_name,
           NULL AS subcategory_name
    FROM products p
    JOIN product_i18n pi ON pi.product_id = p.id AND pi.locale = ${params.locale}
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN category_i18n ci ON ci.category_id = c.id AND ci.locale = ${params.locale}
    WHERE ${where}
    ORDER BY p.order_num, pi.title
    LIMIT ${params.limit} OFFSET ${offset}
  `);

  return {
    rows: unwrapRows<ProductRow>(rowsRaw),
    total,
  };
}
