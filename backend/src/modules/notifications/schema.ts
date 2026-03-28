// src/modules/notifications/schema.ts
import {
  mysqlTable,
  char,
  varchar,
  text,
  boolean,
  datetime,
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export const notifications = mysqlTable('notifications', {
  id: char('id', { length: 36 }).primaryKey().notNull(),
  user_id: char('user_id', { length: 36 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message'),
  type: varchar('type', { length: 50 }).notNull(),
  is_read: boolean('is_read').default(false).notNull(),
  created_at: datetime('created_at').default(sql`NOW()`).notNull(),
});

export type Notification = InferSelectModel<typeof notifications>;
export type NotificationInsert = InferInsertModel<typeof notifications>;
