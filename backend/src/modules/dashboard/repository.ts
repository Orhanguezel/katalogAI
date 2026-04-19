// =============================================================
// FILE: src/modules/dashboard/repository.ts
// Dashboard DB sorguları — KatalogAI
// =============================================================
import { db } from '@/db/client';
import { sql } from 'drizzle-orm';
import { buildAdminDashboardSummaryItems } from './helpers';
import { users } from '@agro/shared-backend/modules/auth';
import { catalogs } from '../catalogs/schema';
import { productSources } from '../productSources/schema';

/* ================================================================
 * ADMIN — Dashboard özet
 * ================================================================ */

export async function repoGetAdminSummary() {
  const [[userCount], [catalogCount], [sourceCount]] = await Promise.all([
    db.select({ count: sql<number>`COUNT(*)` }).from(users),
    db.select({ count: sql<number>`COUNT(*)` }).from(catalogs),
    db.select({ count: sql<number>`COUNT(*)` }).from(productSources),
  ]);

  return buildAdminDashboardSummaryItems({
    userCount: userCount?.count,
    catalogCount: catalogCount?.count,
    productSourceCount: sourceCount?.count,
  });
}
