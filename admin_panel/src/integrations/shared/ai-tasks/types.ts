// src/integrations/shared/ai-tasks/types.ts

export interface AiEnhanceDescriptionPayload {
  title: string;
  description?: string;
  category?: string;
  specs?: Record<string, string>;
  locale?: string;
}

export interface AiTranslatePayload {
  text: string;
  target_locale: string;
}

export interface AiSeoSuggestPayload {
  title: string;
  brand_name?: string;
  season?: string;
  locale?: string;
  product_count?: number;
}

export interface AiTextResult {
  result: string;
}

export interface AiSeoResult {
  result: {
    title: string;
    description: string;
    keywords: string[];
  };
}
