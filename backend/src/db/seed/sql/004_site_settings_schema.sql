-- =============================================================
-- 004 — site_settings schema + KatalogAI seed data
-- =============================================================

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `site_settings`;

CREATE TABLE `site_settings` (
  `id` CHAR(36) NOT NULL,
  `key` VARCHAR(100) NOT NULL,
  `locale` VARCHAR(8) NOT NULL DEFAULT '*',
  `value` MEDIUMTEXT NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `site_settings_key_locale_uq` (`key`, `locale`),
  KEY `site_settings_key_idx` (`key`),
  KEY `site_settings_locale_idx` (`locale`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── KatalogAI temel ayarlar ─────────────────────────────────────

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'brand_name',       '*', '"KatalogAI"'),
(UUID(), 'brand_subtitle',   '*', '"Profesyonel Katalog Oluşturma Platformu"'),
(UUID(), 'brand_short_name', '*', '"KatalogAI"'),
(UUID(), 'topbar_slogan',    '*', '"Veritabanından Kataloğa"'),
(UUID(), 'app_name',         '*', '"KatalogAI"'),
(UUID(), 'app_version',      '*', '"1.0.0"'),
(UUID(), 'default_locale',   '*', '"tr"'),
(UUID(), 'available_locales','*', '["tr","en","de"]'),
(UUID(), 'footer_copyright', '*', '"© 2026 KatalogAI. Tüm hakları saklıdır."'),
(UUID(), 'footer_keywords',  '*', '["Katalog","Ürün Kataloğu","Fide","Tohum","Tarım","PDF Katalog","KatalogAI"]'),
(UUID(), 'developer_branding', '*', '{"name":"GWD","full_name":"Güzel Web Design","url":"https://guezelwebdesign.com"}');
