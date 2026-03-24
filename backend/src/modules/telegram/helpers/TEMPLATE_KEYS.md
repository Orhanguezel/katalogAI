# KatalogAI — Telegram Template Keys

`site_settings` keys used by `src/modules/telegram`:

## Required base keys
- `telegram_notifications_enabled` (`true|false`)
- `telegram_webhook_enabled` (`true|false`)
- `telegram_bot_token`
- `telegram_default_chat_id`

## Event enable flags
- `telegram_event_new_booking_enabled`
- `telegram_event_booking_confirmed_enabled`
- `telegram_event_booking_delivered_enabled`
- `telegram_event_booking_cancelled_enabled`
- `telegram_event_new_ilan_enabled`
- `telegram_event_new_user_enabled`
- `telegram_event_new_contact_enabled`
- `telegram_event_wallet_deposit_enabled`

## Event templates
- `telegram_template_new_booking`
- `telegram_template_booking_confirmed`
- `telegram_template_booking_delivered`
- `telegram_template_booking_cancelled`
- `telegram_template_new_ilan`
- `telegram_template_new_user`
- `telegram_template_new_contact`
- `telegram_template_wallet_deposit`

## Placeholders by event
- `new_booking`: `customer_name`, `from_city`, `to_city`, `kg_amount`, `total_price`, `created_at`
- `booking_confirmed`: `customer_name`, `carrier_name`, `from_city`, `to_city`, `created_at`
- `booking_delivered`: `customer_name`, `carrier_name`, `from_city`, `to_city`, `total_price`, `created_at`
- `booking_cancelled`: `customer_name`, `from_city`, `to_city`, `reason`, `created_at`
- `new_ilan`: `carrier_name`, `from_city`, `to_city`, `capacity_kg`, `price_per_kg`, `created_at`
- `new_user`: `user_name`, `user_email`, `role`, `created_at`
- `new_contact`: `customer_name`, `customer_email`, `customer_phone`, `subject`, `message`, `created_at`
- `wallet_deposit`: `user_name`, `amount`, `created_at`

## Notes
- Generic notifications (`title + message`) do not require template keys.
- Values can be set with locale `*` for global defaults.
- Markdown parse mode is enabled in Telegram send.
