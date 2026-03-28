-- =============================================================
-- 022 — KatalogAI admin panel brand-prefix site_settings
-- Storage path: /uploads/media/logo/
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Admin panel site logo (brand-prefixed)
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'katalogai__site_logo', '*',
 '{"logo_url":"/uploads/media/logo/katalogai-logo.png","logo_alt":"KatalogAI Logo","logo_dark_url":"/uploads/media/logo/katalogai-logo-dark.png","favicon_url":"/uploads/media/logo/katalogai-favicon.png","apple_touch_icon_url":"/uploads/media/logo/katalogai-apple-touch.png"}')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);

-- Logo fallback
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'katalogai__logo', '*', '"/uploads/media/logo/katalogai-logo.png"')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);

-- Admin UI config
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'ui_admin_config', '*',
 '{"app_name":"KatalogAI","app_version":"1.0.0","theme_mode":"dark","theme_preset":"default","default_locale":"tr"}')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);

-- App locales
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'katalogai__app_locales', '*',
 '[{"code":"tr","label":"Türkçe","is_active":true,"is_default":true},{"code":"en","label":"English","is_active":true,"is_default":false},{"code":"de","label":"Deutsch","is_active":true,"is_default":false}]')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);

-- Default locale
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'katalogai__default_locale', '*', '"tr"')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);
