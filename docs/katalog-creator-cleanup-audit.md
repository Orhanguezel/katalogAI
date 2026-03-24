# Katalog Creator Cleanup Audit

Tarih: 2026-03-24

## Bu turda yapilanlar

- Kok README mevcut gercek klasor yapisina gore yeniden yazildi.
- `admin_panel` ve `backend` README dosyalari katalog creator hedefiyle hizalandi.
- Paket adlari katalog creator ismine cekildi.
- Backend varsayilan veritabani adi `katalog_creator` olarak guncellendi.
- Admin panel branding fallback degerleri nortrlestirildi.
- Kok `docker-compose.yml`, var olmayan `frontend/` ve `nginx/` referanslari yerine mevcut `admin_panel/` + `backend/` yapisina uyarlandi.

## Bilincli olarak dokunulmayan alanlar

- `project.portfolio.json`
- onceki projeden kalan backend modulleri
- onceki projeden kalan admin endpoint ve locale modul yapilari
- test script isimleri
- SQL seed dosyalari ve migration listeleri

## Ikinci faz icin onerilen temizlik

1. Korunacak ortak altyapi modullerini belirle:
   auth, users, audit, storage, locales, site settings
2. Tasinmayacak domain modullerini listele:
   bookings, ilanlar, carriers, wallet, telegram ve benzeri
3. Backend icin yeni katalog creator cekirdek modullerini ac:
   catalogs, templates, products, productSources, exports, aiTasks
4. Admin panelde yeni moduller icin navigasyon ve locale anahtarlarini ayir
5. Seed ve demo verilerini katalog creator alanina gore yeniden kur

## Risk Notu

Kod tabaninda halen eski alan isimleri cok yaygin. Bu nedenle ikinci fazda toplu silme yerine once referans haritasi cikarilip sonra modul bazli pruning yapilmasi daha guvenli olur.
