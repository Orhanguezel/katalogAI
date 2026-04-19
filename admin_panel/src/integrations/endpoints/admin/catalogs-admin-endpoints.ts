// =============================================================
// FILE: src/integrations/endpoints/admin/catalogs-admin-endpoints.ts
// KatalogAI — Admin Catalogs RTK Endpoints
// =============================================================

import { baseApi } from '@/integrations/base-api';
import type {
  CatalogBulkAddPayload,
  CatalogCreatePayload,
  CatalogDto,
  CatalogFullDto,
  CatalogListQueryParams,
  CatalogListResponse,
  CatalogPageCreatePayload,
  CatalogPageDto,
  CatalogPageItemCreatePayload,
  CatalogPageItemDto,
  CatalogPageItemUpdatePayload,
  CatalogPageReorderPayload,
  CatalogPageUpdatePayload,
  CatalogSendEmailPayload,
  CatalogStatusPayload,
  CatalogUpdatePayload,
  PublishCatalogResult,
} from '@/integrations/shared';
import { cleanParams } from '@/integrations/shared';

export const catalogsAdminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listCatalogsAdmin: build.query<CatalogListResponse, CatalogListQueryParams | void>({
      query: (params) => ({
        url: '/admin/catalogs/list',
        method: 'GET',
        params: cleanParams(params as Record<string, unknown> | undefined),
      }),
      transformResponse: (raw: unknown, _meta, arg): CatalogListResponse => {
        const res = raw as
          | { rows?: CatalogDto[]; items?: CatalogDto[]; total?: number; page?: number; limit?: number }
          | undefined;
        const page = typeof arg === 'object' && arg?.page ? arg.page : 1;
        const limit = typeof arg === 'object' && arg?.limit ? arg.limit : 20;

        return {
          items: res?.items ?? res?.rows ?? [],
          total: res?.total ?? 0,
          page: res?.page ?? page,
          limit: res?.limit ?? limit,
        };
      },
    }),

    getCatalogAdmin: build.query<CatalogFullDto, string>({
      query: (id) => ({
        url: `/admin/catalogs/${id}`,
        method: 'GET',
      }),
    }),

    createCatalogAdmin: build.mutation<CatalogDto, CatalogCreatePayload>({
      query: (body) => ({
        url: '/admin/catalogs',
        method: 'POST',
        body,
      }),
    }),

    updateCatalogAdmin: build.mutation<CatalogDto, { id: string; patch: CatalogUpdatePayload }>({
      query: ({ id, patch }) => ({
        url: `/admin/catalogs/${id}`,
        method: 'PATCH',
        body: patch,
      }),
    }),

    deleteCatalogAdmin: build.mutation<void, string>({
      query: (id) => ({
        url: `/admin/catalogs/${id}`,
        method: 'DELETE',
      }),
    }),

    updateCatalogStatusAdmin: build.mutation<CatalogDto, { id: string; payload: CatalogStatusPayload }>({
      query: ({ id, payload }) => ({
        url: `/admin/catalogs/${id}/status`,
        method: 'PATCH',
        body: payload,
      }),
    }),

    duplicateCatalogAdmin: build.mutation<CatalogDto, string>({
      query: (id) => ({
        url: `/admin/catalogs/${id}/duplicate`,
        method: 'POST',
      }),
    }),

    createCatalogPageAdmin: build.mutation<CatalogPageDto, { catalogId: string; payload: CatalogPageCreatePayload }>({
      query: ({ catalogId, payload }) => ({
        url: `/admin/catalogs/${catalogId}/pages`,
        method: 'POST',
        body: payload,
      }),
    }),

    updateCatalogPageAdmin: build.mutation<CatalogPageDto, { catalogId: string; pageId: string; payload: CatalogPageUpdatePayload }>({
      query: ({ catalogId, pageId, payload }) => ({
        url: `/admin/catalogs/${catalogId}/pages/${pageId}`,
        method: 'PATCH',
        body: payload,
      }),
    }),

    deleteCatalogPageAdmin: build.mutation<void, { catalogId: string; pageId: string }>({
      query: ({ catalogId, pageId }) => ({
        url: `/admin/catalogs/${catalogId}/pages/${pageId}`,
        method: 'DELETE',
      }),
    }),

    reorderCatalogPagesAdmin: build.mutation<{ ok: boolean }, { catalogId: string; payload: CatalogPageReorderPayload }>({
      query: ({ catalogId, payload }) => ({
        url: `/admin/catalogs/${catalogId}/pages/reorder`,
        method: 'POST',
        body: payload,
      }),
    }),

    createCatalogPageItemAdmin: build.mutation<CatalogPageItemDto, { catalogId: string; pageId: string; payload: CatalogPageItemCreatePayload }>({
      query: ({ catalogId, pageId, payload }) => ({
        url: `/admin/catalogs/${catalogId}/pages/${pageId}/items`,
        method: 'POST',
        body: payload,
      }),
    }),

    updateCatalogPageItemAdmin: build.mutation<CatalogPageItemDto, { catalogId: string; pageId: string; itemId: string; payload: CatalogPageItemUpdatePayload }>({
      query: ({ catalogId, pageId, itemId, payload }) => ({
        url: `/admin/catalogs/${catalogId}/pages/${pageId}/items/${itemId}`,
        method: 'PATCH',
        body: payload,
      }),
    }),

    deleteCatalogPageItemAdmin: build.mutation<void, { catalogId: string; pageId: string; itemId: string }>({
      query: ({ catalogId, pageId, itemId }) => ({
        url: `/admin/catalogs/${catalogId}/pages/${pageId}/items/${itemId}`,
        method: 'DELETE',
      }),
    }),

    bulkAddCatalogProductsAdmin: build.mutation<{ ok: boolean; added: number }, { catalogId: string; payload: CatalogBulkAddPayload }>({
      query: ({ catalogId, payload }) => ({
        url: `/admin/catalogs/${catalogId}/add-products`,
        method: 'POST',
        body: payload,
      }),
    }),

    refreshCatalogSnapshotsAdmin: build.mutation<{ ok: boolean; refreshed: number }, string>({
      query: (catalogId) => ({
        url: `/admin/catalogs/${catalogId}/refresh-snapshots`,
        method: 'POST',
      }),
    }),

    // ── Export endpoints ──
    exportCatalogPdfAdmin: build.mutation<Blob, string>({
      query: (catalogId) => ({
        url: `/admin/exports/pdf/${catalogId}`,
        method: 'POST',
        responseHandler: (response: Response) => response.blob(),
        cache: 'no-cache',
      }),
    }),

    sendCatalogEmailAdmin: build.mutation<{ success: boolean; message: string }, { catalogId: string; payload: CatalogSendEmailPayload }>({
      query: ({ catalogId, payload }) => ({
        url: `/admin/exports/email/${catalogId}`,
        method: 'POST',
        body: payload,
      }),
    }),

    publishCatalogAdmin: build.mutation<PublishCatalogResult, string>({
      query: (catalogId) => ({
        url: `/admin/exports/publish/${catalogId}`,
        method: 'POST',
      }),
      invalidatesTags: (_r, _e, catalogId) => [{ type: 'Catalog', id: catalogId }],
    }),
  }),

  overrideExisting: false,
});

export const {
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
  usePublishCatalogAdminMutation,
} = catalogsAdminApi;
