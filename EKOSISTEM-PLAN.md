# KatalogAI — Ekosistem Entegrasyon Plani

**Durum:** Canli
**Katman:** Yatay servis (tum katmanlara hizmet verir)
**Faz:** Aktif (Faz 0)

---

## Ekosistem Icerisindeki Rol

KatalogAI, farkli veritabanlarindan urun cekerek profesyonel kataloglar olusturan SaaS. Ekosistem genisledikce **tum platformlarin katalog/rapor motoru** olacak.

```
KatalogAI (BU PROJE)
├── Veri Kaynaklari (giris)
│   ├── Bereketfide DB    -> Fide urun katalogu
│   ├── VistaSeed DB      -> Tohum urun katalogu
│   ├── [Gelecek] B2B Pazaryeri DB -> Satici urunleri
│   └── [Gelecek] Tarim Ansiklopedisi -> Bitki kartlari
├── Ciktilar
│   ├── PDF katalog
│   ├── Email katalog
│   ├── [Gelecek] Dijital flipbook
│   └── [Gelecek] WhatsApp/Telegram paylasim
└── Tuketiciler
    ├── Bereketfide admin paneli
    ├── VistaSeed admin paneli
    ├── [Gelecek] B2B Pazaryeri satici paneli
    └── [Gelecek] Danismanlik Pazaryeri uzman profili
```

## Diger Modullerle Iletisim

| Modul | Yön | Iletisim Sekli | Detay |
|-------|-----|----------------|-------|
| **Bereketfide** | <- veri alir | DB okuma | Fide urunlerini cekmek icin bereketfide DB'sine baglanir |
| **VistaSeed** | <- veri alir | DB okuma | Tohum urunlerini cekmek icin vistaseed DB'sine baglanir |
| **B2B Pazaryeri** | <- veri alir | REST API | Satici urunlerini Content Federation API uzerinden ceker |
| **Tarim Ansiklopedisi** | <- veri alir | REST API | Bitki bilgi kartlari icin ansiklopedi API'sini kullanir |
| **Sera SaaS** | <- veri alir | REST API | Sera bazli urun/hasat raporlari icin veri ceker |
| **Maliyet Analizi** | -> veri verir | PDF export | Maliyet raporlarini PDF olarak olusturur |
| **Danismanlik Pazaryeri** | -> veri verir | Embed/API | Uzman profil sayfalarinda katalog embed |

## Yapilacak Isler

### P0 — Acil (Hafta 1-2)
- [ ] Mevcut Bereketfide + VistaSeed DB baglantilarini dogrula ve dokumante et
- [ ] Urun verisi standardizasyonuna uyum: yeni tarimsal metadata alanlarini katalog sablonlarina ekle
- [ ] Katalog sablonlarinda marka tutarliligi (Bereketfide ve VistaSeed marka tokenlari)

### P1 — Kisa Vade (Ay 1-2)
- [ ] Content Federation API entegrasyonu: urun verisini DB yerine API uzerinden de cekebilme
- [ ] Yeni sablon tipi: "Mevsimsel Oneri Katalogu" (ekim takvimi verisini kullanarak)
- [ ] Yeni sablon tipi: "Karsilastirma Tablosu" (urun karsilastirma icin)
- [ ] Email katalog gonderimini newsletter sistemiyle entegre et

### P2 — Orta Vade (Ay 3-6)
- [ ] B2B Pazaryeri entegrasyonu: coklu satici kataloglari
- [ ] Tarim ansiklopedisi entegrasyonu: bitki bilgi kartlari kataloglara eklenebilsin
- [ ] WhatsApp/Telegram uzerinden katalog paylasim
- [ ] Dijital flipbook ciktisi (web tabanli goruntuleyici)
- [ ] Next.js 16 yukseltme (mevcut 15)

### P3 — Uzun Vade (Ay 6+)
- [ ] Yapay zeka ile otomatik katalog olusturma (urun secimi, duzenleme, metin)
- [ ] Sera SaaS hasat raporlarini katalog formatinda sunma
- [ ] Coklu dil destegi (TR/EN/DE — Bereketfide/VistaSeed ile tutarli)
