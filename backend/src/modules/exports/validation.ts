// src/modules/exports/validation.ts

import { z } from 'zod';

export const exportPdfParamsSchema = z.object({
  catalogId: z.string().min(1),
});

export const sendCatalogEmailSchema = z.object({
  catalogId: z.string().min(1),
  to: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().max(2000).optional(),
});

export const publishCatalogSchema = z.object({
  target_slugs: z.array(z.string().min(1).max(100)).min(1).max(20),
});

export type ExportPdfParams = z.infer<typeof exportPdfParamsSchema>;
export type SendCatalogEmailInput = z.infer<typeof sendCatalogEmailSchema>;
export type PublishCatalogInput = z.infer<typeof publishCatalogSchema>;
