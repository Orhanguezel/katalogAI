# CLAUDE.md - KatalogAI Backend

Bu dosya KatalogAI backend icin kisa calisma ozetidir.

Detayli kurallar:

- `BACKEND_RULES.md`
- `README.md`
- `.env.example`

## 1. Proje

Bu servis KatalogAI backend API katmanidir.

Temel teknik yapi:

- Bun
- Fastify
- MySQL / MariaDB
- JWT auth
- modül bazli route/controller/repository yapisi

## 2. Temel Gelistirme Kurallari

- controller ince olur
- repository DB katmaninda kalir
- validation ayri dosyalarda tutulur
- tekrar eden helper tek kaynaga tasinir
- env fallback'leri sadece `src/core/env.ts` uzerinden yonetilir
- route registration `src/app.ts` uzerinde eksiksiz kontrol edilir
- modül dis kullanimda `@/modules/<module>` explicit barrel kullanilir
- `_shared` dis kullanimda sadece `@/modules/_shared` kullanilir
- `index.ts` barrel dosyalarinda `export *` kullanilmaz
- modül ici importlari sadece gerekli oldugunda degistir; once dis kullanim yuzeyi standartlasir
- modülde birden fazla helper varsa `helpers/index.ts` lokal barrel zorunludur
- modül ici helper kullaniminda mumkun oldugunca `./helpers` kullanilir
- `any` ve `as any` kullanimi yasaktir
- runtime locale listesi hardcoded tutulmaz; gercek config kaynagindan okunur
- yeni fiziksel dosyalar `kebab-case` olur
- yorum basliklari gercek dosya yoluyla uyumlu tutulur

## 3. Ortak Hedef

Backend kodu:

- okunur
- katmanlari ayrilmis
- tekrarsiz
- tutarli

olmalidir.

## 4. Dokuman Uyumu

Config degistiginde su dosyalar da kontrol edilir:

- `README.md`
- `.env.example`
- `src/core/env.ts`
- `docker-compose.yml`

## 5. Dikkat Edilecek Alanlar

- DB user / password / database tutarliligi
- admin route registration
- service/repository ayrimi
- validation daginikligi
- eski proje veya marka kalintilari
- modül barrel yuzeyi ile dis import standardi

## 6. Kisa Kural

Yeni backend kodu yazarken:

1. validation
2. repository
3. service
4. controller
5. route
6. app registration
7. helper/local barrel kontrolu
8. env/doc/test kontrolu
9. type-check

Detay icin:

- `BACKEND_RULES.md`
