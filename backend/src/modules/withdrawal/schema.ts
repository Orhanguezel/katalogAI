// src/modules/withdrawal/schema.ts
import {
  mysqlTable,
  char,
  varchar,
  decimal,
  mysqlEnum,
  datetime,
  text,
  index,
  foreignKey,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { users } from "../auth/schema";
import { carrierBankAccounts } from "../carrier-bank/schema";

export const withdrawalRequests = mysqlTable(
  "withdrawal_requests",
  {
    id: char("id", { length: 36 }).primaryKey().notNull(),
    user_id: char("user_id", { length: 36 }).notNull(),
    bank_account_id: char("bank_account_id", { length: 36 }).notNull(),
    amount: decimal("amount", { precision: 14, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 10 }).notNull().default("TRY"),
    status: mysqlEnum("status", ["pending", "processing", "completed", "rejected"]).notNull().default("pending"),
    admin_notes: text("admin_notes"),
    requested_at: datetime("requested_at", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
    processed_at: datetime("processed_at", { fsp: 3 }),
  },
  (t) => [
    index("wr_user_id_idx").on(t.user_id),
    index("wr_status_idx").on(t.status),
    foreignKey({
      columns: [t.user_id],
      foreignColumns: [users.id],
      name: "fk_wr_user",
    }).onDelete("cascade").onUpdate("cascade"),
    foreignKey({
      columns: [t.bank_account_id],
      foreignColumns: [carrierBankAccounts.id],
      name: "fk_wr_bank_account",
    }).onDelete("cascade").onUpdate("cascade"),
  ]
);

export type WithdrawalRequest = typeof withdrawalRequests.$inferSelect;
export type NewWithdrawalRequest = typeof withdrawalRequests.$inferInsert;
