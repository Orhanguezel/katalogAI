# CLAUDE.md — KatalogAI

## Proje Ozeti

KatalogAI, farkli veritabanlarindan urun cekerek profesyonel kataloglar olusturan bir SaaS uygulamasidir. Bereket Fide, Vista Seed gibi farkli projelerdeki urunleri secip, sablonlara gore katalog tasarlayip PDF/email olarak cikti alabilirsiniz. Tum projeler ayni sunucuda farkli veritabani isimleriyle bulunur.

## Workspace Haritasi

```
katalogAI/
├── backend/          Fastify v5, Bun, MySQL 8 + Drizzle ORM, TypeScript strict
├── admin_panel/      Next.js 15, React 19, Redux + RTK Query, Shadcn UI, Tailwind v4
├── catalog-editor.html   Katalog editor taslak prototipi (statik HTML)
├── docs/             Proje dokumanlari
└── docker-compose.yml
```

## Teknoloji Stack

### Backend
- **Runtime:** Bun
- **Framework:** Fastify v5
- **DB:** MySQL 8 + Drizzle ORM
- **Auth:** JWT (cookie: `access_token`) + argon2/bcrypt
- **Validation:** Zod
- **Modul pattern:** `router.ts`, `admin.routes.ts`, `controller.ts`, `schema.ts`, `validation.ts`, `service.ts`, `repository.ts`

### Admin Panel (Frontend)
- **Framework:** Next.js 15 (App Router)
- **UI:** React 19, Tailwind CSS v4, Shadcn UI, Radix UI
- **State:** Redux Toolkit + RTK Query
- **Validation:** Zod + React Hook Form
- **Linter:** Biome

## Backend Kodlama Standartlari

### API Endpoint Prefix — `/api/v1` (Ekosistem Standardi)

Tum is endpoint'leri `/api/v1/...` altindadir. Versionsuz endpoint sadece `/api/health` (uptime probe). Pattern referansi: `projects/bereketfide/backend/src/app.ts`.

```ts
// backend/src/routes.ts
await app.register(async (api) => {
  api.get('/health', async () => ({ ok: true }));   // /api/health

  await api.register(async (v1) => {
    await v1.register(async (adminApi) => {
      adminApi.addHook('onRequest', requireAuth);
      adminApi.addHook('onRequest', requireAdmin);
      await registerSharedAdmin(adminApi);
      await registerProjectAdmin(adminApi);
    }, { prefix: '/admin' });

    await registerSharedPublic(v1);
    await registerProjectPublic(v1);
  }, { prefix: '/v1' });
}, { prefix: '/api' });
```

Frontend env (`.env.production`):
```
NEXT_PUBLIC_API_URL=https://katalogai.com/api/v1
NEXT_PUBLIC_API_BASE_URL=https://katalogai.com/api/v1
PANEL_API_URL=http://127.0.0.1:8083
```

Detay: ekosistem `CLAUDE.md` — "API Endpoint Prefix Kurali".

### Modul Dosya Yapisi
```
modules/{modul}/
  schema.ts            — Drizzle tablo tanimlari + TypeScript tipler
  validation.ts        — Zod semalari (input validation)
  repository.ts        — TUM DB sorgulari (read + write), repo* prefix
  controller.ts        — Public route handler'lar
  admin.controller.ts  — Admin route handler'lar
  service.ts           — Is mantigi (opsiyonel, karmasik is akislarinda)
  router.ts            — Public route tanimlari (SADECE route kayitlari)
  admin.routes.ts      — Admin route tanimlari (SADECE route kayitlari)
```

### Dosya Sorumluluklari

| Dosya | Icerik | Yasak |
|-------|--------|-------|
| `router.ts` | Route tanimlari, path + handler eslestirmesi | Is mantigi, DB sorgusu, validation |
| `admin.routes.ts` | Admin route tanimlari | Is mantigi, DB sorgusu, validation |
| `controller.ts` | Public handler fonksiyonlari, input parse, repo/service cagrisi | DB sorgusu |
| `admin.controller.ts` | Admin handler fonksiyonlari | DB sorgusu |
| `repository.ts` | Drizzle/SQL sorgulari (read + write), `repo*` prefix | Is mantigi, HTTP response |
| `service.ts` | Coklu repo cagrisi, transaction yonetimi, harici servis | DB sorgusu, HTTP response |
| `schema.ts` | Drizzle tablo tanimlari, `Insert`/`Select` type export | Is mantigi |
| `validation.ts` | Zod semalari, inferred type export | Is mantigi |

## Mevcut Backend Moduller

### Korunacak Ortak Altyapi
auth, categories, storage, siteSettings, theme, audit, dashboard, health, userRoles, _shared

### Olusturulacak Katalog Modulleri (2. faz)
catalogs, templates, products, productSources, exports, aiTasks

## Temel Ozellikler (Hedef)

- Coklu veritabani kaynagindan urun cekme (Bereket Fide, Vista Insaat vb.)
- Katalog sablon ve layout sistemi (2x2, 3x2, asimetrik, one cikan)
- Urun secme ve katalog olusturma (drag & drop)
- Renk temasi, font, marka bilgisi ozellestirme
- PDF ve baski odakli katalog uretimi
- Email ile katalog gonderme
- Dosyaya kaydetme (PDF, gorsel)
- AI destekli aciklama, ceviri ve icerik zenginlestirme
- Coklu dil destegi

## Komutlar

```bash
# Backend
cd backend && bun install && bun run dev          # localhost:8078

# Admin Panel
cd admin_panel && bun install && bun run dev      # localhost:3030

# Docker (production)
docker compose up -d
```

## Referans Dosyalar

- `AGENTS.md` → Codex okur
- `CLAUDE.md` → Claude Code okur (bu dosya)
- `.github/copilot-instructions.md` → Copilot okur
- `docs/katalog-creator-cleanup-audit.md` → Temizlik audit loglari
