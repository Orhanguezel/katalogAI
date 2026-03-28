// src/modules/productSources/repository.ts

import { db } from '@/db/client';
import { eq, and, sql } from 'drizzle-orm';
import { productSources, sourceProducts } from './schema';
import type { ProductSource } from './schema';
import { toBool } from '@/modules/_shared';
import { getSourceConnection, closeSourceConnection } from './pool-manager';
import {
  fetchBereketFideCategories,
  fetchBereketFideProducts,
  fetchVistaSeedCategories,
  fetchVistaSeedProducts,
  fetchGenericCategories,
  fetchGenericProducts,
} from './source-adapters';

type ListParams = { page: number; limit: number; is_active?: unknown };

/** Kaynaklari sayfalanmis listeler */
export async function repoListProductSources(params: ListParams) {
  const offset = (params.page - 1) * params.limit;
  const conditions: ReturnType<typeof eq>[] = [];

  if (params.is_active !== undefined) {
    conditions.push(eq(productSources.is_active, toBool(params.is_active) ? 1 : 0));
  }

  const where = conditions.length ? and(...conditions) : undefined;

  const [rows, countResult] = await Promise.all([
    db.select().from(productSources).where(where).limit(params.limit).offset(offset),
    db.select({ total: sql<number>`COUNT(*)` }).from(productSources).where(where),
  ]);

  return { rows, total: Number(countResult[0]?.total ?? 0) };
}

/** Tek kaynak getir */
export async function repoGetProductSourceById(id: string) {
  const [row] = await db.select().from(productSources).where(eq(productSources.id, id)).limit(1);
  return row ?? null;
}

/** Yeni kaynak olustur */
export async function repoCreateProductSource(data: Omit<ProductSource, 'created_at' | 'updated_at'>) {
  await db.insert(productSources).values(data);
  return { id: data.id };
}

/** Kaynagi guncelle */
export async function repoUpdateProductSource(id: string, data: Record<string, unknown>) {
  if (!Object.keys(data).length) return;
  await db.update(productSources).set(data).where(eq(productSources.id, id));
}

/** Kaynagi sil */
export async function repoDeleteProductSource(id: string) {
  await closeSourceConnection(id);
  await db.delete(productSources).where(eq(productSources.id, id));
}

/** Kaynak DB baglantisini test et */
export async function repoTestSourceConnection(source: ProductSource) {
  try {
    const { pool } = getSourceConnection({
      id: source.id,
      db_host: source.db_host ?? '',
      db_port: source.db_port ?? 3306,
      db_name: source.db_name ?? '',
      db_user: source.db_user ?? '',
      db_password: source.db_password ?? '',
      connection_limit: source.connection_limit ?? 5,
    });
    const conn = await pool.getConnection();
    conn.release();
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/** Kaynak DB'den kategorileri cek (adapter proxy) */
export async function repoFetchSourceCategories(source: ProductSource, locale: string) {
  const { drizzle: sourceDb } = getSourceConnection({
    id: source.id,
    db_host: source.db_host ?? '',
    db_port: source.db_port ?? 3306,
    db_name: source.db_name ?? '',
    db_user: source.db_user ?? '',
    db_password: source.db_password ?? '',
    connection_limit: source.connection_limit ?? 5,
  });

  if (source.slug === 'bereketfide') {
    return fetchBereketFideCategories(sourceDb, locale);
  }
  if (source.slug === 'vistaseed') {
    return fetchVistaSeedCategories(sourceDb, locale);
  }
  return fetchGenericCategories(sourceDb, locale);
}

/** Kaynak DB'den urunleri cek (adapter proxy) */
export async function repoFetchSourceProducts(
  source: ProductSource,
  params: { locale: string; categoryId?: string; search?: string; page: number; limit: number },
) {
  const { drizzle: sourceDb } = getSourceConnection({
    id: source.id,
    db_host: source.db_host ?? '',
    db_port: source.db_port ?? 3306,
    db_name: source.db_name ?? '',
    db_user: source.db_user ?? '',
    db_password: source.db_password ?? '',
    connection_limit: source.connection_limit ?? 5,
  });

  if (source.slug === 'bereketfide') {
    return fetchBereketFideProducts(sourceDb, params);
  }
  if (source.slug === 'vistaseed') {
    return fetchVistaSeedProducts(sourceDb, params);
  }
  return fetchGenericProducts(sourceDb, params);
}

/** Import tipi kaynak icin urunleri toplu ekle */
export async function repoImportProducts(
  sourceId: string,
  products: Array<{
    id: string;
    external_id?: string;
    title: string;
    description?: string;
    image_url?: string;
    images?: string[];
    price?: number;
    product_code?: string;
    category_name?: string;
    subcategory_name?: string;
    locale?: string;
    specs?: Record<string, string>;
    tags?: string[];
    is_active?: unknown;
  }>,
) {
  const values = products.map((p) => ({
    id: p.id,
    source_id: sourceId,
    external_id: p.external_id ?? null,
    title: p.title,
    description: p.description ?? null,
    image_url: p.image_url ?? null,
    images: p.images ?? null,
    price: p.price != null ? String(p.price) : null,
    product_code: p.product_code ?? null,
    category_name: p.category_name ?? null,
    subcategory_name: p.subcategory_name ?? null,
    locale: p.locale ?? 'de',
    specs: p.specs ?? null,
    tags: p.tags ?? null,
    is_active: p.is_active !== undefined ? (toBool(p.is_active) ? 1 : 0) : 1,
  }));

  await db.insert(sourceProducts).values(values);
  return { inserted: values.length };
}

/** Import tipi kaynak urunlerini listele */
export async function repoListSourceProducts(
  sourceId: string,
  params: { page: number; limit: number },
) {
  const offset = (params.page - 1) * params.limit;

  const [rows, countResult] = await Promise.all([
    db
      .select()
      .from(sourceProducts)
      .where(eq(sourceProducts.source_id, sourceId))
      .limit(params.limit)
      .offset(offset),
    db
      .select({ total: sql<number>`COUNT(*)` })
      .from(sourceProducts)
      .where(eq(sourceProducts.source_id, sourceId)),
  ]);

  return { rows, total: Number(countResult[0]?.total ?? 0) };
}
