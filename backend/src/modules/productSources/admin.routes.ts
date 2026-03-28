// src/modules/productSources/admin.routes.ts

import type { FastifyInstance } from 'fastify';
import {
  adminListProductSources,
  adminGetProductSource,
  adminCreateProductSource,
  adminUpdateProductSource,
  adminDeleteProductSource,
  adminTestSourceConnection,
  adminFetchSourceCategories,
  adminFetchSourceProducts,
  adminImportProducts,
} from './admin.controller';

export async function registerProductSourcesAdmin(app: FastifyInstance) {
  const B = '/product-sources';
  app.get(`${B}/list`, adminListProductSources);
  app.get(`${B}/:id`, adminGetProductSource);
  app.post(B, adminCreateProductSource);
  app.patch(`${B}/:id`, adminUpdateProductSource);
  app.delete(`${B}/:id`, adminDeleteProductSource);
  app.post(`${B}/:id/test`, adminTestSourceConnection);
  app.get(`${B}/:id/categories`, adminFetchSourceCategories);
  app.get(`${B}/:id/products`, adminFetchSourceProducts);
  app.post(`${B}/:id/import`, adminImportProducts);
}
