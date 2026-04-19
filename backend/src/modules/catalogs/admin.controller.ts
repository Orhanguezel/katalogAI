// src/modules/catalogs/admin.controller.ts

import type { FastifyRequest, FastifyReply } from 'fastify';
import { getAuthUserId, parsePage, handleRouteError, sendNotFound } from '@/modules/_shared';
import {
  createCatalogSchema,
  updateCatalogSchema,
  listCatalogsSchema,
  updateStatusSchema,
} from './validation';
import {
  repoListCatalogs,
  repoGetCatalogById,
  repoGetCatalogFull,
  repoCreateCatalog,
  repoUpdateCatalog,
  repoDeleteCatalog,
  repoUpdateCatalogStatus,
  repoDuplicateCatalog,
} from './repository';
import { syncCatalogToTarget } from '@/modules/exports/sync-service';

/** GET /admin/catalogs/list */
export async function adminListCatalogs(req: FastifyRequest, reply: FastifyReply) {
  try {
    const q = req.query as Record<string, string>;
    const params = listCatalogsSchema.parse(q);
    const { offset } = parsePage(q);
    const result = await repoListCatalogs({ ...params, offset });
    return reply.send(result);
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_catalogs_list');
  }
}

/** GET /admin/catalogs/:id */
export async function adminGetCatalog(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const row = await repoGetCatalogFull(id);
    if (!row) return sendNotFound(reply);
    return reply.send(row);
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_catalog_get');
  }
}

/** POST /admin/catalogs */
export async function adminCreateCatalog(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = getAuthUserId(req);
    const data = createCatalogSchema.parse(req.body ?? {});
    const result = await repoCreateCatalog(data, userId);
    const row = await repoGetCatalogById(result.id);
    void syncCatalogToTarget(result.id, { includePdf: true }).catch((err) => {
      req.log?.warn({ err, catalogId: result.id }, 'catalog_target_sync_failed');
    });
    return reply.status(201).send(row);
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_catalog_create');
  }
}

/** PATCH /admin/catalogs/:id */
export async function adminUpdateCatalog(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const existing = await repoGetCatalogById(id);
    if (!existing) return sendNotFound(reply);
    const data = updateCatalogSchema.parse(req.body ?? {});
    await repoUpdateCatalog(id, data);
    const row = await repoGetCatalogById(id);
    void syncCatalogToTarget(id, { includePdf: true }).catch((err) => {
      req.log?.warn({ err, catalogId: id }, 'catalog_target_sync_failed');
    });
    return reply.send(row);
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_catalog_update');
  }
}

/** DELETE /admin/catalogs/:id */
export async function adminDeleteCatalog(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const existing = await repoGetCatalogById(id);
    if (!existing) return sendNotFound(reply);
    await repoDeleteCatalog(id);
    return reply.send({ ok: true });
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_catalog_delete');
  }
}

/** PATCH /admin/catalogs/:id/status */
export async function adminUpdateCatalogStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const existing = await repoGetCatalogById(id);
    if (!existing) return sendNotFound(reply);
    const { status } = updateStatusSchema.parse(req.body ?? {});
    await repoUpdateCatalogStatus(id, status);
    const row = await repoGetCatalogById(id);
    return reply.send(row);
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_catalog_status');
  }
}

/** POST /admin/catalogs/:id/duplicate */
export async function adminDuplicateCatalog(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const userId = getAuthUserId(req);
    const existing = await repoGetCatalogById(id);
    if (!existing) return sendNotFound(reply);
    const result = await repoDuplicateCatalog(id, userId);
    if (!result) return sendNotFound(reply);
    const row = await repoGetCatalogById(result.id);
    return reply.status(201).send(row);
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_catalog_duplicate');
  }
}
