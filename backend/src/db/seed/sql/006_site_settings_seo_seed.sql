/* 79_site_settings_seo_seed.sql — Site media + SEO defaults (KatalogAI) */

SET NAMES utf8mb4;
SET time_zone = '+00:00';

/* =============================================================
   SITE MEDIA (used by Site Settings > Logo & Favicon tab)
   ============================================================= */
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
  (UUID(), 'site_logo',             '*', '{"url":"/uploads/media/logo/logo.jpeg","alt":"KatalogAI Logo"}'),
  (UUID(), 'site_logo_dark',        '*', '{"url":"/uploads/media/logo/logo2.jpeg","alt":"KatalogAI Logo Dark"}'),
  (UUID(), 'site_logo_light',       '*', '{"url":"/uploads/media/logo/logo.jpeg","alt":"KatalogAI Logo Light"}'),
  (UUID(), 'site_favicon',          '*', '{"url":"/uploads/media/logo/logo4.jpg","alt":"KatalogAI Favicon"}'),
  (UUID(), 'site_apple_touch_icon', '*', '{"url":"/uploads/media/logo/logo3.jpg","alt":"KatalogAI Apple Touch"}'),
  (UUID(), 'site_app_icon_512',     '*', '{"url":"/uploads/media/logo/logo.jpeg","alt":"KatalogAI Icon 512"}'),
  (UUID(), 'site_og_default_image', '*', '{"url":"/uploads/media/hero/og-default.jpg","alt":"KatalogAI - P2P Kargo Pazaryeri"}')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);

/* =============================================================
   SEO CORE
   ============================================================= */
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
  (UUID(), 'public_base_url', '*', '"https://katalogai.com"'),
  (UUID(), 'site_title',      '*', '"KatalogAI"'),
  (UUID(), 'company_brand',   '*', '{"name":"KatalogAI","shortName":"KatalogAI"}'),
  (UUID(), 'socials',         '*', '{"instagram":"https://www.instagram.com/katalogai","facebook":"https://www.facebook.com/katalogai"}')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);

INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
  (UUID(), 'seo_defaults', '*',
   '{"canonicalBase":"https://katalogai.com","siteName":"KatalogAI","description":"P2P kargo pazaryeri. Taşıyıcılar güzergah ilanı açar, müşteriler kargo alanı satın alır.","ogLocale":"tr_TR","author":"KatalogAI","themeColor":"#F97316","twitterCard":"summary_large_image","robots":"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1","googlebot":"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"}'),
  (UUID(), 'seo_app_icons', '*',
   '{"appleTouchIcon":"/uploads/media/logo/logo3.jpg","favicon":"/uploads/media/logo/logo4.jpg","faviconSvg":"/uploads/media/logo/logo4.jpg"}'),
  (UUID(), 'seo_social_same_as', '*',
   '["https://www.instagram.com/katalogai","https://www.facebook.com/katalogai"]'),
  (UUID(), 'seo_amp_google_client_id_api', '*', '"googleanalytics"'),
  (UUID(), 'site_meta_default', 'tr',
   '{"title":"KatalogAI","description":"P2P kargo pazaryeri — BlaBlaCar modeli, kargo için","keywords":"katalogai, p2p kargo, kargo gönder, taşıyıcı"}'),
  (UUID(), 'site_seo', '*',
   '{"title_default":"KatalogAI","title_template":"{{title}} | KatalogAI","description":"P2P kargo pazaryeri — taşıyıcılar güzergah ilanı açar, müşteriler kargo alanı satın alır","robots":"index, follow"}')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);

/* =============================================================
   HOMEPAGE HERO
   ============================================================= */
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
  (UUID(), 'homepage_hero', '*',
   '{"title":"Kargo Göndermek Artık Çok Kolay","subtitle":"Taşıyıcı ilanlarına göz at, uygun güzergahı bul, kargo alanını hemen rezerve et.","bgImage":"/uploads/media/hero/hero-bg.jpg","bgImageDark":"/uploads/media/hero/hero-bg-dark.jpg","bgOverlayOpacity":0.6,"ctaLabel":"KARGO GÖNDER","ctaPath":"/ilan-ver","ctaSecondaryLabel":"İLANLARI GÖR","ctaSecondaryPath":"/ilanlar"}')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);
