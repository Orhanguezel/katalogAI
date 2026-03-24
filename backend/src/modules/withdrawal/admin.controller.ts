// src/modules/withdrawal/admin.controller.ts
import type { RouteHandler } from "fastify";
import { handleRouteError, parsePage } from "@/modules/_shared";
import { processWithdrawalSchema } from "./validation";
import { repoListAllWithdrawals, repoProcessWithdrawal } from "./repository";

export const adminListWithdrawals: RouteHandler = async (req, reply) => {
  try {
    const q = req.query as Record<string, string>;
    const { page, limit } = parsePage(q);
    const result = await repoListAllWithdrawals({ status: q.status, page, limit });
    reply.header("x-total-count", result.total);
    return reply.send(result);
  } catch (e) {
    return handleRouteError(reply, req, e, "admin_withdrawal_list");
  }
};

export const adminProcessWithdrawal: RouteHandler = async (req, reply) => {
  try {
    const { id } = req.params as { id: string };
    const { status, admin_notes } = processWithdrawalSchema.parse(req.body);
    const wr = await repoProcessWithdrawal(id, status, admin_notes);
    return reply.send(wr);
  } catch (e) {
    const msg = (e as Error).message;
    if (msg === "not_found") return reply.code(404).send({ error: { message: "not_found" } });
    if (msg === "already_processed") return reply.code(400).send({ error: { message: "already_processed" } });
    return handleRouteError(reply, req, e, "admin_withdrawal_process");
  }
};
