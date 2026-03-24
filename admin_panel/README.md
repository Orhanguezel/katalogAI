# Katalog Creator Admin Panel

Bu uygulama katalog creator projesinin Next.js tabanli admin paneli ve editor yuzudur.

## Amac

Bu panel asagidaki senaryolari tasiyacak sekilde evrilecektir:

- katalog, koleksiyon ve template yonetimi
- urun kaynagi baglantilari ve senkronizasyon ayarlari
- coklu dil icerik yonetimi
- AI destekli icerik onerileri
- PDF/export akislarini yonetme

## Gelistirme Kurallari

- [ADMIN_PANEL_RULES.md](/home/orhan/Documents/Projeler/katalogAI/admin_panel/ADMIN_PANEL_RULES.md)

Kalici standartlar:

- `src/integrations/shared.ts` ve `src/integrations/hooks.ts` explicit barrel olarak tutulur, `export *` kullanilmaz.
- Bir modul klasoru altinda birden fazla shared dosya varsa lokal `index.ts` barrel acilir.
- Yeni moduller once lokal barrel, sonra kok barrel mantigi ile sisteme dahil edilir.
- Uygulama kodu dis importlarda sadece `@/integrations/shared` ve `@/integrations/hooks` kullanir.
- Alt-path importlar dis kullanimda yasaktir.
- Locale yapisi `src/locale/<lang>/` klasor standardi ile kurulur.
- Her dil klasorunde `index.ts` birlestirme noktasi bulunur.

## Temizlik Durumu

Kod tabaninda halen onceki proje alanina ait endpoint ve modul adlari bulunuyor. Bu ilk turda yalnizca branding, varsayilan env degerleri ve dokumantasyon katalog creator hedefiyle hizalanmistir; domain budama ikinci fazdir.
