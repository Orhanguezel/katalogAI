// =============================================================
// FILE: src/integrations/endpoints/admin/product-sources-admin-endpoints.ts
// KatalogAI — Admin Product Sources RTK Endpoints
// =============================================================

import { baseApi } from '@/integrations/base-api';
import type {
  ProductSourceCreatePayload,
  ProductSourceDto,
  ProductSourceImportPayload,
  ProductSourceImportResult,
  ProductSourceListQueryParams,
  ProductSourceTestResult,
  ProductSourceUpdatePayload,
  SourceCategoriesResponse,
  SourceProductsQueryParams,
  SourceProductsResponse,
} from '@/integrations/shared';
import { cleanParams } from '@/integrations/shared';

export const productSourcesAdminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listProductSourcesAdmin: build.query<ProductSourceDto[], ProductSourceListQueryParams | void>({
      query: (params) => ({
        url: '/admin/product-sources/list',
        method: 'GET',
        params: cleanParams(params as Record<string, unknown> | undefined),
      }),
      transformResponse: (raw: unknown) => {
        if (Array.isArray(raw)) return raw as ProductSourceDto[];
        const obj = raw as { rows?: ProductSourceDto[]; items?: ProductSourceDto[] } | undefined;
        return obj?.rows ?? obj?.items ?? [];
      },
      providesTags: ['ProductSources'],
    }),

    getProductSourceAdmin: build.query<ProductSourceDto, string>({
      query: (id) => ({
        url: `/admin/product-sources/${id}`,
        method: 'GET',
      }),
      providesTags: (_r, _e, id) => [{ type: 'ProductSource', id }],
    }),

    createProductSourceAdmin: build.mutation<ProductSourceDto, ProductSourceCreatePayload>({
      query: (body) => ({
        url: '/admin/product-sources',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ProductSources'],
    }),

    updateProductSourceAdmin: build.mutation<ProductSourceDto, { id: string; patch: ProductSourceUpdatePayload }>({
      query: ({ id, patch }) => ({
        url: `/admin/product-sources/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_r, _e, { id }) => ['ProductSources', { type: 'ProductSource', id }],
    }),

    deleteProductSourceAdmin: build.mutation<void, string>({
      query: (id) => ({
        url: `/admin/product-sources/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ProductSources'],
    }),

    testProductSourceAdmin: build.mutation<ProductSourceTestResult, string>({
      query: (id) => ({
        url: `/admin/product-sources/${id}/test`,
        method: 'POST',
      }),
    }),

    getSourceCategoriesAdmin: build.query<SourceCategoriesResponse, { id: string; locale?: string }>({
      query: ({ id, locale }) => ({
        url: `/admin/product-sources/${id}/categories`,
        method: 'GET',
        params: cleanParams(locale ? { locale } : undefined),
      }),
    }),

    getSourceProductsAdmin: build.query<SourceProductsResponse, { id: string } & SourceProductsQueryParams>({
      query: ({ id, ...params }) => ({
        url: `/admin/product-sources/${id}/products`,
        method: 'GET',
        params: cleanParams(params as Record<string, unknown>),
      }),
    }),

    importProductSourceAdmin: build.mutation<ProductSourceImportResult, { id: string; payload: ProductSourceImportPayload }>({
      query: ({ id, payload }) => ({
        url: `/admin/product-sources/${id}/import`,
        method: 'POST',
        body: payload,
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
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
} = productSourcesAdminApi;
