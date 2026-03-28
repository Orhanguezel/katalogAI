// src/modules/aiTasks/validation.ts

import { z } from 'zod';

export const enhanceDescriptionSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
  specs: z.record(z.string()).optional(),
  locale: z.string().optional(),
});

export const translateSchema = z.object({
  text: z.string().min(1).max(5000),
  target_locale: z.string().min(2).max(8),
});

export const seoSuggestSchema = z.object({
  title: z.string().min(1),
  brand_name: z.string().optional(),
  season: z.string().optional(),
  locale: z.string().optional(),
  product_count: z.number().optional(),
});

export type EnhanceDescriptionInput = z.infer<typeof enhanceDescriptionSchema>;
export type TranslateInput = z.infer<typeof translateSchema>;
export type SeoSuggestInput = z.infer<typeof seoSuggestSchema>;
