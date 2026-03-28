# KatalogAI

Farklı veritabanlarından ürün çekip profesyonel kataloglar üreten SaaS uygulaması.

## Workspace

```text
katalogAI/
├── backend/             Fastify v5, Bun, MySQL 8, Drizzle ORM
├── admin_panel/         Next.js 15, React 19, RTK Query, Zustand, shadcn/ui
├── backend/src/db/seed/sql/
│   ├── 030_product_sources_schema.sql
│   └── 031_catalog_page_items_nullable_source.sql
├── docs/
│   ├── catalog-editor-design-spec.md
│   └── antigravity-tasks.md
├── catalog-editor.html
├── CHECKLIST.md
└── docker-compose.yml
```

## Öne Çıkanlar

- Çoklu ürün kaynağı: `BereketFide`, `Vista Seed`, generic adapter
- 3 panelli katalog editörü: ürün kütüphanesi, A4 canvas, ayarlar
- Drag and drop ürün yerleştirme
- Katalog sayfa/item CRUD ve snapshot tabanlı kayıt modeli
- Özel ürün ekleme modalı ve snapshot-only özel ürün kaydı
- PDF export ve email gönderimi
- Koyu premium varsayılan tema, light tema desteği
- Header tabanlı admin navigasyonu

## Geliştirme

### Backend

```bash
cd backend
cp .env.example .env
bun install
bun run dev
```

Varsayılan local adres: `http://localhost:8078`

### Admin Panel

```bash
cd admin_panel
bun install
bun run dev
```

Varsayılan local adres: `http://localhost:3030`

### Docker

```bash
docker compose up -d
```

Backend container portu: `8083`

## Seed / Migration Notları

Yeni kurulumda SQL dosyalarını sırasıyla uygulayın:

1. `backend/src/db/seed/sql/030_product_sources_schema.sql`
2. `backend/src/db/seed/sql/031_catalog_page_items_nullable_source.sql`

`031` dosyası, editor içinden eklenen özel ürünlerin `catalog_page_items` tablosuna kaynak bağı olmadan snapshot olarak kaydedilebilmesini sağlar.

## Ortam Değişkenleri

Kritik backend env alanları:

- `PORT=8078`
- `FRONTEND_URL=http://localhost:3030`
- `CORS_ORIGIN=http://localhost:3030,...`
- `DB_NAME=katalog_creator`
- `SOURCE_ENCRYPTION_KEY=...`
- `STORAGE_DRIVER=local|cloudinary`
- `GROQ_API_KEY=...`
- `SMTP_*`

Detaylı örnek için [backend/.env.example](/home/orhan/Documents/Projeler/katalogAI/backend/.env.example) dosyasını kullanın.

## Ana Admin Yolları

- `/admin/dashboard`
- `/admin/catalogs`
- `/admin/catalogs/[id]`
- `/admin/product-sources`
- `/admin/categories`
- `/admin/site-settings`
- `/admin/storage`
- `/admin/theme`

## Dokümanlar

- [CHECKLIST.md](/home/orhan/Documents/Projeler/katalogAI/CHECKLIST.md)
- [catalog-editor-design-spec.md](/home/orhan/Documents/Projeler/katalogAI/docs/catalog-editor-design-spec.md)
- [antigravity-tasks.md](/home/orhan/Documents/Projeler/katalogAI/docs/antigravity-tasks.md)
