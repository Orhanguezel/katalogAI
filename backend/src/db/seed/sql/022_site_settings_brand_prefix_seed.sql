-- =============================================================
-- 022 — KatalogAI site_settings brand-prefix seed
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Admin panel brand config
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'katalogai__site_logo', '*',
 '{"url":"/uploads/media/logo/katalogai-logo.png","alt":"KatalogAI Logo"}')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);

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
