// =============================================================
// FILE: src/integrations/endpoints/admin/ai-tasks-admin-endpoints.ts
// KatalogAI — Admin AI Tasks RTK Endpoints
// =============================================================

import { baseApi } from '@/integrations/base-api';
import type {
  AiEnhanceDescriptionPayload,
  AiSeoResult,
  AiSeoSuggestPayload,
  AiTextResult,
  AiTranslatePayload,
} from '@/integrations/shared';

export const aiTasksAdminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    aiEnhanceDescriptionAdmin: build.mutation<AiTextResult, AiEnhanceDescriptionPayload>({
      query: (body) => ({
        url: '/admin/ai/enhance-description',
        method: 'POST',
        body,
      }),
    }),

    aiTranslateAdmin: build.mutation<AiTextResult, AiTranslatePayload>({
      query: (body) => ({
        url: '/admin/ai/translate',
        method: 'POST',
        body,
      }),
    }),

    aiSeoSuggestAdmin: build.mutation<AiSeoResult, AiSeoSuggestPayload>({
      query: (body) => ({
        url: '/admin/ai/seo-suggest',
        method: 'POST',
        body,
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useAiEnhanceDescriptionAdminMutation,
  useAiTranslateAdminMutation,
  useAiSeoSuggestAdminMutation,
} = aiTasksAdminApi;
