// src/modules/catalogs/index.ts
// External module surface. Keep explicit; no export *.

export { registerCatalogsAdmin } from './admin.routes';

export {
  catalogs,
  catalogPages,
  catalogPageItems,
} from './schema';
export type {
  Catalog,
  NewCatalog,
  CatalogPage,
  NewCatalogPage,
  CatalogPageItem,
  NewCatalogPageItem,
} from './schema';
