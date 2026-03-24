-- =============================================================
-- FILE: src/db/seed/sql/114_site_settings_brand_prefix_seed.sql
-- DESCRIPTION: KatalogAI — Admin panel brand-prefix'li site_settings kayitlari
-- Admin panel tum key'leri katalogai__ prefix'i ile sorgular.
-- Bu seed, admin panelin sayfa yuklenisinde 404 almamasi icin gerekli
-- kayitlari olusturur.
-- Bagimlilik: 60_site_settings_schema.sql
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =============================================================
-- katalogai__site_logo  (Brand Media tab)
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'katalogai__site_logo', '*',
 '{"url":"/uploads/media/logo/logo.jpeg","alt":"KatalogAI Logo","urlDark":"/uploads/media/logo/logo2.jpeg","altDark":"KatalogAI Logo Dark","favicon":"/uploads/media/logo/logo4.jpg","faviconAlt":"KatalogAI Favicon","appleTouchIcon":"/uploads/media/logo/logo3.jpg","appleTouchIconAlt":"KatalogAI Apple Touch","ogImage":"/uploads/media/hero/og-default.jpg","ogImageAlt":"KatalogAI OG Image"}')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);

-- =============================================================
-- katalogai__logo  (legacy fallback)
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'katalogai__logo', '*', '"/uploads/media/logo/logo.jpeg"')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);

-- =============================================================
-- katalogai__seo_pages  (SEO tab — sayfa bazli SEO ayarlari)
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'katalogai__seo_pages', 'tr',
 '{
   "home":{"title":"KatalogAI | Kargo Göndermek Artık Çok Kolay","description":"KatalogAI ile taşıyıcı ilanlarına göz at, kargo rezervasyonu yap. Türkiye geneli P2P kargo pazaryeri.","keywords":"katalogai, kargo gönder, taşıyıcı ilan, p2p kargo","robots":"index, follow","noIndex":false},
   "ilanlar":{"title":"Taşıma İlanları | KatalogAI","description":"Tüm taşıyıcı ilanlarını inceleyin. Güzergah, kapasite ve fiyata göre filtreli arama.","keywords":"taşıyıcı ilanı, kargo ilanı, kargo bul","robots":"index, follow","noIndex":false},
   "ilan-ver":{"title":"İlan Ver | KatalogAI","description":"Taşıyıcı olarak müsait kapasitenizi yayınlayın.","keywords":"ilan ver, taşıyıcı ol, kapasite paylaş","robots":"index, follow","noIndex":false},
   "hakkimizda":{"title":"Hakkımızda | KatalogAI","description":"KatalogAI hakkında bilgi edinin.","keywords":"katalogai hakkında, p2p kargo nedir","robots":"index, follow","noIndex":false},
   "iletisim":{"title":"İletişim | KatalogAI","description":"KatalogAI ile iletişime geçin.","keywords":"katalogai iletişim","robots":"index, follow","noIndex":false},
   "sss":{"title":"S.S.S. | KatalogAI","description":"KatalogAI hakkında sıkça sorulan sorular.","keywords":"katalogai sss","robots":"index, follow","noIndex":false},
   "giris":{"title":"Giriş Yap | KatalogAI","description":"KatalogAI hesabınıza giriş yapın.","keywords":"","robots":"noindex, follow","noIndex":true},
   "uye-ol":{"title":"Üye Ol | KatalogAI","description":"KatalogAI''e üye olun.","keywords":"","robots":"noindex, follow","noIndex":true}
 }')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);

-- =============================================================
-- katalogai__app_locales  (Dil Ayarlari tab)
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'katalogai__app_locales', '*',
 '[{"code":"tr","label":"Türkçe","is_active":true,"is_default":true},{"code":"en","label":"English","is_active":false,"is_default":false}]')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);
