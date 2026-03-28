'use client';
// =============================================================
// FILE: src/integrations/hooks.ts
// Explicit barrel exports for RTK Query hooks (KatalogAI)
// =============================================================

// =========================
// Public / Shared endpoints
// =========================

export {
  useAuthSignupMutation,
  useAuthTokenMutation,
  useAuthRefreshMutation,
  useAuthMeQuery,
  useAuthStatusQuery,
  useAuthUpdateMutation,
  useAuthPasswordResetRequestMutation,
  useAuthPasswordResetConfirmMutation,
  useAuthLogoutMutation,
  useLogoutMutation,
  useStatusQuery,
} from '@/integrations/endpoints/users/auth-public-endpoints';

export {
  useGetMyProfileQuery,
  useUpsertMyProfileMutation,
  useGetProfileByIdQuery,
} from '@/integrations/endpoints/users/profiles-endpoints';

export {
  useListUserRolesQuery,
  useCreateUserRoleMutation,
  useDeleteUserRoleMutation,
} from '@/integrations/endpoints/users/user-roles-endpoints';

export {
  useListSiteSettingsQuery,
  useLazyListSiteSettingsQuery,
  useGetSiteSettingByKeyQuery,
  useLazyGetSiteSettingByKeyQuery,
} from '@/integrations/endpoints/public/site-settings-public-endpoints';

// ==============
// Admin endpoints
// ==============

export {
  useAdminListQuery,
  useAdminGetQuery,
  useAdminUpdateUserMutation,
  useAdminSetActiveMutation,
  useAdminSetRolesMutation,
  useAdminSetPasswordMutation,
  useAdminRemoveUserMutation,
  useListUsersAdminQuery,
  useGetUserAdminQuery,
  useUpdateUserAdminMutation,
  useSetUserActiveAdminMutation,
  useSetUserRolesAdminMutation,
  useSetUserPasswordAdminMutation,
  useRemoveUserAdminMutation,
} from '@/integrations/endpoints/admin/users/auth-admin-endpoints';

export {
  useGetDashboardSummaryAdminQuery,
} from '@/integrations/endpoints/admin/dashboard-admin-endpoints';

export {
  useGetThemeAdminQuery,
  useUpdateThemeAdminMutation,
  useResetThemeAdminMutation,
} from '@/integrations/endpoints/admin/theme-admin-endpoints';


export {
  useListSiteSettingsAdminQuery,
  useGetSiteSettingAdminByKeyQuery,
  useGetAppLocalesAdminQuery,
  useGetDefaultLocaleAdminQuery,
  useCreateSiteSettingAdminMutation,
  useUpdateSiteSettingAdminMutation,
  useDeleteSiteSettingAdminMutation,
  useBulkUpsertSiteSettingsAdminMutation,
  useDeleteManySiteSettingsAdminMutation,
} from '@/integrations/endpoints/admin/site-settings-admin-endpoints';

export {
  useListAssetsAdminQuery,
  useGetAssetAdminQuery,
  useCreateAssetAdminMutation,
  useBulkCreateAssetsAdminMutation,
  usePatchAssetAdminMutation,
  useDeleteAssetAdminMutation,
  useBulkDeleteAssetsAdminMutation,
  useListFoldersAdminQuery,
  useDiagCloudinaryAdminQuery,
  useLazyDiagCloudinaryAdminQuery,
} from '@/integrations/endpoints/admin/storage-admin-endpoints';


export {
  useListCategoriesAdminQuery,
  useLazyListCategoriesAdminQuery,
  useGetCategoryAdminQuery,
  useLazyGetCategoryAdminQuery,
  useCreateCategoryAdminMutation,
  useUpdateCategoryAdminMutation,
  useDeleteCategoryAdminMutation,
  useReorderCategoriesAdminMutation,
  useToggleCategoryActiveAdminMutation,
  useToggleCategoryFeaturedAdminMutation,
  useToggleCategoryUnlimitedAdminMutation,
  useSetCategoryImageAdminMutation,
} from '@/integrations/endpoints/admin/categories-admin-endpoints';

export {
  useListProductSourcesAdminQuery,
  useLazyListProductSourcesAdminQuery,
  useGetProductSourceAdminQuery,
  useCreateProductSourceAdminMutation,
  useUpdateProductSourceAdminMutation,
  useDeleteProductSourceAdminMutation,
  useTestProductSourceAdminMutation,
  useGetSourceCategoriesAdminQuery,
  useLazyGetSourceCategoriesAdminQuery,
  useGetSourceProductsAdminQuery,
  useLazyGetSourceProductsAdminQuery,
  useImportProductSourceAdminMutation,
} from '@/integrations/endpoints/admin/product-sources-admin-endpoints';

export {
  useListCatalogsAdminQuery,
  useLazyListCatalogsAdminQuery,
  useGetCatalogAdminQuery,
  useLazyGetCatalogAdminQuery,
  useCreateCatalogAdminMutation,
  useUpdateCatalogAdminMutation,
  useDeleteCatalogAdminMutation,
  useUpdateCatalogStatusAdminMutation,
  useDuplicateCatalogAdminMutation,
  useCreateCatalogPageAdminMutation,
  useUpdateCatalogPageAdminMutation,
  useDeleteCatalogPageAdminMutation,
  useReorderCatalogPagesAdminMutation,
  useCreateCatalogPageItemAdminMutation,
  useUpdateCatalogPageItemAdminMutation,
  useDeleteCatalogPageItemAdminMutation,
  useBulkAddCatalogProductsAdminMutation,
  useRefreshCatalogSnapshotsAdminMutation,
  useExportCatalogPdfAdminMutation,
  useSendCatalogEmailAdminMutation,
} from '@/integrations/endpoints/admin/catalogs-admin-endpoints';

export {
  useAiEnhanceDescriptionAdminMutation,
  useAiTranslateAdminMutation,
  useAiSeoSuggestAdminMutation,
} from '@/integrations/endpoints/admin/ai-tasks-admin-endpoints';
