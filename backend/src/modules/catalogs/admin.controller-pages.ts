// src/modules/catalogs/admin.controller-pages.ts

import type { FastifyRequest, FastifyReply } from 'fastify';
import { getAuthUserId, handleRouteError, sendNotFound } from '@/modules/_shared';
import {
  addPageSchema,
  updatePageSchema,
  reorderPagesSchema,
  addPageItemSchema,
  updatePageItemSchema,
  reorderItemsSchema,
  addProductsBulkSchema,
} from './validation';
import { repoGetCatalogById } from './repository';
import { repoAddPage, repoUpdatePage, repoDeletePage, repoReorderPages, repoGetPageById } from './repository-pages';
import { repoAddPageItem, repoUpdatePageItem, repoDeletePageItem, repoReorderItems, repoGetPageItemById } from './repository-items';
import { bulkAddProducts, refreshSnapshots } from './service';

/* ── Pages ───────────────────────────────────────────────────────── */

/** POST /admin/catalogs/:id/pages */
export async function adminAddPage(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const catalog = await repoGetCatalogById(id);
    if (!catalog) return sendNotFound(reply);
    const data = addPageSchema.parse(req.body ?? {});
    const result = await repoAddPage(id, data);
    return reply.status(201).send(result);
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_catalog_add_page');
  }
}

/** PATCH /admin/catalogs/:id/pages/:pageId */
export async function adminUpdatePage(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { pageId } = req.params as { id: string; pageId: string };
    const page = await repoGetPageById(pageId);
    if (!page) return sendNotFound(reply);
    const data = updatePageSchema.parse(req.body ?? {});
    await repoUpdatePage(pageId, data);
    const updated = await repoGetPageById(pageId);
    return reply.send(updated);
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_catalog_update_page');
  }
}

/** DELETE /admin/catalogs/:id/pages/:pageId */
export async function adminDeletePage(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { pageId } = req.params as { id: string; pageId: string };
    const page = await repoGetPageById(pageId);
    if (!page) return sendNotFound(reply);
    await repoDeletePage(pageId);
    return reply.send({ ok: true });
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_catalog_delete_page');
  }
}

/** POST /admin/catalogs/:id/pages/reorder */
export async function adminReorderPages(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const catalog = await repoGetCatalogById(id);
    if (!catalog) return sendNotFound(reply);
    const { pages } = reorderPagesSchema.parse(req.body ?? {});
    await repoReorderPages(id, pages);
    return reply.send({ ok: true });
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_catalog_reorder_pages');
  }
}

/* ── Items ───────────────────────────────────────────────────────── */

/** POST /admin/catalogs/:id/pages/:pageId/items */
export async function adminAddPageItem(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { pageId } = req.params as { id: string; pageId: string };
    const page = await repoGetPageById(pageId);
    if (!page) return sendNotFound(reply);
    const data = addPageItemSchema.parse(req.body ?? {});
    const result = await repoAddPageItem(pageId, data);
    return reply.status(201).send(result);
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_catalog_add_item');
  }
}

/** PATCH /admin/catalogs/:id/pages/:pageId/items/:itemId */
export async function adminUpdatePageItem(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { itemId } = req.params as { id: string; pageId: string; itemId: string };
    const item = await repoGetPageItemById(itemId);
    if (!item) return sendNotFound(reply);
    const data = updatePageItemSchema.parse(req.body ?? {});
    await repoUpdatePageItem(itemId, data);
    const updated = await repoGetPageItemById(itemId);
    return reply.send(updated);
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_catalog_update_item');
  }
}

/** DELETE /admin/catalogs/:id/pages/:pageId/items/:itemId */
export async function adminDeletePageItem(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { itemId } = req.params as { id: string; pageId: string; itemId: string };
    const item = await repoGetPageItemById(itemId);
    if (!item) return sendNotFound(reply);
    await repoDeletePageItem(itemId);
    return reply.send({ ok: true });
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_catalog_delete_item');
  }
}

/** POST /admin/catalogs/:id/pages/:pageId/items/reorder */
export async function adminReorderItems(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { pageId } = req.params as { id: string; pageId: string };
    const page = await repoGetPageById(pageId);
    if (!page) return sendNotFound(reply);
    const { items } = reorderItemsSchema.parse(req.body ?? {});
    await repoReorderItems(pageId, items);
    return reply.send({ ok: true });
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_catalog_reorder_items');
  }
}

/* ── Bulk & Refresh ──────────────────────────────────────────────── */

/** POST /admin/catalogs/:id/add-products */
export async function adminBulkAddProducts(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const catalog = await repoGetCatalogById(id);
    if (!catalog) return sendNotFound(reply);
    const data = addProductsBulkSchema.parse(req.body ?? {});
    const result = await bulkAddProducts(id, data);
    return reply.send(result);
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_catalog_bulk_add');
  }
}

/** POST /admin/catalogs/:id/refresh-snapshots */
export async function adminRefreshSnapshots(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const catalog = await repoGetCatalogById(id);
    if (!catalog) return sendNotFound(reply);
    const result = await refreshSnapshots(id);
    return reply.send(result);
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_catalog_refresh_snapshots');
  }
}
