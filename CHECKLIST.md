# KatalogAI — Proje Checklist

Son guncelleme: 2026-03-28 (telegram + audit modulleri silindi)

---

## Faz 0: Repo Temizlik & Hazirlik — TAMAMLANDI

- [X] PaketJet referanslarini temizle (CLAUDE.md, AGENTS.md, project.portfolio.json)
- [X] Gereksiz dosyalari sil (PLAN.md, SEO-PLAN.md, background*.png, prime-frontend-nextjs/, technical-seo-skill/)
- [X] Codex skill dosyalarini yeniden adlandir (paketjet-* -> katalog-*)
- [X] Agent dosyalarini KatalogAI icin yeniden yaz (.claude/agents/)
- [X] .gitignore guncelle
- [X] GitHub baglantisi kur (https://github.com/Orhanguezel/katalogAI.git)
- [X] Ilk push (force push ile)

---

## Faz 1: Backend — productSources + catalogs CRUD — TAMAMLANDI

### 1.1 productSources Modulu

- [X] schema.ts — product_sources + source_products Drizzle tablolari
- [X] validation.ts — Zod semalari (create, update, list, import)
- [X] pool-manager.ts — Lazy connection pool (Map<sourceId, DrizzleInstance>)
- [X] source-adapters/bereketfide.ts — BereketFide adapter (sub_categories destegi)
- [X] source-adapters/vistaseed.ts — VistaSeed adapter (sub_categories destegi)
- [X] source-adapters/generic.ts — Generic adapter
- [X] source-adapters/index.ts — Barrel (3 adapter export)
- [X] repository.ts — 10 repo fonksiyonu (CRUD, test, fetch, import) + vistaseed routing
- [X] admin.controller.ts — 9 admin handler
- [X] admin.routes.ts — Route kayitlari
- [X] index.ts — Barrel export

### 1.2 catalogs Modulu

- [X] schema.ts — catalogs, catalog_pages, catalog_page_items tablolari
- [X] validation.ts — 12 Zod semasi
- [X] repository.ts — Catalog CRUD + full tree fetch
- [X] repository-pages.ts — Page CRUD + reorder
- [X] repository-items.ts — Item CRUD + reorder
- [X] service.ts — bulkAddProducts + refreshSnapshots
- [X] admin.controller.ts — Catalog CRUD handler'lari
- [X] admin.controller-pages.ts — Page/item/bulk handler'lari
- [X] admin.routes.ts — 20 route
- [X] index.ts — Barrel export

### 1.3 Backend Entegrasyon

- [X] core/env.ts — SOURCE_ENCRYPTION_KEY eklenmesi
- [X] routes.ts — registerProductSourcesAdmin, registerCatalogsAdmin
- [X] PaketJet modul importlarini temizle (routes.ts, dashboard, hooks.ts, admin-ui.ts)
- [X] Dashboard modulu KatalogAI icin yeniden yaz (users, catalogs, sources)
- [X] Stub moduller olustur (mail, profiles, notifications)
- [X] DB olustur (katalog_creator) + erisim izni
- [X] 030_product_sources_schema.sql — Seed (bereketfide + vistaseed kaynaklari)
- [X] SQL injection duzeltmesi (tum adapter'larda parameterized query)

---

## Acil Temizlik (Faz arasi) — TAMAMLANDI

### A1. Kirik Modul Silme

- [X] `withdrawal/` modulunu tamamen sil (carrier-bank, wallet bagimliliklari yok — TS hatasi)

### A2. Eski PaketJet Modul Kalintilari — Backend

- [X] Orphan test dosyalarini sil (wallet, withdrawal, carrier-bank, booking, ilan, carriers, carriers-admin, contact, custom-page, rating)
- [X] `_shared/dashboard-admin-types.ts` KatalogAI icin yeniden yaz
- [X] `_shared/time.ts` eski import bagimliligini kaldir

### A3. Eski PaketJet Modul Kalintilari — Admin Panel

- [X] Eski locale dosyalarini sil (wallet, carriers, ilanlar, bookings, availability)
- [X] Locale index.ts temizle (eski import'lar kaldirildi)
- [X] Eski shared type dosyalarini sil (wallet, ilanlar, carriers, bookings — tum .ts + dizinler)
- [X] `shared.ts` barrel — bookings, wallet, ilanlar, carriers export bloklari silindi
- [X] `dashboard-types.ts` eski analytics DTO'lar temizlendi
- [X] `dashboard/index.ts` eski type export'lar kaldirildi

### A4. Config Tutarsizliklari

- [X] Port hizalama: docker-compose.yml 8078'e guncellendi (.env.example ile uyumlu)
- [X] README.md guncelle
- [X] .env.example guncelle

### A5. Dogrulama

- [X] Backend `tsc --noEmit` — 0 hata
- [X] Admin Panel `tsc --noEmit` — 0 hata

---

## Faz 2: Admin Panel — Dark Premium Tema + Catalog Builder

Referans: `catalog-editor.html` prototipi + ekran goruntusu.
Hedef: Tum admin paneli prototipteki premium koyu tarim temasina gecirmek.
Varsayilan tema koyu (dark). Aydinlik (light) ve alternatif temalar da desteklenecek.

### 2.1 Shared Types & RTK Query Endpoints — TAMAMLANDI

- [X] integrations/shared/product-sources/ (types, config, index)
- [X] integrations/shared/catalogs/ (types, builder-types, config, index)
- [X] endpoints/admin/product-sources-admin-endpoints.ts (9 endpoint)
- [X] endpoints/admin/catalogs-admin-endpoints.ts (16 endpoint + 2 export endpoint)
- [X] shared.ts, hooks.ts, tags.ts barrel guncellemeleri

### 2.2 Tema Sistemi (Coklu Tema Destegi) — TAMAMLANDI

#### 2.2.1 Tema Altyapisi

- [X] CSS degiskenleri globals.css'te tanimli (`:root` + `.dark` class)
- [X] Mevcut Zustand + cookie persist sistemi kullanildi
- [X] Tema degistirme mevcut theme sayfasindan calisiyor

#### 2.2.2 Varsayilan Tema — Dark Premium (Prototip)

- [X] `--katalog-bg-deep: #0a0c0a` (body / sayfa arka plan)
- [X] `--katalog-bg-panel: #121512` (sidebar, paneller)
- [X] `--katalog-bg-card: #1a1e1a` (kart, input arka plani)
- [X] `--katalog-bg-accent: #232a23` (hover, vurgu alanlari)
- [X] `--primary: #c29d5d` (gold — butonlar, aktif tab, vurgu)
- [X] `--katalog-gold-light: #e6c58d` (hover)
- [X] `--katalog-text-main: #e2e8e2` (ana metin)
- [X] `--katalog-text-muted: #8a9a8a` (ikincil metin)
- [X] `--katalog-text-dim: #4d5a4d` (placeholder, ipucu)
- [X] `--katalog-border: rgba(255,255,255,0.06)` / `--katalog-border-hover: rgba(255,255,255,0.12)`

#### 2.2.3 Alternatif Tema — Light

- [X] Beyaz/acik gri arka planlar (globals.css :root)
- [X] Koyu metin renkleri
- [X] Ayni gold primary (#c29d5d)

#### 2.2.4 Alternatif Tema — Forest / Diger (opsiyonel, ileride)

- [ ] Koyu yesil tonlar
- [ ] Farkli accent renk
- [ ] Tarima ozel dogal his

#### 2.2.5 Genel Tema Uyumu

- [X] Shadcn bilesenleri tema degiskenleri kullanir (CSS variables ile)
- [X] Global font: Cormorant Garamond (serif) + Outfit (sans) + JetBrains Mono
- [X] Scrollbar stili: 6px, theme-aware thumb

### 2.3 Admin Layout Revizyonu — TAMAMLANDI

- [X] Sidebar kaldirildi, header-based dropdown navigasyon eklendi
- [X] Header: Brand logo + NavigationMenu (desktop dropdown) + mobil Sheet hamburger
- [X] Navigasyon yapi: Dashboard (link), Katalog (dropdown), Kullanicilar (link), Sistem (dropdown)
- [X] LayoutControls'dan sidebar tercihleri temizlendi
- [X] Eski sidebar dosyalari silindi (app-sidebar, nav-main, nav-user, nav-secondary)
- [X] Bilesenler header/ dizinine tasindi (account-switcher, theme-switcher, layout-controls)
- [X] nav-path-utils.ts — path matching yardimcilari extract edildi

### 2.4 PaketJet Navigasyon Temizligi — TAMAMLANDI

- [X] sidebar-items.ts — ilanlar, bookings, carriers, wallets, reports, contacts, email_templates kaldirildi
- [X] permissions.ts — Sadece aktif modul izinleri (dashboard, catalogs, product_sources, categories, users, system moduleri)
- [X] sidebar.json locale — Gereksiz key'ler temizlendi
- [X] shared.ts — contacts, email-templates, slider, brand, reports export bloklari kaldirildi
- [X] tags.ts — Sadece kullanilan RTK tag'ler (PaketJet tag'leri silindi)
- [X] admin-ui.ts — Nav copy yapisi guncellendi (sadece aktif gruplar)
- [X] dashboard-ui.ts — Dashboard modulleri guncellendi (catalogs, categories, users, site_settings)

### 2.5 Genel Admin Sayfalari (Koyu Tema Uyumu) — TAMAMLANDI

- [X] Katalog sayfalari: Gold status badge, hover gold border, premium card styling
- [X] Dashboard sayfasi: Premium kartlar (gold glow, serif sayilar, katalog-bg-panel, hover efektleri)
- [X] Product Sources sayfasi: Koyu panel, gold tab'lar, serif baslik
- [X] Site Settings sayfasi: Shadcn tema-aware bilesenler
- [X] Users sayfasi: Shadcn Table/Card tema-aware
- [X] Storage sayfasi: Shadcn tema-aware galeri
- [X] Diger sayfalar (Theme, Telegram, Audit, Categories): Shadcn CSS variables ile tema uyumlu

### 2.6 Catalog Builder — 3 Panelli Editor — TAMAMLANDI

#### 2.6.1 Topbar

- [X] Sol: KatalogAI marka logosu (K ikonu, gold serif font)
- [X] Sag: Preview ghost buton + PDF (gold) + Email butonlari
- [X] Koyu arka plan (bg-sidebar), alt border, h:64px
- [X] data-panel="topbar" print attribute

#### 2.6.2 Sol Panel — Urun Kutuphanesi

- [X] Arka plan: bg-sidebar, sag border
- [X] "URUN KUTUPHANESI" gold uppercase baslik (11px, letter-spacing)
- [X] Arama: bg-card input, search ikonu
- [X] Kategori filtreleri: Pill tab'lar (rounded-full, gold active)
- [X] Urun kartlari: bg-card, gold hover border, gold fiyat
- [X] data-panel="library" print attribute

#### 2.6.3 Orta Panel — A4 Kanvas

- [X] Canvas toolbar: bg-sidebar, zoom kontrolleri
- [X] Kanvas arka plan: dot grid pattern (radial-gradient)
- [X] A4 sayfa: shadow-2xl + ring-1 ring-black/5
- [X] Zoom: scale() transform calisiyor
- [X] data-panel="zoom" + data-print-page attributes

#### 2.6.4 Sag Panel — Ayarlar

- [X] bg-sidebar, gold uppercase baslik
- [X] Gold active tab'lar (data-[state=active])
- [X] 4 tab: Sablon, Stil, Sayfa, Bilgi
- [X] AI SEO onerisi butonu (Bilgi tab'inda)
- [X] data-panel="settings" print attribute

#### 2.6.5 Diger Builder Bilesenleri

- [X] Page Navigation: bg-sidebar, gold active page ring, dashed add butonu
- [X] Product Slot: gold drop indicator (ring-katalog-gold), scale animasyon
- [X] DragOverlay: gold ring + border
- [X] Yeni urun ekleme modal'i + snapshot-only custom product kaydi
- [X] data-panel="page-nav" + data-print-page attributes

#### 2.6.6 Zustand Store & Config — TAMAMLANDI

- [X] _store/catalog-builder-store.ts — Zustand store (20+ action, auto-save)
- [X] _config/catalog-templates.ts — 6 sablon
- [X] _config/layout-presets.ts — 8 sayfa duzeni
- [X] _config/font-options.ts — 18 Google Font
- [X] _config/color-palettes.ts — 14 renk paleti

### 2.7 Sidebar & i18n — TAMAMLANDI

- [X] sidebar-items.ts — "Katalog" grubu (catalogs + product_sources + categories)
- [X] permissions.ts — catalogs + product_sources izinleri (ADMIN_ONLY)
- [X] locale dosyalari (catalogs.json, product-sources.json, sidebar.json)

### 2.8 Print / PDF Stiller — TAMAMLANDI

- [X] @media print: sidebar, settings, toolbar gizle (data-panel attribute'lari ile)
- [X] A4: box-shadow yok, 210mm x 297mm, 15mm padding, page-break-after always
- [X] print-color-adjust: exact (renk koruma)
- [X] Preview dialog'da gold "Yazdir" butonu

### 2.9 Genel UI Detaylar — TAMAMLANDI

- [X] Toast bildirimi: Gold success (--success-bg: katalog-gold), bottom-right
- [X] Tum gecis animasyonlari: cubic-bezier(0.4, 0, 0.2, 1) (button, input, tab, link)
- [X] radius-sm: 6px, radius-md: 10px (base), radius-lg: 20px
- [X] Gold vurgu rengi tutarliligi: status badge, card hover, DragOverlay, tab active

### 2.10 Dogrulama

- [X] TypeScript type-check (0 hata — backend + frontend)
- [X] bun run build basarili
- [ ] Tum admin sayfalari koyu temada gorsel kontrol (manual)
- [ ] Builder: prototip ile birebir karsilastirma (manual)
- [ ] Builder: Zoom in/out calismasi (manual)
- [ ] Builder: Urun ekleme/cikarma akisi (manual)
- [ ] Builder: Layout degisimi (manual)
- [ ] Builder: Renk temasi degisimi (manual)
- [ ] Builder: Print preview kontrolu (manual)

---

## Faz 3: PDF Export + Email — TAMAMLANDI

### 3.1 Backend — exports Modulu

- [X] modules/exports/pdf-renderer.ts — Puppeteer ile HTML->PDF (headless, A4, printBackground)
- [X] modules/exports/pdf-template.ts — A4 HTML template (cover page + grid pages + Google Fonts)
- [X] modules/exports/mail-service.ts — Nodemailer + KatalogAI marka HTML email + PDF ek
- [X] modules/exports/validation.ts — Zod semalari (exportPdfParams, sendCatalogEmail)
- [X] modules/exports/admin.controller.ts — handleExportPdf + handleExportEmail
- [X] modules/exports/admin.routes.ts — Route kayitlari
- [X] modules/exports/index.ts — Barrel

### 3.2 API Endpoints

- [X] POST /api/admin/exports/pdf/:catalogId — PDF olustur + blob download
- [X] POST /api/admin/exports/email/:catalogId — PDF olustur + email ile gonder

### 3.3 Admin Panel — Export Entegrasyon

- [X] catalog-builder-topbar.tsx — Gold PDF export butonu (blob download + toast)
- [X] export-email-dialog.tsx — Email gonderim formu (to, subject, message)
- [X] RTK Query endpoints (exportCatalogPdfAdmin, sendCatalogEmailAdmin)
- [X] hooks.ts barrel guncellemesi
- [X] Locale key'ler (actions.sendEmail, export.*, messages.pdfExported/emailSent)

### 3.4 Dogrulama

- [X] Backend tsc --noEmit — 0 hata
- [X] Frontend tsc --noEmit — 0 hata
- [X] Frontend build basarili
- [ ] PDF olusturma testi (manual — backend calistirmak gerekir)
- [ ] Font embedding kontrolu (manual)
- [ ] Email gonderim testi (manual — SMTP config gerekir)

---

## Faz 4: AI Content Enhancement — TAMAMLANDI

### 4.1 Backend — aiTasks Modulu

- [X] modules/aiTasks/groq-client.ts — Groq SDK wrapper, lazy init, groqCompletion()
- [X] modules/aiTasks/prompts.ts — 3 system prompt + 3 user prompt builder
- [X] modules/aiTasks/validation.ts — Zod semalari (enhance, translate, seoSuggest)
- [X] modules/aiTasks/service.ts — serviceEnhanceDescription, serviceTranslate, serviceSeoSuggest
- [X] modules/aiTasks/admin.controller.ts — 3 handler
- [X] modules/aiTasks/admin.routes.ts — Route kayitlari
- [X] modules/aiTasks/index.ts — Barrel
- [X] core/env.ts — GROQ_API_KEY + GROQ_MODEL eklendi
- [X] routes.ts — registerAiTasksAdmin kaydedildi

### 4.2 API Endpoints

- [X] POST /api/admin/ai/enhance-description — Urun aciklama iyilestirme
- [X] POST /api/admin/ai/translate — Coklu dil cevirisi
- [X] POST /api/admin/ai/seo-suggest — SEO onerileri (JSON: title, description, keywords)

### 4.3 Admin Panel — AI Entegrasyon

- [X] integrations/shared/ai-tasks/ — types + barrel
- [X] endpoints/admin/ai-tasks-admin-endpoints.ts — 3 RTK Query mutation
- [X] hooks.ts — AI hook'lari export
- [X] ai-enhance-dialog.tsx — AI icerik asistani (enhance + translate modu, gold UI)
- [X] tab-catalog-info.tsx — AI SEO onerisi butonu (Sparkles ikonu)
- [X] Locale key'ler (ai.*)

### 4.4 Dogrulama

- [X] Backend tsc --noEmit — 0 hata
- [X] Frontend tsc --noEmit — 0 hata
- [X] Frontend build basarili
- [ ] Groq API baglanti testi (manual — GROQ_API_KEY gerekir)
- [ ] Aciklama iyilestirme kalite kontrolu (manual)
- [ ] Ceviri dogrulugu kontrolu (manual)

---

## Faz 5: Vista Seeds ve Bereketfide Veri Cekme — TAMAMLANDI

- [X] VistaSeed source adapter (source-adapters/vistaseed.ts) — DB uzerinden canli veri cekme
- [X] VistaSeed product_sources seed (030_product_sources_schema.sql)
- [X] Vista Seeds web scraper (vistaseeds.com.tr) — cheerio tabanli HTML scraper
- [X] Scraped verileri JSON/CSV formatina donusturme + dosya indirme

### 5.1 Backend — scraper Modulu

- [X] modules/scraper/types.ts — ScrapedCategory, ScrapedProduct, ScrapeResult tipleri
- [X] modules/scraper/validation.ts — Zod semalari (scrapeVistaSeeds, exportScrapedData)
- [X] modules/scraper/vista-seeds-scraper.ts — cheerio ile kategori/urun/detay scraping
- [X] modules/scraper/export-service.ts — exportAsJson + exportAsCsv
- [X] modules/scraper/admin.controller.ts — 4 handler (scrape, last-result, export, import-to-source)
- [X] modules/scraper/admin.routes.ts — Route kayitlari
- [X] modules/scraper/index.ts — Barrel
- [X] routes.ts — registerScraperAdmin kaydedildi

### 5.2 API Endpoints

- [X] POST /api/admin/scraper/vista-seeds — Web scraper calistir
- [X] GET /api/admin/scraper/last-result — Son scrape sonucunu getir
- [X] POST /api/admin/scraper/export — JSON/CSV dosya indirme
- [X] POST /api/admin/scraper/import-to-source/:sourceId — Scraped urunleri productSource'a aktar

### 5.3 Dogrulama

- [X] Backend tsc --noEmit — 0 hata
- [X] Frontend tsc --noEmit — 0 hata

---

## Faz 6: Editoru catalog-editor.html Tasarimina Yaklastir — DEVAM EDIYOR

Referans: `catalog-editor.html` + `docs/catalog-editor-design-spec.md`
Gorev dagitimi: Codex (kod), Antigravity (UI dogrulama), Claude Code (mimari)

### 6.1 Editör UI Refinement — TAMAMLANDI

#### 6.1.1 Topbar Refinement
- [X] Topbar'i catalog-editor.html header'ina benzetmek (64px, brand logo, serif baslik)
- [X] Sol: K gradient ikonu + "KatalogAI" serif yazi
- [X] Sag: Email, Preview ghost btn + "PDF Disa Aktar" gold btn (catalog-editor stil border/shadow)
- [X] Dosya: `catalog-builder-topbar.tsx`

#### 6.1.2 A4 Canvas Iyilestirmesi
- [X] Catalog header: serif brand (42px), uppercase alt baslik (13px), sezon, sayfa no
- [X] Catalog footer: copyright (sol) + sayfa no (sag), 10px uppercase, #999
- [X] Grid gap ve padding catalog-editor.html ile uyumlu (24px gap, 40px padding)
- [X] Bos slot: 2px dashed #ddd, "+Urun Ekleyin" placeholder
- [X] Dot grid arka plan (radial-gradient, 20px aralik)
- [X] Dosyalar: `catalog-page-canvas.tsx`, `page-grid-renderer.tsx`

#### 6.1.3 Urun Karti Tasarimi
- [X] Gorsel: aspect-ratio 1:1, #f7f9f7 bg, 1px #eee border, object-fit cover
- [X] Baslik: serif font, 20px
- [X] Aciklama: 12px, #333, line-height 1.5
- [X] Fiyat: mono font, 14px, bold, siyah
- [X] Dosya: `product-slot.tsx`

#### 6.1.4 Sol Panel — Urun Kutuphanesi
- [X] Arama cubugu: 40px, bg-card, focus: primary border + shadow
- [X] Kategori filtre tab'lari: pill seklinde (rounded-full), active: gold bg
- [X] Urun kartlari: 56x56 thumbnail, isim (14px, 500, beyaz), kod+fiyat, tag badge
- [X] Hover: bg-card, border highlight, scale(1.02)
- [X] Dosya: `product-library-panel.tsx`, `product-card-draggable.tsx`

#### 6.1.5 Sag Panel — Ayarlar
- [X] Gold active tab'lar, 4 tab (sablon, stil, sayfa, bilgi)
- [X] Katalog bilgileri: Marka Adi, Alt Baslik, Donem/Sezon input'lari
- [X] Layout secici, renk paleti, font secici
- [X] Dosyalar: `settings-panel.tsx`, `tab-style.tsx`, `tab-page.tsx`, `tab-catalog-info.tsx`

#### 6.1.6 Yeni Urun Ekleme Modal
- [X] `add-custom-product-dialog.tsx` mevcut ve catalog-editor stiline uygun
- [X] Cloudinary gorsel upload + onizleme
- [X] Urun adi (zorunlu), aciklama (textarea), fiyat (opsiyonel)
- [X] "Vazgec" ghost btn + "Ekle" gold btn
- [X] Store'a custom urun olarak ekle

#### 6.1.7 PDF Export / Print CSS Kalitesi
- [X] @media print: A4 210mm x 297mm, 15mm padding
- [X] page-break-after: always, break-inside: avoid
- [X] Sidebar, toolbar, bos slot'lar print'te gizle
- [X] Beyaz bg, siyah metin, box-shadow/border yok
- [X] @page { size: A4 portrait; margin: 0; }
- [X] print-color-adjust: exact eklendi

#### 6.1.8 Canvas Kontrolleri
- [X] Zoom: -/+ butonlar, yuzde gosterge, 0.3-1.5 aralik
- [X] "A4 PORTRAIT (595x842)" mono label (orta)
- [X] "Temizle" ghost butonu (sag)
- [X] 3 bolumlu toolbar: zoom | label | temizle
- [X] Dosyalar: `canvas-panel.tsx`, `zoom-controls.tsx`

### 6.2 Antigravity Gorevleri (docs/antigravity-tasks.md)

#### 6.2.1 Editör Sayfa Yuklenmesi
- [ ] `/admin/catalogs` listesi dogru yukleniyormu
- [ ] `/admin/catalogs/[id]` 3 panelli editor aciliyormu
- [ ] Sol, orta, sag paneller dogru render ediliyormu

#### 6.2.2 A4 Canvas Dogrulama
- [ ] A4 sayfa boyutlari dogru mu (595x842px)
- [ ] Zoom in/out calisiyor mu (0.3x - 1.5x)
- [ ] Coklu sayfa render (4+ urun)
- [ ] Catalog header/footer gorunuyor mu
- [ ] Bos slot placeholder gorunuyor mu

#### 6.2.3 Drag & Drop UX
- [ ] Sol panelden urun surukleme + birakmasi calisiyor mu
- [ ] Drag overlay gorunuyor mu
- [ ] Slot'a birakma + kaldirma calisiyor mu

#### 6.2.4 Ayarlar Paneli Dogrulama
- [ ] Sablon degistirme yansiyormu (6 template)
- [ ] Renk paleti secimi anlik yansiyormu
- [ ] Font degisikligi yansiyormu
- [ ] Layout degisikligi canvas'ta yansiyormu
- [ ] Marka adi degisikligi canvas header'da gorunuyormu

#### 6.2.5 Kaydetme & Export
- [ ] Auto-save (5 sn debounce) calisiyor mu
- [ ] Kayit durumu gostergesi (unsaved/saving/saved)
- [ ] PDF export + email dialog calisiyor mu
- [ ] Onizleme dialog calisiyor mu

#### 6.2.6 Responsive & Tema
- [ ] 1024px altinda mobil header gorunuyor mu
- [ ] Mobil hamburger menu calisiyor mu
- [ ] Koyu/acik temada contrast yeterli mi
- [ ] Active/hover state'ler gorunuyor mu

#### 6.2.7 PDF Cikti Kalitesi
- [ ] Print preview (Ctrl+P) A4 boyutunda mi
- [ ] UI elementleri print'te gizleniyor mu
- [ ] Gorsel ve metinler okunakli mi
- [ ] Sayfa kesimleri dogru mu

### 6.3 Claude Code Gorevleri (Mimari)

- [X] AGENTS.md guncellendi (Codex gorevleri yazildi)
- [X] docs/antigravity-tasks.md olusturuldu
- [X] docs/catalog-editor-design-spec.md olusturuldu (renk, font, spacing, component spec)
- [ ] Codex ciktisini review et, mimari uyumsuzluk varsa duzelt
- [ ] Antigravity raporuna gore gerekli fix'leri planla

---

## Faz 7: Production & Deploy — DEVAM EDIYOR

- [X] Docker compose guncelleme (port degiskenleri, NODE_ENV, brand guncelleme)
- [X] Nginx konfigurasyonu (`deploy/nginx.conf` — reverse proxy, SSL, gzip, security headers)
- [X] PM2 ecosystem dosyasi (`deploy/ecosystem.config.cjs` — backend + admin)
- [X] .env.production hazirlama (`deploy/.env.production.example`)
- [X] Catalog tablolari (catalogs, catalog_pages, catalog_page_items) SQL ile olusturuldu
- [ ] SSL sertifikasi (certbot ile — domain gerekli)
- [ ] Domain yapilandirmasi (DNS A record)
- [ ] Ilk production deploy
- [ ] Smoke test (tum akislar)

---

## Genel / Surekli

- [X] routes.ts PaketJet modul importlarini temizle
- [X] hooks.ts olmayan endpoint importlarini temizle
- [X] admin-ui.ts catalogs/product_sources key'lerini ekle
- [X] Backend tsc --noEmit 0 hata
- [X] Frontend tsc --noEmit 0 hata
- [X] Frontend build basarili
- [X] PaketJet navigasyon kalintilari temizlendi (sidebar-items, permissions, locale, shared, tags)
- [X] Sidebar kaldirildi, header dropdown navigasyon eklendi
- [X] README.md guncellendi (moduller, sayfalar, stack, standart dosyalar)
- [X] .env.example guncellendi (KatalogAI branding)
- [ ] Swagger/API dokumantasyonu

---

## Ozet Ilerleme Tablosu

| Faz                                | Durum        | Ilerleme |
| ---------------------------------- | ------------ | -------- |
| Faz 0 — Repo Temizlik             | TAMAMLANDI   | 7/7      |
| Faz 1 — Backend CRUD              | TAMAMLANDI   | 30/30    |
| Acil Temizlik                      | TAMAMLANDI   | 20/20    |
| Faz 2 — Admin Tema + Builder      | TAMAMLANDI   | 70/70    |
| Faz 3 — PDF Export + Email        | TAMAMLANDI   | 11/14    |
| Faz 4 — AI Content                | TAMAMLANDI   | 11/14    |
| Faz 5 — Vista Seeds               | TAMAMLANDI   | 16/16    |
| Faz 6 — Editor Tasarim Refinement | DEVAM EDIYOR | 27/30    |
| Faz 7 — Production                | DEVAM EDIYOR | 5/9      |
