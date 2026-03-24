# Katalog Creator Workspace

Bu klasor, yeni katalog creator urunu icin kullanilacak mevcut frontend + backend sablonunu barindirir. Repo koken olarak farkli projelerden turemis kalintilar iceriyor; bu nedenle ilk hedefimiz yapinin katalog odakli bir urune donusturulmesi icin tabani temizlemek.

## Mevcut Yapi

- `admin_panel/`: Next.js tabanli yonetim paneli ve editor arayuzu
- `backend/`: Fastify tabanli API, auth, site settings ve ortak servisler
- `catalog-editor.html`: ilk katalog editor konsepti
- `PLAN.md`: kaynak sablon projeden kalan eski plan dosyasi
- `project.portfolio.json`: eski proje metadatasi, bu dosya bu temizlik turunda bilincli olarak degistirilmedi

## Hedef Yon

Bu sablon, katalog creator icin asagidaki ihtiyaclara gore duzenlenecek:

- coklu dil destegi
- coklu template ve layout sistemi
- farkli veritabani veya API kaynaklarindan urun cekebilme
- AI destekli aciklama, ceviri ve icerik zenginlestirme
- PDF ve baski odakli katalog uretimi

## Calisma Notlari

- `admin_panel` ve `backend` su an calisabilir bir temel iskelet sunuyor.
- Kod tabaninda eski lojistik/pazaryeri alanina ait modul ve isimler bulunuyor.
- Ilk temizlik turu yalnizca adlandirma, dokumantasyon ve varsayilan gelistirme ayarlarina odaklanir.
- Domain modullerinin silinmesi veya yeniden tasarlanmasi ikinci fazda ele alinmalidir.

## Baslatma

### Backend

```bash
cd backend
cp .env.example .env
bun install
bun run dev
```

### Admin Panel

```bash
cd admin_panel
bun install
bun run dev
```

## Temizlik Notu

Bu klasorde `PLAN.md`, `SEO-PLAN.md` ve bazi modul adlari halen onceki projeden izler tasiyor. Bunlar bilerek toplu silinmedi; once katalog creator icin korunacak ortak altyapi kesinlestirilecek, sonra moduller kontrollu bicimde budanacak.
