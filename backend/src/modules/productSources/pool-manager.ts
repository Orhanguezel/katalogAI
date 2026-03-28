// src/modules/productSources/pool-manager.ts

import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import type { MySql2Database } from 'drizzle-orm/mysql2';

type SourceConnectionConfig = {
  id: string;
  db_host: string;
  db_port: number;
  db_name: string;
  db_user: string;
  db_password: string;
  connection_limit: number;
};

type PoolEntry = {
  pool: mysql.Pool;
  drizzle: MySql2Database<Record<string, never>>;
};

const pools = new Map<string, PoolEntry>();

/** Lazy pool: ilk cagrildiginda olusturulur, sonra cache'ten doner */
export function getSourceConnection(source: SourceConnectionConfig): PoolEntry {
  const existing = pools.get(source.id);
  if (existing) return existing;

  const pool = mysql.createPool({
    host: source.db_host,
    port: source.db_port,
    user: source.db_user,
    password: source.db_password,
    database: source.db_name,
    connectionLimit: source.connection_limit,
    supportBigNumbers: true,
    dateStrings: true,
  });

  const db = drizzle(pool) as unknown as MySql2Database<Record<string, never>>;
  const entry: PoolEntry = { pool, drizzle: db };
  pools.set(source.id, entry);
  return entry;
}

/** Tek bir kaynagin pool'unu kapatir */
export async function closeSourceConnection(sourceId: string): Promise<void> {
  const entry = pools.get(sourceId);
  if (!entry) return;
  await entry.pool.end();
  pools.delete(sourceId);
}

/** Tum kaynak pool'larini kapatir (graceful shutdown icin) */
export async function closeAllSourceConnections(): Promise<void> {
  const tasks = [...pools.entries()].map(async ([id, entry]) => {
    await entry.pool.end();
    pools.delete(id);
  });
  await Promise.all(tasks);
}
