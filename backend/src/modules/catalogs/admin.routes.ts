// src/modules/catalogs/admin.routes.ts

import type { FastifyInstance } from 'fastify';
import {
  adminListCatalogs,
  adminGetCatalog,
  adminCreateCatalog,
  adminUpdateCatalog,
  adminDeleteCatalog,
  adminUpdateCatalogStatus,
  adminDuplicateCatalog,
} from './admin.controller';
import {
  adminAddPage,
  adminUpdatePage,
  adminDeletePage,
  adminReorderPages,
  adminAddPageItem,
  adminUpdatePageItem,
  adminDeletePageItem,
  adminReorderItems,
  adminBulkAddProducts,
  adminRefreshSnapshots,
} from './admin.controller-pages';

export async function registerCatalogsAdmin(app: FastifyInstance) {
  const B = '/catalogs';

  // Catalog CRUD
  app.get(`${B}/list`, adminListCatalogs);
  app.get(`${B}/:id`, adminGetCatalog);
  app.post(B, adminCreateCatalog);
  app.patch(`${B}/:id`, adminUpdateCatalog);
  app.delete(`${B}/:id`, adminDeleteCatalog);
  app.patch(`${B}/:id/status`, adminUpdateCatalogStatus);
  app.post(`${B}/:id/duplicate`, adminDuplicateCatalog);

  // Pages
  app.post(`${B}/:id/pages`, adminAddPage);
  app.patch(`${B}/:id/pages/:pageId`, adminUpdatePage);
  app.delete(`${B}/:id/pages/:pageId`, adminDeletePage);
  app.post(`${B}/:id/pages/reorder`, adminReorderPages);

  // Items
  app.post(`${B}/:id/pages/:pageId/items`, adminAddPageItem);
  app.patch(`${B}/:id/pages/:pageId/items/:itemId`, adminUpdatePageItem);
  app.delete(`${B}/:id/pages/:pageId/items/:itemId`, adminDeletePageItem);
  app.post(`${B}/:id/pages/:pageId/items/reorder`, adminReorderItems);

  // Bulk
  app.post(`${B}/:id/add-products`, adminBulkAddProducts);
  app.post(`${B}/:id/refresh-snapshots`, adminRefreshSnapshots);
}
