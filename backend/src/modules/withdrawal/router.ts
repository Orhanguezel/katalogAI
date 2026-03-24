// src/modules/withdrawal/router.ts
import type { FastifyInstance } from "fastify";
import { createWithdrawal, listMyWithdrawals } from "./controller";
import { requireAuth } from "@/common/middleware/auth";

export async function registerWithdrawal(app: FastifyInstance) {
  const B = "/withdrawal";
  const auth = { preHandler: [requireAuth] };
  app.post(B, auth, createWithdrawal);
  app.get(`${B}/my`, auth, listMyWithdrawals);
}
