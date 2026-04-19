// src/modules/productSources/admin.controller.ts

import type { FastifyRequest, FastifyReply } from 'fastify';
import { handleRouteError, sendNotFound, parsePage, toBool } from '@/modules/_shared';
import {
  createProductSourceSchema,
  updateProductSourceSchema,
  listProductSourcesSchema,
  importProductsSchema,
  fetchSourceBrandInfoSchema,
} from './validation';
import {
  repoListProductSources,
  repoGetProductSourceById,
  repoCreateProductSource,
  repoUpdateProductSource,
  repoDeleteProductSource,
  repoTestSourceConnection,
  repoFetchSourceCategories,
  repoFetchSourceProducts,
  repoFetchSourceBrandInfo,
  repoImportProducts,
  repoListSourceProducts,
} from './repository';
import { resolveSourceMediaUrl } from './helpers';
import type { SourceBrandInfo } from './source-adapters';

/** GET /admin/product-sources/list */
export async function adminListProductSources(req: FastifyRequest, reply: FastifyReply) {
  try {
    const q = req.query as Record<string, string>;
    const params = listProductSourcesSchema.parse(q);
    const result = await repoListProductSources(params);
    return reply.send(result);
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_product_sources_list');
  }
}

/** GET /admin/product-sources/:id */
export async function adminGetProductSource(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const row = await repoGetProductSourceById(id);
    if (!row) return sendNotFound(reply);
    return reply.send(row);
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_product_source_get');
  }
}

/** POST /admin/product-sources */
export async function adminCreateProductSource(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = createProductSourceSchema.parse(req.body ?? {});
    const id = crypto.randomUUID();
    await repoCreateProductSource({
      id,
      name: data.name,
      slug: data.slug,
      source_type: data.source_type,
      db_host: data.db_host ?? null,
      db_port: data.db_port,
      db_name: data.db_name ?? null,
      db_user: data.db_user ?? null,
      db_password: data.db_password ?? null,
      default_locale: data.default_locale,
      has_subcategories: data.has_subcategories !== undefined ? (toBool(data.has_subcategories) ? 1 : 0) : 0,
      image_base_url: data.image_base_url ?? null,
      is_active: data.is_active !== undefined ? (toBool(data.is_active) ? 1 : 0) : 1,
      connection_limit: data.connection_limit,
      brand_title: null,
      brand_subtitle: null,
      brand_logo_url: null,
      brand_contact: null,
    });
    const row = await repoGetProductSourceById(id);
    return reply.status(201).send(row);
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_product_source_create');
  }
}

/** PATCH /admin/product-sources/:id */
export async function adminUpdateProductSource(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const existing = await repoGetProductSourceById(id);
    if (!existing) return sendNotFound(reply);
    const data = updateProductSourceSchema.parse(req.body ?? {});
    const update: Record<string, unknown> = {};
    if (data.name !== undefined) update.name = data.name;
    if (data.slug !== undefined) update.slug = data.slug;
    if (data.source_type !== undefined) update.source_type = data.source_type;
    if (data.db_host !== undefined) update.db_host = data.db_host;
    if (data.db_port !== undefined) update.db_port = data.db_port;
    if (data.db_name !== undefined) update.db_name = data.db_name;
    if (data.db_user !== undefined) update.db_user = data.db_user;
    if (data.db_password !== undefined) update.db_password = data.db_password;
    if (data.default_locale !== undefined) update.default_locale = data.default_locale;
    if (data.has_subcategories !== undefined) update.has_subcategories = toBool(data.has_subcategories) ? 1 : 0;
    if (data.image_base_url !== undefined) update.image_base_url = data.image_base_url;
    if (data.is_active !== undefined) update.is_active = toBool(data.is_active) ? 1 : 0;
    if (data.connection_limit !== undefined) update.connection_limit = data.connection_limit;
    await repoUpdateProductSource(id, update);
    const row = await repoGetProductSourceById(id);
    return reply.send(row);
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_product_source_update');
  }
}

/** DELETE /admin/product-sources/:id */
export async function adminDeleteProductSource(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const existing = await repoGetProductSourceById(id);
    if (!existing) return sendNotFound(reply);
    await repoDeleteProductSource(id);
    return reply.send({ ok: true });
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_product_source_delete');
  }
}

/** POST /admin/product-sources/:id/test */
export async function adminTestSourceConnection(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const source = await repoGetProductSourceById(id);
    if (!source) return sendNotFound(reply);
    const result = await repoTestSourceConnection(source);
    return reply.send(result);
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_product_source_test');
  }
}

/** GET /admin/product-sources/:id/categories */
export async function adminFetchSourceCategories(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const q = req.query as Record<string, string>;
    const source = await repoGetProductSourceById(id);
    if (!source) return sendNotFound(reply);
    const locale = q.locale || source.default_locale || 'de';
    const categories = await repoFetchSourceCategories(source, locale);
    return reply.send({ items: Array.isArray(categories) ? categories : [] });
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_product_source_categories');
  }
}

/** GET /admin/product-sources/:id/brand-info */
export async function adminFetchSourceBrandInfo(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const q = req.query as Record<string, string>;
    const source = await repoGetProductSourceById(id);
    if (!source) return sendNotFound(reply);
    const { locale: requestedLocale } = fetchSourceBrandInfoSchema.parse(q);
    const locale = requestedLocale || source.default_locale || 'de';
    const brand = await repoFetchSourceBrandInfo(source, locale);
    const resolved = resolveBrandInfoMedia(brand, source.image_base_url);
    return reply.send(resolved);
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_product_source_brand_info');
  }
}

/** GET /admin/product-sources/:id/products */
export async function adminFetchSourceProducts(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const q = req.query as Record<string, string>;
    const source = await repoGetProductSourceById(id);
    if (!source) return sendNotFound(reply);

    if (source.source_type === 'import') {
      const { page, limit } = parsePage(q);
      const result = await repoListSourceProducts(id, { page, limit });
      return reply.send(result);
    }

    const locale = q.locale || source.default_locale || 'de';
    const { page, limit } = parsePage(q);
    const [result, brand] = await Promise.all([
      repoFetchSourceProducts(source, {
        locale,
        categoryId: q.category_id || q.categoryId,
        search: q.search,
        page,
        limit,
      }),
      repoFetchSourceBrandInfo(source, locale),
    ]);

    const sourceWebsite = brand.contact.website;
    const manualOverride = source.image_base_url;
    const items = result.rows.map((row) => {
      const original = (row as { image_url?: string | null }).image_url ?? null;
      const resolved = resolveSourceMediaUrl(original, { manualOverride, sourceWebsite });
      return { ...row, image_url: resolved ?? original };
    });

    return reply.send({ items, total: result.total, page, limit });
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_product_source_products');
  }
}

/** POST /admin/product-sources/:id/import */
export async function adminImportProducts(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const source = await repoGetProductSourceById(id);
    if (!source) return sendNotFound(reply);
    const data = importProductsSchema.parse(req.body ?? {});
    const products = data.products.map((p) => ({
      ...p,
      id: crypto.randomUUID(),
    }));
    const result = await repoImportProducts(id, products);
    return reply.status(201).send(result);
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_product_source_import');
  }
}

/* ── helpers (private) ───────────────────────────────────────────── */

function resolveBrandInfoMedia(
  brand: SourceBrandInfo,
  manualOverride: string | null,
): SourceBrandInfo {
  const sourceWebsite = brand.contact.website;
  const resolve = (raw: string | null): string | null =>
    resolveSourceMediaUrl(raw, { manualOverride, sourceWebsite });
  return {
    ...brand,
    logo: {
      logo_url: resolve(brand.logo.logo_url) ?? brand.logo.logo_url,
      logo_alt: brand.logo.logo_alt,
      favicon_url: resolve(brand.logo.favicon_url) ?? brand.logo.favicon_url,
      apple_touch_icon_url:
        resolve(brand.logo.apple_touch_icon_url) ?? brand.logo.apple_touch_icon_url,
    },
  };
}
