// src/modules/productSources/source-adapters/index.ts

export { fetchBereketFideCategories, fetchBereketFideProducts } from './bereketfide';
export { fetchVistaSeedCategories, fetchVistaSeedProducts } from './vistaseed';
export { fetchGenericCategories, fetchGenericProducts } from './generic';
export { fetchSourceBrandInfo } from './brand-info';
export type {
  SourceBrandInfo,
  SourceBrandLogo,
  SourceBrandContact,
  SourceBrandSocials,
  SourceBrandProfile,
} from './brand-info';
