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
  adminFetchSourceBrandInfo,
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
  repoFetchSourceBrandInfo,
  repoImportProducts,
  repoListSourceProducts,
} from './repository';

export {
  createProductSourceSchema,
  updateProductSourceSchema,
  listProductSourcesSchema,
  fetchSourceBrandInfoSchema,
  importProductsSchema,
} from './validation';

export { productSources, sourceProducts } from './schema';
export type { ProductSource, NewProductSource, SourceProduct, NewSourceProduct } from './schema';

export type {
  SourceBrandInfo,
  SourceBrandLogo,
  SourceBrandContact,
  SourceBrandSocials,
  SourceBrandProfile,
} from './source-adapters';

export { getSourceConnection, closeSourceConnection, closeAllSourceConnections } from './pool-manager';
