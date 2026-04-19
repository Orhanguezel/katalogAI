# AGENTS.md — KatalogAI (Codex Talimatlari)

## Proje Ozeti

KatalogAI, farkli veritabanlarindan urun cekerek profesyonel kataloglar olusturan bir SaaS uygulamasidir. Farkli projelerdeki urunleri secip, sablonlara gore katalog tasarlayip PDF/email olarak cikti alinir.

## Workspace Haritasi

```
katalogAI/
├── backend/        Fastify v5, Bun, MySQL 8 + Drizzle ORM    Port: 8078 (local) / 8083 (Docker)
├── admin_panel/    Next.js 15, Redux + RTK Query, Shadcn UI   Port: 3030
├── docs/           Proje dokumanlari
│   ├── catalog-editor-design-spec.md   — Hedef tasarim spesifikasyonu
│   └── antigravity-tasks.md            — UI dogrulama gorevleri
├── catalog-editor.html                 — Referans prototip (statik HTML)
└── docker-compose.yml
```

## Komutlar

```bash
# Backend
cd backend && bun install && bun run dev          # localhost:8078

# Admin Panel
cd admin_panel && bun install && bun run dev       # localhost:3030

# Docker (production)
docker compose up -d
```

## API Endpoint Prefix — `/api/v1` (Ekosistem Standardi)

Tum is endpoint'leri `/api/v1/...` altindadir. Versionsuz tek istisna `/api/health`.

Backend `routes.ts` BereketFide patternini taklit eder:
```ts
await app.register(async (api) => {
  api.get('/health', async () => ({ ok: true }));   // /api/health (versionsuz)
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

Frontend / admin panel env:
```
NEXT_PUBLIC_API_URL=https://katalogai.com/api/v1
NEXT_PUBLIC_API_BASE_URL=https://katalogai.com/api/v1
```

Yeni endpoint eklerken `/api/v1` altinda kal. Versionsuz route ekleme.

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
- Dosya adi: kebab-case
- Hardcoded metin yok — locale key kullan

## Aktif Backend Moduller

**Ortak Altyapi:** auth, categories, storage, siteSettings, theme, audit, dashboard, health, userRoles, _shared, telegram, mail, notifications, profiles

**Katalog Cekirdegi:** catalogs, productSources, aiTasks, exports, scraper

## Katalog Editoru Mimari

Katalog editoru zaten 3 panelli olarak mevcut:

```
admin_panel/src/app/(main)/admin/(admin)/catalogs/
  page.tsx                    — Katalog listesi
  catalogs.tsx                — Grid liste
  [id]/
    catalog-builder.tsx       — 3 panelli orkestrator
    _components/
      product-library-panel.tsx   — Sol: Urun kutuphanesi
      canvas-panel.tsx            — Orta: A4 canvas
      catalog-page-canvas.tsx     — A4 sayfa render
      page-grid-renderer.tsx      — Grid layout engine
      product-slot.tsx            — Droppable urun slot
      product-card-draggable.tsx  — Draggable urun karti
      settings-panel.tsx          — Sag: Ayarlar (4 tab)
      tab-template.tsx            — Sablon secici
      tab-style.tsx               — Renk, font, boyut
      tab-page.tsx                — Layout, sayfa islemleri
      tab-catalog-info.tsx        — Baslik, marka, sezon
      catalog-builder-topbar.tsx  — Ust bar
      zoom-controls.tsx           — Zoom kontrolleri
      preview-dialog.tsx          — Onizleme
      export-email-dialog.tsx     — Email gonderim
      ai-enhance-dialog.tsx       — AI iyilestirme
    _config/
      catalog-templates.ts    — 6 hazir sablon
      color-palettes.ts       — 14 renk paleti
      font-options.ts         — Google Fonts
      layout-presets.ts       — 8 layout tipi
    _store/
      catalog-builder-store.ts — Zustand store (auto-save 5s debounce)
```

## Codex Gorevleri

### Oncelik 1: Editoru catalog-editor.html tasarimina yaklastir

Detayli spec: `docs/catalog-editor-design-spec.md`

Ozet:
1. Topbar'i guncelle: brand logo + katalog basligi + aksiyon butonlari
2. A4 canvas: catalog header (serif brand, alt baslik, sezon), footer (copyright), dot grid bg
3. Urun kartlari: serif baslik, mono fiyat, gorsel aspect-ratio 1:1
4. Sol panel: arama + kategori pill filtreleri + urun kartlari hover efekti
5. Sag panel: Marka/Baslik/Sezon input'lari, gorsel layout secici, circular renk swatchi
6. Bos slot: dashed border + "+Urun Ekleyin" placeholder
7. Print CSS: A4 210mm x 297mm, page-break, UI gizle

### Oncelik 2: Yeni Urun Ekleme Modal

- `add-custom-product-dialog.tsx` olustur
- Gorsel upload + onizleme, isim, aciklama, fiyat
- Store'a custom urun olarak ekle

### Oncelik 3: PDF Export Kalitesi

- Print media query iyilestir
- Sayfa kesimi, bos alan yonetimi
- Gorsel kalite (yuksek cozunurluk)

## Commit Mesaji

```
feat(admin): kisa aciklama
fix(backend): kisa aciklama
```

## Yapilmayacaklar

- `CLAUDE.md` degistirme (sadece Claude Code yapar)
- `project.portfolio.json` degistirme
- Docker/Nginx konfigurasyonu degistirme
- Mevcut modul yapisini bozma
- Silinen PaketJet modullerini geri ekleme (ilanlar, bookings, carriers, wallet, withdrawal)
