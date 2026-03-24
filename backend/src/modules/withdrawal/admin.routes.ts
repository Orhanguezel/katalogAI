// src/modules/withdrawal/admin.routes.ts
import type { FastifyInstance } from "fastify";
import { adminListWithdrawals, adminProcessWithdrawal } from "./admin.controller";

export async function registerWithdrawalAdmin(app: FastifyInstance) {
  const B = "/withdrawals";
  app.get(B, adminListWithdrawals);
  app.put(`${B}/:id/process`, adminProcessWithdrawal);
}
