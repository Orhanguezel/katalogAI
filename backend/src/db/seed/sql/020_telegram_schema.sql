-- =============================================================
-- FILE: src/db/seed/sql/112_telegram_schema.sql
-- DESCRIPTION: KatalogAI — telegram_inbound_messages tablosu
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `telegram_inbound_messages` (
  `id`           CHAR(36)     NOT NULL,
  `update_id`    INT          NOT NULL,
  `message_id`   INT          DEFAULT NULL,
  `chat_id`      VARCHAR(64)  NOT NULL,
  `chat_type`    VARCHAR(32)  DEFAULT NULL,
  `chat_title`   VARCHAR(255) DEFAULT NULL,
  `chat_username` VARCHAR(255) DEFAULT NULL,
  `from_id`      VARCHAR(64)  DEFAULT NULL,
  `from_username` VARCHAR(255) DEFAULT NULL,
  `from_name`    VARCHAR(255) DEFAULT NULL,
  `text`         TEXT         DEFAULT NULL,
  `raw`          LONGTEXT     DEFAULT NULL,
  `processed`    TINYINT(1)   NOT NULL DEFAULT 0,
  `created_at`   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `telegram_update_id_uq` (`update_id`),
  KEY `telegram_chat_id_idx`    (`chat_id`),
  KEY `telegram_processed_idx`  (`processed`),
  KEY `telegram_created_idx`    (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
