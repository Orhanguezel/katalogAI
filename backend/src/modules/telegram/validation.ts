// src/modules/telegram/validation.ts
// KatalogAI — Telegram validation schemas
import { z } from 'zod';

/* ---------------- manual send ---------------- */

export const TelegramSendBodySchema = z.object({
  title: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(4000),
  type: z.string().trim().max(100).optional(),
  chat_id: z.string().trim().max(64).optional(),
});

export type TelegramSendBody = z.infer<typeof TelegramSendBodySchema>;

/* ---------------- event dispatcher (KatalogAI) ---------------- */

const baseEvent = z.object({
  chat_id: z.string().trim().max(64).optional(),
});

// 1) Yeni booking
const eventNewBooking = baseEvent.extend({
  event: z.literal('new_booking'),
  data: z.object({
    customer_name: z.string().trim().min(1),
    from_city: z.string().trim().min(1),
    to_city: z.string().trim().min(1),
    kg_amount: z.union([z.string(), z.number()]),
    total_price: z.union([z.string(), z.number()]),
    created_at: z.string().trim().min(1),
  }),
});

// 2) Booking onaylandi
const eventBookingConfirmed = baseEvent.extend({
  event: z.literal('booking_confirmed'),
  data: z.object({
    customer_name: z.string().trim().min(1),
    carrier_name: z.string().trim().min(1),
    from_city: z.string().trim().min(1),
    to_city: z.string().trim().min(1),
    created_at: z.string().trim().min(1),
  }),
});

// 3) Booking teslim edildi
const eventBookingDelivered = baseEvent.extend({
  event: z.literal('booking_delivered'),
  data: z.object({
    customer_name: z.string().trim().min(1),
    carrier_name: z.string().trim().min(1),
    from_city: z.string().trim().min(1),
    to_city: z.string().trim().min(1),
    total_price: z.union([z.string(), z.number()]),
    created_at: z.string().trim().min(1),
  }),
});

// 4) Booking iptal
const eventBookingCancelled = baseEvent.extend({
  event: z.literal('booking_cancelled'),
  data: z.object({
    customer_name: z.string().trim().min(1),
    from_city: z.string().trim().min(1),
    to_city: z.string().trim().min(1),
    reason: z.string().trim().optional(),
    created_at: z.string().trim().min(1),
  }),
});

// 5) Yeni ilan
const eventNewIlan = baseEvent.extend({
  event: z.literal('new_ilan'),
  data: z.object({
    carrier_name: z.string().trim().min(1),
    from_city: z.string().trim().min(1),
    to_city: z.string().trim().min(1),
    capacity_kg: z.union([z.string(), z.number()]),
    price_per_kg: z.union([z.string(), z.number()]),
    created_at: z.string().trim().min(1),
  }),
});

// 6) Yeni uye
const eventNewUser = baseEvent.extend({
  event: z.literal('new_user'),
  data: z.object({
    user_name: z.string().trim().min(1),
    user_email: z.string().trim().min(1),
    role: z.string().trim().min(1),
    created_at: z.string().trim().min(1),
  }),
});

// 7) Iletisim formu
const eventNewContact = baseEvent.extend({
  event: z.literal('new_contact'),
  data: z.object({
    customer_name: z.string().trim().min(1),
    customer_email: z.string().trim().min(1),
    customer_phone: z.string().trim().optional(),
    subject: z.string().trim().optional(),
    message: z.string().trim().min(1),
    created_at: z.string().trim().min(1),
  }),
});

// 8) Cuzdan yukleme
const eventWalletDeposit = baseEvent.extend({
  event: z.literal('wallet_deposit'),
  data: z.object({
    user_name: z.string().trim().min(1),
    amount: z.union([z.string(), z.number()]),
    created_at: z.string().trim().min(1),
  }),
});

/**
 * KatalogAI Telegram Event Body Schema
 * discriminatedUnion => TS inference works correctly
 */
export const TelegramEventBodySchema = z.discriminatedUnion('event', [
  eventNewBooking,
  eventBookingConfirmed,
  eventBookingDelivered,
  eventBookingCancelled,
  eventNewIlan,
  eventNewUser,
  eventNewContact,
  eventWalletDeposit,
]);

export type TelegramEventBody = z.infer<typeof TelegramEventBodySchema>;

/* ---------------- test ---------------- */

export const TelegramTestBodySchema = z.object({
  chat_id: z.string().trim().max(64).optional(),
});
export type TelegramTestBody = z.infer<typeof TelegramTestBodySchema>;

/* ---------------- inbound list ---------------- */

export const TelegramInboundListQuerySchema = z.object({
  chat_id: z.string().trim().max(64).optional(),
  q: z.string().trim().max(200).optional(),
  limit: z.coerce.number().int().min(1).max(200).optional(),
  cursor: z.string().trim().max(500).optional(),
});
export type TelegramInboundListQuery = z.infer<typeof TelegramInboundListQuerySchema>;

/* ---------------- autoreply ---------------- */

export const TelegramAutoReplyUpdateBodySchema = z.object({
  enabled: z.boolean().optional(),
  template: z.string().trim().min(1).max(4000).optional(),
});
export type TelegramAutoReplyUpdateBody = z.infer<typeof TelegramAutoReplyUpdateBodySchema>;

/* ---------------- webhook ---------------- */

export const TelegramWebhookBodySchema = z
  .object({
    update_id: z.number().int(),
    message: z
      .object({
        message_id: z.number().int().optional(),
        date: z.number().int().optional(),
        text: z.string().optional(),
        from: z
          .object({
            id: z.union([z.number().int(), z.string()]).optional(),
            is_bot: z.boolean().optional(),
            username: z.string().optional(),
            first_name: z.string().optional(),
            last_name: z.string().optional(),
          })
          .optional(),
        chat: z
          .object({
            id: z.union([z.number().int(), z.string()]),
            type: z.string().optional(),
            title: z.string().optional(),
            username: z.string().optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .passthrough();

export type TelegramWebhookBody = z.infer<typeof TelegramWebhookBodySchema>;
