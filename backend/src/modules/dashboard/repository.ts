// =============================================================
// FILE: src/modules/dashboard/repository.ts
// Dashboard DB sorguları
// =============================================================
import { db } from '@/db/client';
import { sql, eq, and } from 'drizzle-orm';
import {
  buildAdminDashboardSummaryItems,
  buildDashboardWalletSnapshot,
  toDashboardCount,
} from './helpers';
import { ilanlar } from '../ilanlar/schema';
import { bookings } from '../bookings/schema';
import { wallets } from '../wallet/schema';
import { users } from '../auth/schema';
import { userRoles } from '../userRoles/schema';

/* ================================================================
 * PUBLIC — Kullanıcı dashboard'ları
 * ================================================================ */

export async function repoGetCarrierDashboard(userId: string) {
  const [[activeIlanlar], [totalBookings], [pendingBookings], [pendingEarnings], wallet] = await Promise.all([
    db.select({ count: sql<number>`COUNT(*)` }).from(ilanlar)
      .where(and(eq(ilanlar.user_id, userId), eq(ilanlar.status, 'active'))),
    db.select({ count: sql<number>`COUNT(*)` }).from(bookings)
      .where(eq(bookings.carrier_id, userId)),
    db.select({ count: sql<number>`COUNT(*)` }).from(bookings)
      .where(and(eq(bookings.carrier_id, userId), eq(bookings.status, 'pending'))),
    db.select({
      total: sql<string>`COALESCE(SUM(total_price - commission_amount), 0)`,
      count: sql<number>`COUNT(*)`,
    }).from(bookings)
      .where(and(
        eq(bookings.carrier_id, userId),
        sql`${bookings.status} IN ('confirmed', 'in_transit')`,
        eq(bookings.payment_status, 'paid'),
      )),
    db.select({ balance: wallets.balance, total_earnings: wallets.total_earnings })
      .from(wallets).where(eq(wallets.user_id, userId)).limit(1),
  ]);

  const walletSnapshot = buildDashboardWalletSnapshot(wallet[0]);

  return {
    active_ilanlar: toDashboardCount(activeIlanlar?.count),
    total_bookings: toDashboardCount(totalBookings?.count),
    pending_bookings: toDashboardCount(pendingBookings?.count),
    pending_earnings: parseFloat(String(pendingEarnings?.total ?? '0')),
    pending_earnings_count: toDashboardCount(pendingEarnings?.count),
    balance: walletSnapshot.balance,
    total_earnings: walletSnapshot.total_earnings,
  };
}

export async function repoGetCustomerDashboard(userId: string) {
  const [[activeBookings], [totalBookings], wallet] = await Promise.all([
    db.select({ count: sql<number>`COUNT(*)` }).from(bookings)
      .where(and(eq(bookings.customer_id, userId), eq(bookings.status, 'confirmed'))),
    db.select({ count: sql<number>`COUNT(*)` }).from(bookings)
      .where(eq(bookings.customer_id, userId)),
    db.select({ balance: wallets.balance })
      .from(wallets).where(eq(wallets.user_id, userId)).limit(1),
  ]);

  return {
    active_bookings: toDashboardCount(activeBookings?.count),
    total_bookings: toDashboardCount(totalBookings?.count),
    balance: buildDashboardWalletSnapshot(wallet[0]).balance,
  };
}

/* ================================================================
 * ADMIN — Dashboard özet, gelir, aktivite
 * ================================================================ */

export async function repoGetAdminSummary() {
  const [[userCount], [carrierCount], [ilanCount], [bookingCount]] = await Promise.all([
    db.select({ count: sql<number>`COUNT(*)` }).from(users),
    db.select({ count: sql<number>`COUNT(*)` }).from(userRoles).where(eq(userRoles.role, 'carrier')),
    db.select({ count: sql<number>`COUNT(*)` }).from(ilanlar).where(eq(ilanlar.status, 'active')),
    db.select({ count: sql<number>`COUNT(*)` }).from(bookings),
  ]);

  return buildAdminDashboardSummaryItems({
    userCount: userCount?.count,
    carrierCount: carrierCount?.count,
    ilanCount: ilanCount?.count,
    bookingCount: bookingCount?.count,
  });
}

export async function repoGetRevenueStats() {
  const monthly = await db.execute(sql`
    SELECT
      DATE_FORMAT(created_at, '%Y-%m') AS month,
      COUNT(*)                          AS bookings,
      COALESCE(SUM(total_price), 0)     AS revenue
    FROM bookings
    WHERE status = 'delivered'
      AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
    GROUP BY month
    ORDER BY month ASC
  `);

  const topCarriers = await db
    .select({
      carrier_id: bookings.carrier_id,
      carrier_name: users.full_name,
      carrier_email: users.email,
      total_revenue: sql<string>`COALESCE(SUM(${bookings.total_price}), 0)`,
      total_bookings: sql<number>`COUNT(*)`,
    })
    .from(bookings)
    .leftJoin(users, eq(bookings.carrier_id, users.id))
    .where(eq(bookings.status, 'delivered'))
    .groupBy(bookings.carrier_id, users.full_name, users.email)
    .orderBy(sql`SUM(${bookings.total_price}) DESC`)
    .limit(10);

  return { monthly, top_carriers: topCarriers };
}

export async function repoGetActivityStats() {
  const [newUsers, newIlanlar, newBookings] = await Promise.all([
    db.execute(sql`
      SELECT DATE(created_at) AS day, COUNT(*) AS count
      FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY day ORDER BY day ASC
    `),
    db.execute(sql`
      SELECT DATE(created_at) AS day, COUNT(*) AS count
      FROM ilanlar WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY day ORDER BY day ASC
    `),
    db.execute(sql`
      SELECT DATE(created_at) AS day, COUNT(*) AS count
      FROM bookings WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY day ORDER BY day ASC
    `),
  ]);

  const [[weekUsers], [weekIlanlar], [weekBookings]] = await Promise.all([
    db.select({ count: sql<number>`COUNT(*)` }).from(users)
      .where(sql`created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`),
    db.select({ count: sql<number>`COUNT(*)` }).from(ilanlar)
      .where(sql`created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`),
    db.select({ count: sql<number>`COUNT(*)` }).from(bookings)
      .where(sql`created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`),
  ]);

  return {
    last_7_days: {
      new_users: Number(weekUsers?.count ?? 0),
      new_ilanlar: Number(weekIlanlar?.count ?? 0),
      new_bookings: Number(weekBookings?.count ?? 0),
    },
    daily: { users: newUsers, ilanlar: newIlanlar, bookings: newBookings },
  };
}
