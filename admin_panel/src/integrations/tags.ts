// src/integrations/tags.ts

// RTK Query createApi -> tagTypes: readonly string[] bekler.
// Bu listeyi 'as const' ile sabitliyoruz.
export const tags = [
  'Auth',
  'User',
  'Users',
  'Profile',
  'Categories',
  'Category',
  'SubCategories',
  'SiteSettings',
  'Settings',
  'Setting',
  'StorageAssets',
  'StorageAsset',
  'StorageFolders',
  'StorageFolder',
  'Storage',
  'AdminUsers',
  'UserRoles',
  'UserRole',
  'Dashboard',
  'Health',
  'Notification',
  'Notifications',
  'ProductSources',
  'ProductSource',
  'Catalogs',
  'Catalog',
  'CatalogPages',
  'CatalogPage',
  'CatalogPageItems',
  'CatalogPageItem',
] as const;

export type tag = typeof tags[number];
