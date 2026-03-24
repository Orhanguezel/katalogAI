-- =============================================================
-- FILE: src/db/seed/sql/111_gallery_schema.sql
-- DESCRIPTION: KatalogAI — galleries + gallery_i18n + gallery_images + gallery_image_i18n
-- Bağımlılık: 94_storage_assets.sql
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `galleries` (
  `id`               CHAR(36)     NOT NULL,
  `module_key`       VARCHAR(64)  NOT NULL DEFAULT 'general',
  `source_id`        CHAR(36)     DEFAULT NULL,
  `source_type`      VARCHAR(32)  NOT NULL DEFAULT 'standalone',
  `is_active`        TINYINT(1)   NOT NULL DEFAULT 1,
  `is_featured`      TINYINT(1)   NOT NULL DEFAULT 0,
  `display_order`    INT          NOT NULL DEFAULT 0,
  `created_at`       DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`       DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `galleries_module_idx`   (`module_key`),
  KEY `galleries_active_idx`   (`is_active`),
  KEY `galleries_featured_idx` (`is_featured`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `gallery_i18n` (
  `gallery_id`       CHAR(36)     NOT NULL,
  `locale`           VARCHAR(8)   NOT NULL DEFAULT 'tr',
  `title`            VARCHAR(255) NOT NULL,
  `slug`             VARCHAR(255) NOT NULL,
  `description`      TEXT         DEFAULT NULL,
  `meta_title`       VARCHAR(255) DEFAULT NULL,
  `meta_description` VARCHAR(500) DEFAULT NULL,
  `created_at`       DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`       DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`gallery_id`, `locale`),
  UNIQUE KEY `gallery_i18n_slug_locale_uq` (`slug`, `locale`),
  CONSTRAINT `fk_gallery_i18n_gallery`
    FOREIGN KEY (`gallery_id`) REFERENCES `galleries` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `gallery_images` (
  `id`               CHAR(36)     NOT NULL,
  `gallery_id`       CHAR(36)     NOT NULL,
  `storage_asset_id` CHAR(36)     DEFAULT NULL,
  `image_url`        LONGTEXT     DEFAULT NULL,
  `display_order`    INT          NOT NULL DEFAULT 0,
  `is_cover`         TINYINT(1)   NOT NULL DEFAULT 0,
  `created_at`       DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `gallery_images_gallery_idx`  (`gallery_id`),
  KEY `gallery_images_order_idx`    (`display_order`),
  CONSTRAINT `fk_gallery_images_gallery`
    FOREIGN KEY (`gallery_id`) REFERENCES `galleries` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `gallery_image_i18n` (
  `image_id`   CHAR(36)     NOT NULL,
  `locale`     VARCHAR(8)   NOT NULL DEFAULT 'tr',
  `alt`        VARCHAR(255) DEFAULT NULL,
  `caption`    VARCHAR(500) DEFAULT NULL,
  `description` TEXT        DEFAULT NULL,
  `created_at` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`image_id`, `locale`),
  CONSTRAINT `fk_gallery_image_i18n_image`
    FOREIGN KEY (`image_id`) REFERENCES `gallery_images` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
