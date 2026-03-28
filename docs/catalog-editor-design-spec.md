# Catalog Editor Design Specification

Bu dokuman `catalog-editor.html` prototipinden cikarilan tasarim spesifikasyonudur.
Codex ve diger agent'lar bu dosyayi referans alarak UI implementasyonu yapar.

## Renk Paleti

| Token | Hex | Kullanim |
|-------|-----|----------|
| bg-deep | #0a0c0a | Sayfa arka plani |
| bg-panel | #121512 | Panel arka planlari |
| bg-card | #1a1e1a | Kart arka planlari |
| bg-accent | #232a23 | Hover/active arka plan |
| primary | #c29d5d | Ana vurgu rengi (Gold/Amber) |
| primary-light | #e6c58d | Primary hover |
| primary-dim | rgba(194,157,93,0.15) | Primary arka plan |
| success | #4ade80 | Basari / tag rengi |
| text-main | #e2e8e2 | Ana metin |
| text-muted | #8a9a8a | Ikincil metin |
| text-dim | #4d5a4d | Ucuncu derece metin |
| border | rgba(255,255,255,0.06) | Kenarlik |
| border-hover | rgba(255,255,255,0.12) | Hover kenarlik |

## Tipografi

| Font | Aile | Kullanim |
|------|------|----------|
| Cormorant Garamond | Serif | Brand, basliklar, urun isimleri |
| Outfit | Sans-serif | UI metinleri, butonlar, label'lar |
| JetBrains Mono | Monospace | Fiyat, teknik bilgi |

## Spacing & Radius

| Token | Deger |
|-------|-------|
| radius-sm | 6px |
| radius-md | 10px |
| radius-lg | 20px |
| header-height | 64px |
| sidebar-width | 320px |
| settings-width | 300px |
| canvas-toolbar-height | 48px |

## Layout Yapisi

```
┌─────────────────────────────────────────────────────┐
│ Header (64px) — Brand | Actions                     │
├──────────┬──────────────────────┬───────────────────┤
│ Sidebar  │ Canvas               │ Settings          │
│ (320px)  │ (flex-1)             │ (300px)           │
│          │                      │                   │
│ Search   │ Toolbar (48px)       │ Katalog Bilgileri │
│ Filters  │ ┌──────────────┐    │ - Marka Adi       │
│ Products │ │ A4 Page      │    │ - Alt Baslik      │
│          │ │ 595 x 842    │    │ - Donem/Sezon     │
│          │ │              │    │                   │
│          │ │ [Grid Items] │    │ Yerlesim          │
│          │ │              │    │ [1x1] [2x2] [2x3]│
│          │ └──────────────┘    │                   │
│          │                      │ Tema Renkleri     │
│          │                      │ ○ ○ ○ ○          │
│          │                      │                   │
│          │                      │ Katalog Durumu    │
│          │                      │ N urun secildi    │
└──────────┴──────────────────────┴───────────────────┘
```

## Component Detaylari

### Header
- Yukseklik: 64px
- Arka plan: bg-panel
- Border-bottom: 1px solid border
- Sol: Brand icon (32x32, gradient primary) + "KatalogAI" (serif, 24px)
- Sag: "Taslak Kaydet" (ghost btn) + "PDF Disa Aktar" (primary btn)

### Sol Panel — Urun Kutuphanesi
- Baslik: "KUTUHANE" (11px, uppercase, letter-spacing 0.1em, primary renk)
- "+ Yeni Urun" butonu (primary, kucuk)
- Arama: 40px input, bg-card, focus: primary border + shadow
- Filtre tab'lari: pill seklinde, 6px 14px padding, 20px radius
  - Active: primary bg, koyu metin, bold
  - Inactive: bg-accent, #bbb metin
- Urun karti: flex row, 12px gap, 12px padding
  - Thumbnail: 56x56, 8px radius, object-fit cover
  - Isim: 14px, 500 weight, beyaz
  - Kod + fiyat: 11px, #ccc
  - Tag: 9px uppercase, pill, success-dim bg, success renk
  - Hover: bg-card, border highlight, scale(1.02)
  - Selected: primary-dim bg, primary border

### Orta — A4 Canvas
- Toolbar: 48px, backdrop-filter blur(12px), fixed top
  - Sol: Zoom kontrolleri (-/+/yuzde)
  - Orta: "A4 PORTRAIT (595x842)" mono label
  - Sag: "Temizle" ghost butonu
- Scroll alani: radial-gradient dot grid arka plan (20px aralik)
- A4 sayfa: 595x842px, beyaz bg, 40px padding, box-shadow
- Catalog header: brand (serif, 42px), alt baslik (13px uppercase), sezon, sayfa no
- Grid: 2 sutun, 24px gap (2x2 varsayilan)
- Urun kutusu:
  - Gorsel: aspect-ratio 1:1, #f7f9f7 bg, 1px #eee border
  - Baslik: serif, 20px
  - Aciklama: 12px, #333, line-height 1.5
  - Fiyat: mono, 14px, bold, siyah
- Bos slot: 2px dashed #ddd, aspect-ratio 1:1, "+Urun Ekleyin" metin
- Catalog footer: 10px, uppercase, #999, border-top 1px #eee

### Sag Panel — Ayarlar
- Padding: 24px
- Bolum basligi: 11px uppercase, letter-spacing 0.1em, text-dim, 600 weight
- Input: 36px, bg-card, border, 6px radius
- Label: 12px, beyaz, 500 weight
- Layout grid: 3 sutunlu grid, aspect-ratio 1:1, aktif: primary border + dim bg
- Renk swatchlari: 32px daire, 2px transparent border
  - Aktif: beyaz border, scale(1.1)

### Modal — Yeni Urun Ekle
- 400px genislik, 32px padding, 20px radius
- Baslik: serif, 24px, primary renk
- Gorsel upload: 120px dashed border, hover: primary border
- Form alanlari: 16px gap
- Butonlar: Vazgec (ghost) + Ekle (primary)

## Print / PDF Stilleri

```css
@media print {
  body { background: white; display: block; overflow: visible; }
  header, .sidebar, .settings, .toolbar, .toast, .empty-slot { display: none; }
  .a4-page {
    width: 210mm; height: 297mm; padding: 15mm;
    box-shadow: none; border: none; background: white;
    page-break-after: always; overflow: hidden;
  }
  .catalog-item { break-inside: avoid; }
  @page { size: A4 portrait; margin: 0; }
}
```

## Animasyonlar

- fadeIn: opacity 0->1, translateY 10px->0, 0.5s ease
- Transition: cubic-bezier(0.4, 0, 0.2, 1), 0.2s
- Toast: translateY 100px->0, cubic-bezier(0.175, 0.885, 0.32, 1.275)
- Hover scale: 1.02 (urun kartlari), 1.1 (renk swatchi)
