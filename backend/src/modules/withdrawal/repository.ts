// src/modules/withdrawal/repository.ts
import { randomUUID } from "crypto";
import { db } from "@/db/client";
import { and, desc, eq, sql } from "drizzle-orm";
import { withdrawalRequests } from "./schema";
import { users } from "../auth/schema";
import { carrierBankAccounts } from "../carrier-bank/schema";
import { wallets, walletTransactions } from "../wallet/schema";
import { getOrCreateWallet } from "../wallet/helpers";
import { repoInvalidateDashboardCache } from "@/modules/_shared";

export async function repoCreateWithdrawal(userId: string, amount: number) {
  const wallet = await getOrCreateWallet(userId);
  const balance = parseFloat(wallet.balance);
  if (balance < amount) throw new Error("insufficient_balance");

  const [bank] = await db
    .select()
    .from(carrierBankAccounts)
    .where(eq(carrierBankAccounts.user_id, userId))
    .limit(1);
  if (!bank) throw new Error("no_bank_account");

  const id = randomUUID();
  const amountStr = amount.toFixed(2);

  await db.transaction(async (tx) => {
    // Bakiyeden dus
    await tx.update(wallets)
      .set({
        balance: sql`balance - ${amount}`,
        total_withdrawn: sql`total_withdrawn + ${amount}`,
      })
      .where(eq(wallets.id, wallet.id));

    // Transaction kaydi
    await tx.insert(walletTransactions).values({
      id: randomUUID(),
      wallet_id: wallet.id,
      user_id: userId,
      type: "debit",
      amount: amountStr,
      purpose: "withdrawal",
      description: `₺${amountStr} para cekme talebi`,
      payment_status: "completed",
      transaction_ref: id,
    });

    // Withdrawal request
    await tx.insert(withdrawalRequests).values({
      id,
      user_id: userId,
      bank_account_id: bank.id,
      amount: amountStr,
      status: "pending",
    });
  });

  await repoInvalidateDashboardCache([userId]);
  return repoGetWithdrawalById(id);
}

export async function repoGetWithdrawalById(id: string) {
  const [row] = await db
    .select()
    .from(withdrawalRequests)
    .where(eq(withdrawalRequests.id, id))
    .limit(1);
  return row ?? null;
}

export async function repoListMyWithdrawals(userId: string, page: number, limit: number) {
  const offset = (page - 1) * limit;
  const [rows, [countRow]] = await Promise.all([
    db.select()
      .from(withdrawalRequests)
      .where(eq(withdrawalRequests.user_id, userId))
      .orderBy(desc(withdrawalRequests.requested_at))
      .limit(limit)
      .offset(offset),
    db.select({ total: sql<number>`COUNT(*)` })
      .from(withdrawalRequests)
      .where(eq(withdrawalRequests.user_id, userId)),
  ]);
  return { data: rows, total: Number(countRow?.total ?? 0), page, limit };
}

export async function repoListAllWithdrawals(opts: {
  status?: string;
  page: number;
  limit: number;
}) {
  const offset = (opts.page - 1) * opts.limit;
  const conditions = opts.status
    ? [eq(withdrawalRequests.status, opts.status as "pending" | "processing" | "completed" | "rejected")]
    : [];
  const where = conditions.length ? and(...conditions) : undefined;

  const [rows, [countRow]] = await Promise.all([
    db.select({
      withdrawal: withdrawalRequests,
      user_name: users.full_name,
      user_email: users.email,
      iban: carrierBankAccounts.iban,
      account_holder: carrierBankAccounts.account_holder,
      bank_name: carrierBankAccounts.bank_name,
    })
      .from(withdrawalRequests)
      .leftJoin(users, eq(withdrawalRequests.user_id, users.id))
      .leftJoin(carrierBankAccounts, eq(withdrawalRequests.bank_account_id, carrierBankAccounts.id))
      .where(where)
      .orderBy(desc(withdrawalRequests.requested_at))
      .limit(opts.limit)
      .offset(offset),
    db.select({ total: sql<number>`COUNT(*)` })
      .from(withdrawalRequests)
      .where(where),
  ]);

  return {
    data: rows.map((r) => ({
      ...r.withdrawal,
      user_name: r.user_name,
      user_email: r.user_email,
      iban: r.iban,
      account_holder: r.account_holder,
      bank_name: r.bank_name,
    })),
    total: Number(countRow?.total ?? 0),
    page: opts.page,
    limit: opts.limit,
  };
}

export async function repoProcessWithdrawal(
  id: string,
  status: "completed" | "rejected",
  adminNotes?: string,
) {
  const wr = await repoGetWithdrawalById(id);
  if (!wr) throw new Error("not_found");
  if (wr.status !== "pending" && wr.status !== "processing") throw new Error("already_processed");

  if (status === "rejected") {
    // Bakiye geri yaz
    const wallet = await getOrCreateWallet(wr.user_id);
    const amount = parseFloat(wr.amount);

    await db.transaction(async (tx) => {
      await tx.update(wallets)
        .set({
          balance: sql`balance + ${amount}`,
          total_withdrawn: sql`total_withdrawn - ${amount}`,
        })
        .where(eq(wallets.id, wallet.id));

      await tx.insert(walletTransactions).values({
        id: randomUUID(),
        wallet_id: wallet.id,
        user_id: wr.user_id,
        type: "credit",
        amount: wr.amount,
        purpose: "withdrawal_refund",
        description: `₺${wr.amount} cekim talebi reddedildi${adminNotes ? `: ${adminNotes}` : ""}`,
        payment_status: "completed",
        transaction_ref: id,
      });

      await tx.update(withdrawalRequests)
        .set({
          status: "rejected",
          admin_notes: adminNotes ?? null,
          processed_at: new Date(),
        })
        .where(eq(withdrawalRequests.id, id));
    });

    await repoInvalidateDashboardCache([wr.user_id]);
  } else {
    // completed — bakiye zaten dustu, sadece isaretle
    await db.update(withdrawalRequests)
      .set({
        status: "completed",
        admin_notes: adminNotes ?? null,
        processed_at: new Date(),
      })
      .where(eq(withdrawalRequests.id, id));
  }

  return repoGetWithdrawalById(id);
}
