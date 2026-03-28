-- =============================================================
-- 006 — KatalogAI site_settings SEO + brand defaults
-- =============================================================

SET NAMES utf8mb4;

INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
  (UUID(), 'site_logo',        '*', '{"url":"/uploads/media/logo/katalogai-logo.png","alt":"KatalogAI Logo"}'),
  (UUID(), 'site_logo_dark',   '*', '{"url":"/uploads/media/logo/katalogai-logo.png","alt":"KatalogAI Logo Dark"}'),
  (UUID(), 'site_favicon',     '*', '{"url":"/uploads/media/logo/katalogai-favicon.png","alt":"KatalogAI Favicon"}'),
  (UUID(), 'public_base_url',  '*', '"https://katalogai.com"'),
  (UUID(), 'site_title',       '*', '"KatalogAI"'),
  (UUID(), 'company_brand',    '*', '{"name":"KatalogAI","shortName":"KatalogAI","website":"https://katalogai.com"}'),
  (UUID(), 'seo_defaults',     '*', '{"canonicalBase":"https://katalogai.com","siteName":"KatalogAI","description":"Farklı veritabanlarından ürün çekerek profesyonel kataloglar oluşturun.","ogLocale":"tr_TR","themeColor":"#c29d5d","robots":"index, follow"}'),
  (UUID(), 'site_meta_default','tr', '{"title":"KatalogAI","description":"Profesyonel ürün kataloğu oluşturma platformu","keywords":"katalog, ürün kataloğu, fide, tohum, tarım"}'),
  (UUID(), 'site_seo',         '*', '{"title_default":"KatalogAI","title_template":"{{title}} | KatalogAI","description":"Profesyonel ürün kataloğu oluşturma platformu","robots":"index, follow"}')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`);
