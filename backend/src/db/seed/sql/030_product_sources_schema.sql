-- ================================================================
-- 030 — product_sources + source_products schema & seed
-- ================================================================

CREATE TABLE IF NOT EXISTS `product_sources` (
  `id`                CHAR(36)     NOT NULL,
  `name`              VARCHAR(100) NOT NULL,
  `slug`              VARCHAR(100) NOT NULL,
  `source_type`       VARCHAR(20)  NOT NULL DEFAULT 'database',
  `db_host`           VARCHAR(255) DEFAULT NULL,
  `db_port`           INT          DEFAULT 3306,
  `db_name`           VARCHAR(100) DEFAULT NULL,
  `db_user`           VARCHAR(100) DEFAULT NULL,
  `db_password`       VARCHAR(500) DEFAULT NULL,
  `default_locale`    VARCHAR(8)   DEFAULT 'de',
  `has_subcategories` TINYINT(1)   DEFAULT 0,
  `image_base_url`    VARCHAR(500) DEFAULT NULL,
  `is_active`         TINYINT(1)   DEFAULT 1,
  `connection_limit`  INT          DEFAULT 5,
  `brand_title`       VARCHAR(255) DEFAULT NULL,
  `brand_subtitle`    VARCHAR(500) DEFAULT NULL,
  `brand_logo_url`    TEXT         DEFAULT NULL,
  `brand_contact`     JSON         DEFAULT NULL,
  `created_at`        DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`        DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `product_sources_slug_uq` (`slug`),
  INDEX `product_sources_active_idx` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `source_products` (
  `id`               CHAR(36)     NOT NULL,
  `source_id`        CHAR(36)     NOT NULL,
  `external_id`      VARCHAR(100) DEFAULT NULL,
  `title`            VARCHAR(255) NOT NULL,
  `description`      TEXT         DEFAULT NULL,
  `image_url`        TEXT         DEFAULT NULL,
  `images`           JSON         DEFAULT NULL,
  `price`            DECIMAL(10,2) DEFAULT NULL,
  `product_code`     VARCHAR(64)  DEFAULT NULL,
  `category_name`    VARCHAR(255) DEFAULT NULL,
  `subcategory_name` VARCHAR(255) DEFAULT NULL,
  `locale`           VARCHAR(8)   DEFAULT 'de',
  `specs`            JSON         DEFAULT NULL,
  `tags`             JSON         DEFAULT NULL,
  `is_active`        TINYINT(1)   DEFAULT 1,
  `created_at`       DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`       DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `source_products_source_idx` (`source_id`),
  INDEX `source_products_external_idx` (`source_id`, `external_id`),
  INDEX `source_products_active_idx` (`is_active`),
  CONSTRAINT `fk_source_products_source` FOREIGN KEY (`source_id`)
    REFERENCES `product_sources` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── catalogs ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `catalogs` (
  `id`              CHAR(36)     NOT NULL,
  `title`           VARCHAR(255) NOT NULL,
  `slug`            VARCHAR(255) NOT NULL,
  `status`          VARCHAR(20)  NOT NULL DEFAULT 'draft',
  `brand_name`      VARCHAR(255) DEFAULT NULL,
  `season`          VARCHAR(100) DEFAULT NULL,
  `contact_info`    JSON         DEFAULT NULL,
  `logo_url`        TEXT         DEFAULT NULL,
  `cover_image_url` TEXT         DEFAULT NULL,
  `locale`          VARCHAR(8)   DEFAULT 'de',
  `color_theme`     VARCHAR(50)  DEFAULT 'emerald',
  `font_family`     VARCHAR(100) DEFAULT 'DM Sans',
  `accent_color`    VARCHAR(20)  DEFAULT NULL,
  `page_count`      INT          DEFAULT 0,
  `product_count`   INT          DEFAULT 0,
  `created_by`      CHAR(36)     DEFAULT NULL,
  `created_at`      DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`      DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `catalogs_slug_uq` (`slug`),
  INDEX `catalogs_status_idx` (`status`),
  INDEX `catalogs_created_by_idx` (`created_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── catalog_pages ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `catalog_pages` (
  `id`               CHAR(36)    NOT NULL,
  `catalog_id`       CHAR(36)    NOT NULL,
  `page_number`      INT         NOT NULL,
  `layout_type`      VARCHAR(20) DEFAULT '2x2',
  `background_color` VARCHAR(20) DEFAULT NULL,
  `created_at`       DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`       DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `catalog_pages_catalog_page_uq` (`catalog_id`, `page_number`),
  INDEX `catalog_pages_catalog_idx` (`catalog_id`),
  CONSTRAINT `fk_catalog_pages_catalog` FOREIGN KEY (`catalog_id`)
    REFERENCES `catalogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── catalog_page_items ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `catalog_page_items` (
  `id`                     CHAR(36)      NOT NULL,
  `page_id`                CHAR(36)      NOT NULL,
  `slot_index`             INT           NOT NULL,
  `source_id`              CHAR(36)      DEFAULT NULL,
  `source_product_id`      CHAR(36)      DEFAULT NULL,
  `snapshot_title`         VARCHAR(255)  NOT NULL,
  `snapshot_description`   TEXT          DEFAULT NULL,
  `snapshot_image_url`     TEXT          DEFAULT NULL,
  `snapshot_images`        JSON          DEFAULT NULL,
  `snapshot_price`         DECIMAL(10,2) DEFAULT NULL,
  `snapshot_category_name` VARCHAR(255)  DEFAULT NULL,
  `snapshot_specs`         JSON          DEFAULT NULL,
  `snapshot_locale`        VARCHAR(8)    DEFAULT NULL,
  `override_title`         VARCHAR(255)  DEFAULT NULL,
  `override_description`   TEXT          DEFAULT NULL,
  `override_image_url`     TEXT          DEFAULT NULL,
  `override_price`         DECIMAL(10,2) DEFAULT NULL,
  `display_order`          INT           DEFAULT 0,
  `created_at`             DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`             DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `catalog_page_items_page_idx` (`page_id`),
  INDEX `catalog_page_items_source_idx` (`source_id`),
  CONSTRAINT `fk_catalog_page_items_page` FOREIGN KEY (`page_id`)
    REFERENCES `catalog_pages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Seed: Bereket Fide kaynak (env: SOURCE_BEREKETFIDE_*) ────────
INSERT INTO `product_sources` (`id`, `name`, `slug`, `source_type`, `db_host`, `db_port`, `db_name`, `db_user`, `db_password`, `default_locale`, `has_subcategories`, `image_base_url`, `is_active`, `connection_limit`, `brand_title`, `brand_subtitle`, `brand_logo_url`, `brand_contact`)
VALUES (
  'a1000001-0001-4000-8000-000000000001',
  'Bereket Fide',
  'bereketfide',
  'database',
  '{{SOURCE_BEREKETFIDE_DB_HOST}}',
  {{SOURCE_BEREKETFIDE_DB_PORT}},
  '{{SOURCE_BEREKETFIDE_DB_NAME}}',
  '{{SOURCE_BEREKETFIDE_DB_USER}}',
  '{{SOURCE_BEREKETFIDE_DB_PASSWORD}}',
  'tr',
  1,
  'http://localhost:8078',
  1,
  5,
  'Bereket Fide Tarım A.Ş.',
  'Profesyonel Fide Üretim Kataloğu',
  'http://localhost:8078/uploads/bereketfide-logo/logo-23_51_59.png',
  '{"phone":"+90 242 000 00 00","email":"info@bereketfide.com.tr","website":"https://www.bereketfide.com.tr","address":"Antalya, Türkiye"}'
) ON DUPLICATE KEY UPDATE
  `db_host` = VALUES(`db_host`),
  `db_port` = VALUES(`db_port`),
  `db_name` = VALUES(`db_name`),
  `db_user` = VALUES(`db_user`),
  `db_password` = VALUES(`db_password`),
  `image_base_url` = VALUES(`image_base_url`),
  `brand_title` = VALUES(`brand_title`),
  `brand_subtitle` = VALUES(`brand_subtitle`),
  `brand_logo_url` = VALUES(`brand_logo_url`),
  `brand_contact` = VALUES(`brand_contact`);

-- ── Seed: VistaSeed kaynak (env: SOURCE_VISTASEED_*) ─────────────
INSERT INTO `product_sources` (`id`, `name`, `slug`, `source_type`, `db_host`, `db_port`, `db_name`, `db_user`, `db_password`, `default_locale`, `has_subcategories`, `image_base_url`, `is_active`, `connection_limit`, `brand_title`, `brand_subtitle`, `brand_logo_url`, `brand_contact`)
VALUES (
  'a1000001-0001-4000-8000-000000000002',
  'Vista Seed',
  'vistaseed',
  'database',
  '{{SOURCE_VISTASEED_DB_HOST}}',
  {{SOURCE_VISTASEED_DB_PORT}},
  '{{SOURCE_VISTASEED_DB_NAME}}',
  '{{SOURCE_VISTASEED_DB_USER}}',
  '{{SOURCE_VISTASEED_DB_PASSWORD}}',
  'tr',
  1,
  'http://localhost:8078',
  1,
  5,
  'Vista Seed',
  'Tohum Çeşitleri Kataloğu',
  NULL,
  '{"website":"https://www.vistaseeds.com.tr"}'
) ON DUPLICATE KEY UPDATE
  `db_host` = VALUES(`db_host`),
  `db_port` = VALUES(`db_port`),
  `db_name` = VALUES(`db_name`),
  `db_user` = VALUES(`db_user`),
  `db_password` = VALUES(`db_password`),
  `image_base_url` = VALUES(`image_base_url`),
  `brand_title` = VALUES(`brand_title`),
  `brand_subtitle` = VALUES(`brand_subtitle`),
  `brand_logo_url` = VALUES(`brand_logo_url`),
  `brand_contact` = VALUES(`brand_contact`);

-- ── Seed: Vista İnşaat kaynak ──────────────────────────────────
INSERT INTO `product_sources` (`id`, `name`, `slug`, `source_type`, `db_host`, `db_port`, `db_name`, `db_user`, `db_password`, `default_locale`, `has_subcategories`, `image_base_url`, `is_active`, `connection_limit`, `brand_title`, `brand_subtitle`, `brand_logo_url`, `brand_contact`)
VALUES (
  'a1000001-0001-4000-8000-000000000003',
  'Vista İnşaat',
  'vistainsaat',
  'database',
  '127.0.0.1', 3306, 'vistainsaat', 'app', 'app',
  'tr', 1, 'http://localhost:8078', 1, 5,
  'Vista İnşaat',
  'İnşaat Malzemeleri Kataloğu',
  NULL,
  '{"website":"https://www.vistainsaat.com"}'
) ON DUPLICATE KEY UPDATE
  `brand_title` = VALUES(`brand_title`),
  `brand_subtitle` = VALUES(`brand_subtitle`),
  `brand_contact` = VALUES(`brand_contact`);

-- ── Seed: ENSOTEK kaynak ───────────────────────────────────────
INSERT INTO `product_sources` (`id`, `name`, `slug`, `source_type`, `db_host`, `db_port`, `db_name`, `db_user`, `db_password`, `default_locale`, `has_subcategories`, `image_base_url`, `is_active`, `connection_limit`, `brand_title`, `brand_subtitle`, `brand_logo_url`, `brand_contact`)
VALUES (
  'a1000001-0001-4000-8000-000000000004',
  'ENSOTEK',
  'ensotek',
  'database',
  '127.0.0.1', 3306, 'ensotek', 'app', 'app',
  'tr', 1, 'http://localhost:8078', 1, 5,
  'ENSOTEK Su Soğutma Kuleleri',
  'Endüstriyel Ürün Kataloğu',
  NULL,
  '{"website":"https://www.ensotek.de"}'
) ON DUPLICATE KEY UPDATE
  `brand_title` = VALUES(`brand_title`),
  `brand_subtitle` = VALUES(`brand_subtitle`),
  `brand_contact` = VALUES(`brand_contact`);
