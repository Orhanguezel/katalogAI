/* 61_theme_config.sql — KatalogAI varsayılan tema (Turuncu & Lacivert) */

SET NAMES utf8mb4;
SET time_zone = '+00:00';

DROP TABLE IF EXISTS `theme_config`;

CREATE TABLE `theme_config` (
  `id`         CHAR(36)     NOT NULL,
  `is_active`  TINYINT(1)   NOT NULL DEFAULT 1,
  `config`     MEDIUMTEXT   NOT NULL,
  `created_at` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- KatalogAI — Varsayılan Tema Konfigürasyonu
-- Renk Kuralı: Turuncu (#F97316) CTA · Lacivert (#0F2340) nav/footer
-- =============================================================
INSERT INTO `theme_config` (`id`, `is_active`, `config`, `created_at`, `updated_at`) VALUES (
  '00000000-0000-4000-8000-000000000001',
  1,
  '{
    "colors": {
      "primary":     "#F97316",
      "secondary":   "#0F2340",
      "accent":      "#E85D04",
      "background":  "#FAFAFA",
      "foreground":  "#111827",
      "muted":       "#F3F4F6",
      "mutedFg":     "#6B7280",
      "border":      "#E5E7EB",
      "destructive": "#ef4444",
      "success":     "#22c55e",
      "navBg":       "#0F2340",
      "navFg":       "#FFFFFF",
      "footerBg":    "#0F2340",
      "footerFg":    "#F3F4F6"
    },
    "radius":     "0.5rem",
    "fontFamily": "DM Sans, sans-serif",
    "darkMode":   "light",

    "sections": [
      {
        "key":     "hero",
        "enabled": true,
        "order":   1,
        "label":   "Hero Bölümü",
        "colsLg":  1,
        "colsMd":  1,
        "colsSm":  1,
        "limit":   null,
        "variant": "static"
      },
      {
        "key":     "categories",
        "enabled": true,
        "order":   2,
        "label":   "Kategoriler",
        "colsLg":  6,
        "colsMd":  4,
        "colsSm":  3,
        "limit":   null,
        "variant": "scroll"
      },
      {
        "key":     "featured",
        "enabled": true,
        "order":   3,
        "label":   "Öne Çıkan İlanlar",
        "colsLg":  3,
        "colsMd":  2,
        "colsSm":  1,
        "limit":   6
      },
      {
        "key":     "recent",
        "enabled": true,
        "order":   4,
        "label":   "Son İlanlar",
        "colsLg":  3,
        "colsMd":  2,
        "colsSm":  1,
        "limit":   8
      },
      {
        "key":     "how_it_works",
        "enabled": true,
        "order":   5,
        "label":   "Nasıl Çalışır?"
      },
      {
        "key":     "cta_carrier",
        "enabled": true,
        "order":   6,
        "label":   "Taşıyıcı Ol CTA"
      }
    ],

    "pages": {
      "home": {
        "variant":   "default",
        "heroStyle": "static"
      },
      "listings": {
        "variant":      "default",
        "defaultView":  "grid",
        "filtersStyle": "sidebar"
      },
      "listing_detail": {
        "variant": "default"
      },
      "about":   { "variant": "centered" },
      "contact": { "variant": "default"  }
    }
  }',
  NOW(3),
  NOW(3)
);
