// src/modules/withdrawal/validation.ts
import { z } from "zod";

export const createWithdrawalSchema = z.object({
  amount: z.number().positive("Tutar 0'dan buyuk olmali"),
});

export const processWithdrawalSchema = z.object({
  status: z.enum(["completed", "rejected"]),
  admin_notes: z.string().optional(),
});
