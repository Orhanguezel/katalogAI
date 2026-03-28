-- =============================================================
-- 006 — KatalogAI site_settings (brand, SEO, media)
-- Storage path: /uploads/media/logo/
-- =============================================================

SET NAMES utf8mb4;

-- Site logo (light)
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'site_logo', '*',
 '{"url":"/uploads/media/logo/katalogai-logo.png","alt":"KatalogAI Logo"}')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);

-- Site logo (dark)
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'site_logo_dark', '*',
 '{"url":"/uploads/media/logo/katalogai-logo-dark.png","alt":"KatalogAI Logo Dark"}')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);

-- Site logo (light alias)
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'site_logo_light', '*',
 '{"url":"/uploads/media/logo/katalogai-logo.png","alt":"KatalogAI Logo Light"}')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);

-- Favicon
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'site_favicon', '*',
 '{"url":"/uploads/media/logo/katalogai-favicon.png","alt":"KatalogAI Favicon"}')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);

-- Apple Touch Icon
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'site_apple_touch_icon', '*',
 '{"url":"/uploads/media/logo/katalogai-apple-touch.png","alt":"KatalogAI Apple Touch"}')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);

-- App Icon 512
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'site_app_icon_512', '*',
 '{"url":"/uploads/media/logo/katalogai-icon-512.png","alt":"KatalogAI Icon 512"}')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);

-- Public base URL
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'public_base_url', '*', '"https://katalogai.com"')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);

-- Site title
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'site_title', '*', '"KatalogAI"')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);

-- Company brand
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'company_brand', '*',
 '{"name":"KatalogAI","shortName":"KatalogAI","website":"https://katalogai.com"}')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);

-- SEO defaults
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'seo_defaults', '*',
 '{"canonicalBase":"https://katalogai.com","siteName":"KatalogAI","description":"Farklı veritabanlarından ürün çekerek profesyonel kataloglar oluşturun.","ogLocale":"tr_TR","themeColor":"#c29d5d","robots":"index, follow"}')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);

-- SEO app icons
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'seo_app_icons', '*',
 '{"appleTouchIcon":"/uploads/media/logo/katalogai-apple-touch.png","favicon":"/uploads/media/logo/katalogai-favicon.png","faviconSvg":"/uploads/media/katalog-ai-icons/icon.svg"}')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);

-- Site meta (TR)
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'site_meta_default', 'tr',
 '{"title":"KatalogAI","description":"Profesyonel ürün kataloğu oluşturma platformu","keywords":"katalog, ürün kataloğu, fide, tohum, tarım, katalog editörü"}')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);

-- Site SEO template
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'site_seo', '*',
 '{"title_default":"KatalogAI","title_template":"{{title}} | KatalogAI","description":"Profesyonel ürün kataloğu oluşturma platformu","robots":"index, follow"}')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);
