// src/modules/withdrawal/controller.ts
import type { RouteHandler } from "fastify";
import { getAuthUserId, handleRouteError, parsePage } from "@/modules/_shared";
import { createWithdrawalSchema } from "./validation";
import { repoCreateWithdrawal, repoListMyWithdrawals } from "./repository";

export const createWithdrawal: RouteHandler = async (req, reply) => {
  try {
    const userId = getAuthUserId(req);
    const { amount } = createWithdrawalSchema.parse(req.body);
    const wr = await repoCreateWithdrawal(userId, amount);
    return reply.send(wr);
  } catch (e) {
    const msg = (e as Error).message;
    if (msg === "insufficient_balance") return reply.code(400).send({ error: { message: "insufficient_balance" } });
    if (msg === "no_bank_account") return reply.code(400).send({ error: { message: "no_bank_account" } });
    return handleRouteError(reply, req, e, "withdrawal_create");
  }
};

export const listMyWithdrawals: RouteHandler = async (req, reply) => {
  try {
    const userId = getAuthUserId(req);
    const { page, limit } = parsePage(req.query as Record<string, string>);
    const result = await repoListMyWithdrawals(userId, page, limit);
    reply.header("x-total-count", result.total);
    return reply.send(result);
  } catch (e) {
    return handleRouteError(reply, req, e, "withdrawal_list_my");
  }
};
