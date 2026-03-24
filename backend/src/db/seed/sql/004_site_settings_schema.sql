/* site_settings_schema.sql  — KatalogAI */

SET NAMES utf8mb4;
SET time_zone = '+00:00';

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

-- =============================================================
-- BRAND / UI
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'brand_name',         '*', '"KatalogAI"'),
(UUID(), 'brand_display_name', '*', '"KatalogAI"'),
(UUID(), 'brand_logo_text',    '*', '"KatalogAI"'),
(UUID(), 'brand_subtitle',     '*', '"P2P Kargo Pazaryeri"'),
(UUID(), 'brand_tagline',      '*', '"Kargo Göndermek Artık Çok Kolay"'),
(UUID(), 'topbar_location',    '*', '"Türkiye"'),
(UUID(), 'topbar_slogan',      '*', '"Güvenli ve Hızlı P2P Kargo"'),
(UUID(), 'ui_theme',           '*', '{"primaryHex":"#F97316","darkMode":"light","radius":"0.5rem"}'),
(UUID(), 'site_version',       '*', '"1.0.0"'),
(UUID(), 'admin_path',         '*', '"/admin"');

-- =============================================================
-- BRAND MEDIA (storage_assets URLs)
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'brand_logo',                  '*', '"/uploads/media/logo/logo.jpeg"'),
(UUID(), 'brand_logo_dark',             '*', '"/uploads/media/logo/logo2.jpeg"'),
(UUID(), 'brand_logo_icon',             '*', '"/uploads/media/logo/logo4.jpg"'),
(UUID(), 'brand_logo_icon_transparent', '*', '"/uploads/media/logo/logo4.jpg"'),
(UUID(), 'brand_logo_icon_192',         '*', '"/uploads/media/logo/logo3.jpg"'),
(UUID(), 'brand_logo_icon_512',         '*', '"/uploads/media/logo/logo.jpeg"'),
(UUID(), 'brand_og_image',              '*', '"/uploads/media/logo/logo.jpeg"');

-- =============================================================
-- SITE MEDIA (Logo & Favicon)
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'site_logo',             '*', '{"url":"/uploads/media/logo/logo.jpeg","alt":"KatalogAI Logo"}'),
(UUID(), 'site_logo_dark',        '*', '{"url":"/uploads/media/logo/logo2.jpeg","alt":"KatalogAI Logo Dark"}'),
(UUID(), 'site_logo_light',       '*', '{"url":"/uploads/media/logo/logo.jpeg","alt":"KatalogAI Logo Light"}'),
(UUID(), 'site_favicon',          '*', '{"url":"/uploads/media/logo/logo4.jpg","alt":"KatalogAI Favicon"}'),
(UUID(), 'site_apple_touch_icon', '*', '{"url":"/uploads/media/logo/logo3.jpg","alt":"KatalogAI Apple Touch"}'),
(UUID(), 'site_app_icon_512',     '*', '{"url":"/uploads/media/logo/logo.jpeg","alt":"KatalogAI Icon 512"}'),
(UUID(), 'site_og_default_image', '*', '{"url":"/uploads/media/hero/og-default.jpg","alt":"KatalogAI - P2P Kargo Pazaryeri"}');

-- =============================================================
-- CONTACT
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'contact_phone_display',  '*', '"0312 000 00 00"'),
(UUID(), 'contact_phone_tel',      '*', '"03120000000"'),
(UUID(), 'contact_email',          '*', '"info@katalogai.com"'),
(UUID(), 'contact_to_email',       '*', '"info@katalogai.com"'),
(UUID(), 'contact_address',        '*', '"Türkiye"'),
(UUID(), 'contact_whatsapp_link',  '*', '"https://wa.me/903120000000"');

-- =============================================================
-- STORAGE / UPLOAD CONFIG
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'storage_driver',             '*', '"local"'),
(UUID(), 'storage_local_root',         '*', '"/www/wwwroot/katalogai/uploads"'),
(UUID(), 'storage_local_base_url',     '*', '"/uploads"'),
(UUID(), 'storage_cdn_public_base',    '*', '"https://cdn.katalogai.com"'),
(UUID(), 'storage_public_api_base',    '*', '"https://katalogai.com/api"'),
(UUID(), 'cloudinary_cloud_name',      '*', '""'),
(UUID(), 'cloudinary_api_key',         '*', '""'),
(UUID(), 'cloudinary_api_secret',      '*', '"__SET_IN_ENV__"'),
(UUID(), 'cloudinary_folder',          '*', '"uploads"'),
(UUID(), 'cloudinary_unsigned_preset', '*', '""');

-- =============================================================
-- SMTP / MAIL CONFIG
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'smtp_host',        '*', '"smtp.example.com"'),
(UUID(), 'smtp_port',        '*', '587'),
(UUID(), 'smtp_username',    '*', '"info@katalogai.com"'),
(UUID(), 'smtp_password',    '*', '"__SET_IN_ENV__"'),
(UUID(), 'smtp_from_email',  '*', '"info@katalogai.com"'),
(UUID(), 'smtp_from_name',   '*', '"KatalogAI"'),
(UUID(), 'smtp_ssl',         '*', 'false');

-- =============================================================
-- HEADER
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'header_info_text',  '*', '"Taşıyıcı ilanlarını keşfet"'),
(UUID(), 'header_cta_label',  '*', '"KARGO GÖNDER"');

-- =============================================================
-- HEADER MENU
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(
  UUID(), 'header_menu', '*',
  '[
    {"title":"ANASAYFA","path":"/","pageKey":"home","type":"link"},
    {"title":"İLANLAR","path":"/ilanlar","pageKey":"listings","type":"link"},
    {"title":"KARGO GÖNDER","path":"/ilan-ver","pageKey":"ilan-ver","type":"link"},
    {"title":"KURUMSAL","path":"#","pageKey":"kurumsal","type":"dropdown","itemsKey":"menu_kurumsal"},
    {"title":"İLETİŞİM","path":"/iletisim","pageKey":"contact","type":"link"}
  ]'
);

-- =============================================================
-- FOOTER
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'footer_keywords',    '*', '["P2P Kargo","Taşıyıcı İlanı","Kargo Gönder","Rezervasyon","Güvenli Kargo","KatalogAI"]'),
(UUID(), 'footer_services',    '*', '["Kargo Gönder","İlan Ara","Taşıyıcı Ol"]'),
(UUID(), 'footer_quick_links', '*', '[{"title":"Anasayfa","path":"/","pageKey":"home"},{"title":"İlanlar","path":"/ilanlar","pageKey":"listings"},{"title":"Kargo Gönder","path":"/ilan-ver","pageKey":"ilan-ver"},{"title":"Hakkımızda","path":"/hakkimizda","pageKey":"about"},{"title":"İletişim","path":"/iletisim","pageKey":"contact"}]');

-- =============================================================
-- MENU (Header dropdown)
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(
  UUID(), 'menu_kurumsal', '*',
  '[{"title":"HAKKIMIZDA","path":"/hakkimizda","pageKey":"about"},{"title":"S.S.S.","path":"/sss","pageKey":"faq"},{"title":"İLETİŞİM","path":"/iletisim","pageKey":"contact"}]'
);

-- =============================================================
-- SEO GLOBAL DEFAULTS
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'seo_defaults', '*',
 '{"canonicalBase":"https://katalogai.com","siteName":"KatalogAI | Kargo Göndermek Artık Çok Kolay","description":"KatalogAI ile taşıyıcı ilanlarına göz at, kargo rezervasyonu yap. Türkiye geneli P2P kargo pazaryeri.","ogLocale":"tr_TR","author":"KatalogAI","themeColor":"#F97316","twitterCard":"summary_large_image","robots":"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1","googlebot":"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"}'),
(UUID(), 'public_base_url',  '*', '"http://localhost:3000"'),
(UUID(), 'site_title',       '*', '"KatalogAI"'),
(UUID(), 'company_brand',    '*', '{"name":"KatalogAI","shortName":"KatalogAI"}'),
(UUID(), 'socials',          '*', '{"instagram":"https://www.instagram.com/katalogai","facebook":"https://www.facebook.com/katalogai","twitter":"https://www.twitter.com/katalogai"}'),
(UUID(), 'social_facebook_url',  '*', '"https://www.facebook.com/katalogai"'),
(UUID(), 'social_instagram_url', '*', '"https://www.instagram.com/katalogai"'),
(UUID(), 'social_twitter_url',   '*', '"https://www.twitter.com/katalogai"'),
(UUID(), 'seo_social_same_as',  '*', '["https://www.instagram.com/katalogai","https://www.facebook.com/katalogai"]'),
(UUID(), 'seo_app_icons', '*',
 '{"appleTouchIcon":"/uploads/media/logo/logo3.jpg","favicon":"/uploads/media/logo/logo4.jpg","faviconSvg":"/uploads/media/logo/logo4.jpg","logoIcon192":"/uploads/media/logo/logo3.jpg","logoIcon512":"/uploads/media/logo/logo.jpeg"}'),
(UUID(), 'seo_amp_google_client_id_api', '*', '"googleanalytics"');

-- =============================================================
-- SEO SAYFA BAZLI — Her sayfanın kendi SEO ayarları
-- title, description, keywords, ogImage, robots (index/noindex)
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES

-- Anasayfa
(UUID(), 'seo_pages_home', '*',
 '{"title":"KatalogAI | Kargo Göndermek Artık Çok Kolay","description":"KatalogAI ile taşıyıcı ilanlarına göz at, kargo rezervasyonu yap. Türkiye geneli P2P kargo pazaryeri.","keywords":"katalogai, kargo gönder, taşıyıcı ilan, p2p kargo, kargo rezervasyon","ogImage":"/uploads/media/hero/og-default.jpg","robots":"index, follow","noIndex":false}'),

-- İlanlar listesi
(UUID(), 'seo_pages_listings', '*',
 '{"title":"Taşıma İlanları | KatalogAI","description":"Tüm taşıyıcı ilanlarını inceleyin. Güzergah, kapasite ve fiyata göre filtreli arama.","keywords":"taşıyıcı ilanı, kargo ilanı, katalogai ilanlar, kargo bul","ogImage":"/uploads/media/hero/og-ilanlar.jpg","robots":"index, follow","noIndex":false}'),

-- İlan detay (template)
(UUID(), 'seo_pages_listing_detail', '*',
 '{"titleTemplate":"{{title}} | KatalogAI","descriptionTemplate":"{{from_city}} → {{to_city}} güzergahında taşıma ilanı. KatalogAI ile güvenli kargo rezervasyonu yapın.","keywordsTemplate":"katalogai, {{from_city}}, {{to_city}}, kargo, taşıyıcı","ogImage":"/uploads/media/hero/og-default.jpg","robots":"index, follow","noIndex":false}'),

-- İlan ver
(UUID(), 'seo_pages_ilan_ver', '*',
 '{"title":"İlan Ver | KatalogAI","description":"Taşıyıcı olarak müsait kapasitenizi yayınlayın. Güzergah ve tarih belirleyin, kargo taleplerini alın.","keywords":"ilan ver, taşıyıcı ol, kargo ilanı aç, kapasite paylaş","ogImage":"/uploads/media/hero/og-default.jpg","robots":"index, follow","noIndex":false}'),

-- Hakkımızda
(UUID(), 'seo_pages_about', '*',
 '{"title":"Hakkımızda | KatalogAI","description":"KatalogAI hakkında bilgi edinin. Türkiye geneli P2P kargo pazaryeri.","keywords":"katalogai hakkında, p2p kargo nedir","ogImage":"/uploads/media/hero/og-default.jpg","robots":"index, follow","noIndex":false}'),

-- İletişim
(UUID(), 'seo_pages_contact', '*',
 '{"title":"İletişim | KatalogAI","description":"KatalogAI ile iletişime geçin. Sorularınız için bize ulaşın.","keywords":"katalogai iletişim, kargo destek","ogImage":"/uploads/media/hero/og-default.jpg","robots":"index, follow","noIndex":false}'),

-- S.S.S.
(UUID(), 'seo_pages_faq', '*',
 '{"title":"Sıkça Sorulan Sorular | KatalogAI","description":"KatalogAI hakkında sıkça sorulan sorular ve cevapları. Kargo gönderimi, rezervasyon, ödeme süreçleri.","keywords":"katalogai sss, kargo soru cevap, nasıl çalışır","ogImage":"/uploads/media/hero/og-default.jpg","robots":"index, follow","noIndex":false}'),

-- Giriş yap
(UUID(), 'seo_pages_login', '*',
 '{"title":"Giriş Yap | KatalogAI","description":"KatalogAI hesabınıza giriş yapın.","keywords":"katalogai giriş, login","ogImage":"/uploads/media/hero/og-default.jpg","robots":"noindex, follow","noIndex":true}'),

-- Üye ol
(UUID(), 'seo_pages_register', '*',
 '{"title":"Üye Ol | KatalogAI","description":"KatalogAI''e üye olun. Taşıyıcı veya müşteri olarak hemen kayıt olun.","keywords":"katalogai kayıt, üye ol, taşıyıcı kayıt","ogImage":"/uploads/media/hero/og-default.jpg","robots":"noindex, follow","noIndex":true}'),

-- Şifremi unuttum
(UUID(), 'seo_pages_password_reset', '*',
 '{"title":"Şifremi Unuttum | KatalogAI","description":"KatalogAI şifre sıfırlama sayfası.","keywords":"katalogai şifre sıfırlama","ogImage":"/uploads/media/hero/og-default.jpg","robots":"noindex, nofollow","noIndex":true}'),

-- Panel (dashboard — noindex)
(UUID(), 'seo_pages_panel', '*',
 '{"title":"Panel | KatalogAI","description":"KatalogAI kullanıcı paneli.","keywords":"","ogImage":"/uploads/media/hero/og-default.jpg","robots":"noindex, nofollow","noIndex":true}'),

-- Admin (noindex)
(UUID(), 'seo_pages_admin', '*',
 '{"title":"Admin Panel | KatalogAI","description":"KatalogAI yönetim paneli.","keywords":"","ogImage":"/uploads/media/hero/og-default.jpg","robots":"noindex, nofollow","noIndex":true}');

-- =============================================================
-- JSON-LD (Organization)
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'seo_local_business', '*',
 '{"@context":"https://schema.org","@type":"Organization","name":"KatalogAI","description":"Türkiye geneli P2P kargo pazaryeri. Taşıyıcılar ilan açar, müşteriler kargo yeri satın alır.","url":"https://katalogai.com","sameAs":["https://www.instagram.com/katalogai","https://www.facebook.com/katalogai"]}');

-- =============================================================
-- HOMEPAGE SETTINGS
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'homepage_sections', '*',
 '[{"key":"hero","enabled":true,"order":1,"label":"Hero Bölümü"},{"key":"categories","enabled":true,"order":2,"label":"Tüm Kategoriler"},{"key":"featured","enabled":true,"order":3,"label":"Öne Çıkan İlanlar"},{"key":"recent","enabled":true,"order":4,"label":"Son İlanlar"}]'),

-- Hero bölümü ayarları
(UUID(), 'homepage_hero', '*',
 '{"title":"Kargo Göndermek Artık Çok Kolay","subtitle":"Taşıyıcı ilanlarına göz at, uygun güzergahı bul, kargo alanını hemen rezerve et.","bgImage":"/uploads/media/hero/hero-bg.jpg","bgImageDark":"/uploads/media/hero/hero-bg-dark.jpg","bgOverlayOpacity":0.6,"ctaLabel":"KARGO GÖNDER","ctaPath":"/ilan-ver","ctaSecondaryLabel":"İLANLARI GÖR","ctaSecondaryPath":"/ilanlar"}'),

-- Hero banner görselleri (slider/carousel)
(UUID(), 'homepage_banners', '*',
 '[{"image":"/uploads/media/hero/banner-1.jpg","alt":"KatalogAI - Güvenli Kargo","link":"/ilanlar","order":1},{"image":"/uploads/media/hero/banner-2.jpg","alt":"Taşıyıcı Ol, Kazan","link":"/ilan-ver","order":2}]');

-- =============================================================
-- CTA
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'cta_post_listing_title',    '*', '"Kargo İlanı Ver"'),
(UUID(), 'cta_post_listing_subtitle', '*', '"Taşıyıcı olarak müsait kapasitenizi saniyeler içinde yayınlayın"'),
(UUID(), 'cta_post_listing_path',     '*', '"/ilan-ver"');

-- =============================================================
-- ADMIN UI BRANDING
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(
  UUID(), 'ui_admin_config', '*',
  '{
    "default_locale":"tr",
    "theme":{"mode":"light","preset":"soft-pop","font":"inter"},
    "layout":{"sidebar_variant":"inset","sidebar_collapsible":"icon","navbar_style":"sticky","content_layout":"full-width"},
    "branding":{
      "app_name":"KatalogAI Admin Panel",
      "app_copyright":"KatalogAI",
      "html_lang":"tr",
      "theme_color":"#F97316",
      "favicon":"/uploads/media/logo/logo4.jpg",
      "favicon_svg":"/uploads/media/logo/logo4.jpg",
      "apple_touch_icon":"/uploads/media/logo/logo3.jpg",
      "logo":"/uploads/media/logo/logo.jpeg",
      "logo_dark":"/uploads/media/logo/logo2.jpeg",
      "logo_icon":"/uploads/media/logo/logo4.jpg",
      "meta":{
        "title":"KatalogAI Admin Panel",
        "description":"KatalogAI yönetim paneli. Taşıyıcılar, ilanlar, rezervasyonlar ve site ayarları yönetimi.",
        "og_url":"https://katalogai.com/admin",
        "og_title":"KatalogAI Admin Panel",
        "og_description":"KatalogAI yönetim paneli ile ilan ve rezervasyon yönetimini merkezi olarak yapın.",
        "og_image":"/uploads/media/logo/logo.jpeg",
        "twitter_card":"summary_large_image"
      }
    }
  }'
),
(
  UUID(), 'ui_admin', '*',
  '{
    "app_name":"KatalogAI Admin Panel",
    "app_version":"v1.0.0",
    "developer_branding":{"name":"KatalogAI","url":"https://katalogai.com","full_name":"KatalogAI"},
    "nav":{
      "labels":{
        "general":"Genel / Yönetim",
        "listings":"İlan Yönetimi",
        "finance":"Kullanıcılar & Finans",
        "support":"Destek",
        "system":"Sistem & Ayarlar"
      },
      "items":{
        "dashboard":"Özet",
        "ilanlar":"İlanlar",
        "bookings":"Rezervasyonlar",
        "categories":"Kategoriler",
        "gallery":"Galeri",
        "users":"Kullanıcılar",
        "carriers":"Taşıyıcılar",
        "wallets":"Cüzdanlar",
        "reports":"Raporlar",
        "contacts":"İletişim Mesajları",
        "email_templates":"E-posta Şablonları",
        "site_settings":"Site Ayarları",
        "storage":"Dosya Yöneticisi",
        "theme":"Tema",
        "telegram":"Telegram",
        "audit":"Denetim"
      }
    },
    "common":{
      "actions":{
        "create":"Oluştur",
        "edit":"Düzenle",
        "delete":"Sil",
        "save":"Kaydet",
        "cancel":"İptal",
        "refresh":"Yenile",
        "search":"Ara",
        "filter":"Filtrele",
        "close":"Kapat",
        "back":"Geri",
        "confirm":"Onayla"
      },
      "states":{
        "loading":"Yükleniyor...",
        "error":"İşlem başarısız.",
        "empty":"Veri bulunamadı.",
        "updating":"Güncelleniyor...",
        "saving":"Kaydediliyor..."
      }
    }
  }'
);
