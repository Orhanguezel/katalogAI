// src/modules/telegram/settings-helpers.ts
// Telegram settings parser/config helpers.

import { toBool } from '@/modules/_shared';

export type TelegramEvent =
  | 'new_booking'
  | 'booking_confirmed'
  | 'booking_delivered'
  | 'booking_cancelled'
  | 'new_ilan'
  | 'new_user'
  | 'new_contact'
  | 'wallet_deposit';

export type TelegramSettings = {
  enabled: boolean;
  webhookEnabled: boolean;
  botToken: string;
  defaultChatId: string | null;
  legacyChatId: string | null;
  events: Partial<Record<TelegramEvent, boolean>>;
  templates: Partial<Record<TelegramEvent, string>>;
};

export const TELEGRAM_EVENTS: TelegramEvent[] = [
  'new_booking',
  'booking_confirmed',
  'booking_delivered',
  'booking_cancelled',
  'new_ilan',
  'new_user',
  'new_contact',
  'wallet_deposit',
];

export function toTelegramBool(v: string | null | undefined, fallback = false): boolean {
  if (v == null) return fallback;
  const s = String(v).trim();
  if (!s) return fallback;
  return toBool(s);
}

export function toTelegramText(v: string | null | undefined): string {
  return String(v ?? '').trim();
}
