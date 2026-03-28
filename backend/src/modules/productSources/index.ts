// src/modules/productSources/index.ts
// External module surface. Keep explicit; no export *.

export { registerProductSourcesAdmin } from './admin.routes';

export {
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

export {
  repoListProductSources,
  repoGetProductSourceById,
  repoCreateProductSource,
  repoUpdateProductSource,
  repoDeleteProductSource,
  repoTestSourceConnection,
  repoFetchSourceCategories,
  repoFetchSourceProducts,
  repoImportProducts,
  repoListSourceProducts,
} from './repository';

export {
  createProductSourceSchema,
  updateProductSourceSchema,
  listProductSourcesSchema,
  importProductsSchema,
} from './validation';

export { productSources, sourceProducts } from './schema';
export type { ProductSource, NewProductSource, SourceProduct, NewSourceProduct } from './schema';

export { getSourceConnection, closeSourceConnection, closeAllSourceConnections } from './pool-manager';
