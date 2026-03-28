-- ================================================================
-- 040 - Catalogs Seed Data (Bereket Fide + Vista Seed)
-- ================================================================

INSERT INTO `catalogs` (
  `id`, `title`, `slug`, `status`, `brand_name`, `season`,
  `contact_info`, `logo_url`, `locale`, `color_theme`, `font_family`,
  `accent_color`, `page_count`, `product_count`, `created_by`
) VALUES
(
  'c1000001-0001-4000-8000-000000000001',
  'Profesyonel Fide Üretim Kataloğu',
  'bereket-fide-2026',
  'draft',
  'Bereket Fide Tarım A.Ş.',
  '2026 İlkbahar Sezonu',
  '{"phone":"+90 242 000 00 00","email":"info@bereketfide.com.tr","website":"https://www.bereketfide.com.tr","address":"Antalya, Türkiye"}',
  'http://localhost:8078/uploads/bereketfide-logo/logo-23_51_59.png',
  'tr',
  '#2d6a4f',
  'Cormorant Garamond',
  '#c29d5d',
  1, 0,
  '{{ADMIN_ID}}'
),
(
  'c1000001-0001-4000-8000-000000000002',
  'Tohum Çeşitleri Kataloğu',
  'vista-seed-2026',
  'draft',
  'Vista Seed',
  '2026 Üretim Sezonu',
  '{"website":"https://www.vistaseeds.com.tr"}',
  NULL,
  'tr',
  '#1a1a2e',
  'Cormorant Garamond',
  '#c29d5d',
  1, 0,
  '{{ADMIN_ID}}'
)
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `brand_name` = VALUES(`brand_name`),
  `season` = VALUES(`season`),
  `contact_info` = VALUES(`contact_info`),
  `logo_url` = VALUES(`logo_url`),
  `locale` = VALUES(`locale`),
  `color_theme` = VALUES(`color_theme`),
  `font_family` = VALUES(`font_family`),
  `accent_color` = VALUES(`accent_color`);

-- Sayfalar: Bereket Fide (kapak + 2x2 + arka kapak)
INSERT INTO `catalog_pages` (`id`, `catalog_id`, `page_number`, `layout_type`) VALUES
('p1000001-0001-4000-8000-000000000001', 'c1000001-0001-4000-8000-000000000001', 1, 'cover'),
('p1000001-0001-4000-8000-000000000010', 'c1000001-0001-4000-8000-000000000001', 2, '2x2'),
('p1000001-0001-4000-8000-000000000011', 'c1000001-0001-4000-8000-000000000001', 3, 'backcover')
ON DUPLICATE KEY UPDATE `layout_type` = VALUES(`layout_type`);

-- Sayfalar: Vista Seed (kapak + 2x3 + arka kapak)
INSERT INTO `catalog_pages` (`id`, `catalog_id`, `page_number`, `layout_type`) VALUES
('p1000001-0001-4000-8000-000000000002', 'c1000001-0001-4000-8000-000000000002', 1, 'cover'),
('p1000001-0001-4000-8000-000000000020', 'c1000001-0001-4000-8000-000000000002', 2, '2x3'),
('p1000001-0001-4000-8000-000000000021', 'c1000001-0001-4000-8000-000000000002', 3, 'backcover')
ON DUPLICATE KEY UPDATE `layout_type` = VALUES(`layout_type`);
