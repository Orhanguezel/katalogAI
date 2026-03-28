// src/modules/profiles/schema.ts
import {
  mysqlTable,
  char,
  varchar,
  text,
  datetime,
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export const profiles = mysqlTable('profiles', {
  id: char('id', { length: 36 }).primaryKey().notNull(),
  full_name: varchar('full_name', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  avatar_url: text('avatar_url'),
  bio: text('bio'),
  created_at: datetime('created_at').default(sql`NOW()`).notNull(),
  updated_at: datetime('updated_at').default(sql`NOW()`).notNull(),
});

export type Profile = InferSelectModel<typeof profiles>;
export type NewProfile = InferInsertModel<typeof profiles>;
