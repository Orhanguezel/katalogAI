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
  useListContactsAdminQuery,
  useGetContactAdminQuery,
  useUpdateContactAdminMutation,
  useDeleteContactAdminMutation,
} from '@/integrations/endpoints/admin/contacts-admin-endpoints';

export {
  useListCarriersAdminQuery,
  useGetCarrierAdminQuery,
} from '@/integrations/endpoints/admin/carriers-admin-endpoints';

export {
  useGetThemeAdminQuery,
  useUpdateThemeAdminMutation,
  useResetThemeAdminMutation,
} from '@/integrations/endpoints/admin/theme-admin-endpoints';

export {
  useListAuditRequestLogsAdminQuery,
  useListAuditAuthEventsAdminQuery,
  useGetAuditMetricsDailyAdminQuery,
  useGetAuditGeoStatsAdminQuery,
  useClearAuditLogsAdminMutation,
} from '@/integrations/endpoints/admin/audit-admin-endpoints';

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
  useListEmailTemplatesAdminQuery,
  useGetEmailTemplateAdminQuery,
  useCreateEmailTemplateAdminMutation,
  useUpdateEmailTemplateAdminMutation,
  useDeleteEmailTemplateAdminMutation,
} from '@/integrations/endpoints/admin/email-templates-admin-endpoints';

export {
  useAdminReportsKpiQuery,
  useAdminReportsUsersPerformanceQuery,
  useAdminReportsLocationsQuery,
} from '@/integrations/endpoints/admin/reports-admin-endpoints';

export {
  useListTelegramInboundQuery,
  useGetTelegramAutoReplyQuery,
  useUpdateTelegramAutoReplyMutation,
} from '@/integrations/endpoints/admin/telegram-inbound-endpoints';

export {
  useTelegramTestMutation,
  useTelegramSendMutation,
  useTelegramEventMutation,
  useTelegramSendTestMutation,
  useSendTelegramNotificationMutation,
} from '@/integrations/endpoints/admin/telegram-admin-endpoints';

export {
  useTelegramWebhookSimulateMutation,
} from '@/integrations/endpoints/admin/telegram-webhook-endpoints';

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
  useListWalletsAdminQuery,
  useGetWalletAdminQuery,
  useUpdateWalletStatusAdminMutation,
  useAdjustWalletAdminMutation,
  useListWalletTransactionsAdminQuery,
  useUpdateTransactionStatusAdminMutation,
} from '@/integrations/endpoints/admin/wallet-admin-endpoints';

export {
  useListIlanlarAdminQuery,
  useUpdateIlanStatusAdminMutation,
  useDeleteIlanAdminMutation,
} from '@/integrations/endpoints/admin/ilanlar-admin-endpoints';

export {
  useListBookingsAdminQuery,
  useUpdateBookingStatusAdminMutation,
} from '@/integrations/endpoints/admin/bookings-admin-endpoints';
