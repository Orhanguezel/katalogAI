# AGENTS.md — KatalogAI (Codex Talimatlari)

## Proje Ozeti

KatalogAI, farkli veritabanlarindan urun cekerek profesyonel kataloglar olusturan bir SaaS uygulamasidir. Farkli projelerdeki urunleri secip, sablonlara gore katalog tasarlayip PDF/email olarak cikti alinir.

## Workspace Haritasi

```
katalogAI/
├── backend/        Fastify v5, Bun, MySQL 8 + Drizzle ORM    Port: 8078 (local) / 8083 (Docker)
├── admin_panel/    Next.js 15, Redux + RTK Query, Shadcn UI   Port: 3030
├── docs/           Proje dokumanlari
└── docker-compose.yml
```

## Komutlar

```bash
# Backend
cd backend && bun install && bun run dev          # localhost:8078
cd backend && bun test src/test/                   # Backend testler

# Admin Panel
cd admin_panel && bun install && bun run dev       # localhost:3030

# Docker (production)
docker compose up -d
```

## Backend Modul Pattern (Kati Kural)

```
modules/{modul}/
  schema.ts            — Drizzle tablo tanimlari
  validation.ts        — Zod semalari (input validation)
  repository.ts        — TUM DB sorgulari, repo* prefix
  controller.ts        — Public route handler'lar
  admin.controller.ts  — Admin route handler'lar
  service.ts           — Is mantigi (opsiyonel)
  router.ts            — Public route tanimlari (SADECE route kayitlari)
  admin.routes.ts      — Admin route tanimlari
```

**Kurallar:**
1. Router SADECE route tanimlar, 30 satiri gecmez
2. Controller'da DB sorgusu yok — repository'de
3. Repository'de HTTP yok — req/reply gecmez
4. Repository fonksiyonlari `repo` prefix ile baslar
5. Dosya boyutu limiti: 200 satir
6. Ortak helper/type/util `_shared/` icinde
7. Her handler'da try/catch + `handleRouteError`

## Admin Panel Kurallari

- Redux Toolkit + RTK Query kullanir
- Radix UI + Shadcn UI bilesenler
- Import'lar `@/integrations/shared` ve `@/integrations/hooks` barrel'larindan
- Biome linter (ESLint degil)

## Mevcut Backend Moduller (Ortak Altyapi)

auth, categories, storage, siteSettings, theme, audit, dashboard, health, userRoles, _shared

## Olusturulacak Katalog Modulleri

catalogs, templates, products, productSources, exports, aiTasks

## Commit Mesaji

```
feat(backend): kisa aciklama
fix(admin): kisa aciklama
test(backend): kisa aciklama
```

## Yapilmayacaklar

- `CLAUDE.md` degistirme (sadece Claude Code yapar)
- `project.portfolio.json` degistirme
- Docker/Nginx konfigurasyonu degistirme (mimari karar gerektirir)
- Mevcut modul yapisini bozma (yeni dosya eklenebilir, mevcut yapi degismez)
