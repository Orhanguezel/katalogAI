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

export type ExportPdfParams = z.infer<typeof exportPdfParamsSchema>;
export type SendCatalogEmailInput = z.infer<typeof sendCatalogEmailSchema>;
