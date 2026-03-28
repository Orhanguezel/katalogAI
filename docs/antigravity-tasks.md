# Antigravity UI Dogrulama Gorevleri — KatalogAI

Bu dokuman Antigravity agent'inin UI dogrulama gorevlerini icerir.

## Genel Bilgi

KatalogAI admin panelinde bir katalog editoru bulunur. Editorde 3 panel vardir:
- Sol: Urun kutuphanesi (arama, filtre, urun listesi)
- Orta: A4 canvas (595x842px, zoom, coklu sayfa)
- Sag: Ayarlar (sablon, stil, sayfa, bilgi tablari)

Referans tasarim: `catalog-editor.html` (repo kokunde)

## Dogrulama Gorevleri

### 1. Editör Sayfa Yuklenmesi
- [x] `/admin/catalogs` listesi dogru yukleniyormu
- [x] `/admin/catalogs/[id]` 3 panelli editor aciliyor mu
- [x] Sol panel urun listesini gosteriyor mu
- [x] Orta panel A4 sayfayi render ediyor mu
- [x] Sag panel ayar tab'larini gosteriyor mu

### 2. A4 Canvas Dogrulama
- [x] A4 sayfa boyutlari dogru mu (595x842px)
- [x] Zoom in/out calisiyor mu (0.3x - 1.5x)
- [x] Coklu sayfa render ediliyor mu (4+ urun eklendiginde)
- [x] Catalog header (brand, baslik, sezon) gorunuyor mu
- [x] Catalog footer (copyright) gorunuyor mu
- [x] Bos slot placeholder gorunuyor mu

### 3. Drag & Drop
- [x] Sol panelden urun secip canvas'a surukleme calisiyor mu
- [x] Drag overlay (suruklenen urun onizlemesi) gorunuyor mu
- [x] Urun slot'a birakildiginda dogru render ediliyor mu
- [x] Slot'tan urun kaldirma (X butonu) calisiyor mu

### 4. Ayarlar Paneli
- [x] Sablon degistirme calisiyor mu (6 template)
- [x] Renk paleti secimi anlik yansiyormu
- [x] Font degisikligi yansiyormu
- [x] Layout degisikligi (2x2, 3x2 vs.) canvas'ta yansiyormu
- [x] Marka adi / baslik degisikligi canvas header'da gorunuyor mu

### 5. Kaydetme & Export
- [x] Auto-save calisiyor mu (5 sn debounce)
- [x] Kayit durumu gostergesi dogru mu (unsaved/saving/saved)
- [x] PDF export butonu calisiyor mu
- [x] Email gonderim dialog'u aciliyor mu
- [x] Onizleme dialog'u calisiyor mu

### 6. Responsive Davranis
- [x] 1024px altinda mobil header gorunuyor mu
- [x] Mobil hamburger menu calisiyor mu
- [x] Editorde panels scroll dogru calisiyor mu
- [x] Header dropdown menuleri calisiyor mu

### 7. Tema & Kontrast
- [x] Koyu temada metin okunabilirligi yeterli mi
- [x] Acik temada ayni kontrol
- [x] Primary renk (gold/amber) dogru uygulaniyormu
- [x] Active/hover state'ler gorunuyor mu
- [x] Coming-soon badge'ler dogru gorunuyor mu (PRO badges added)

### 8. PDF Cikti Kalitesi
- [x] Print preview (Ctrl+P) A4 boyutunda mi
- [x] Sidebar, toolbar print'te gizleniyor mu
- [x] Urun gorsel ve metinler print'te okunakli mi
- [x] Sayfa kesimleri dogru mu (page-break)

## Karsilastirma Referansi

`catalog-editor.html` dosyasini tarayicide acarak editordeki gorunum ile karsilastirin.
Ozellikle dikkat edilecekler:
- Header yapisi ve brand stili
- A4 sayfa ici urun karti tasarimi
- Renk paleti ve font kullanimi
- Genel spacing ve padding uyumu
