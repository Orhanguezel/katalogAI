# Backend Kurallari

Bu dosya KatalogAI backend icin zorunlu gelistirme kurallarini tanimlar.

Amaç:

- controller, service, repository sinirlarini net tutmak
- tekrar eden mantigi tek kaynaga toplamak
- env, DB ve route katmaninda tutarlilik korumak
- yeni modül eklerken mevcut backend yapisini bozmamak

## 1. Genel Yapi

Backend su katmanlar uzerinden ilerler:

- `src/index.ts`
- `src/app.ts`
- `src/core/*`
- `src/common/*`
- `src/plugins/*`
- `src/db/*`
- `src/modules/*`

Genel kural:

- giris dosyalari ince olur
- modül icindeki sorumluluklar ayrilir
- tekrar eden mantik ilgili ortak katmana tasinir

## 2. Modul Sorumluluklari

Modul dosyalari mumkun oldugunca su sinirlarla yazilir:

- `router.ts` / `admin.routes.ts`
  route tanimi ve handler baglama
- `controller.ts` / `admin.controller.ts`
  request/response orchestration
- `service.ts`
  is kurali, orchestrasyon, domain logic
- `repository.ts`
  DB query katmani
- `validation.ts`
  zod schema ve request validation
- `schema.ts`
  domain shape / DTO / sabit schema tanimlari

Kural:

- controller DB query yazmaz
- repository HTTP cevabi sekillendirmez
- service response object formatlamak icin controller isini yapmaz
- validation mantigi controller icine dagitilmaz

## 3. Tekrar Yasak

Asagidaki seyler ikinci kez goruluyorsa ortaklastirilir:

- query helper
- date parse / format helper
- bool / int normalize helper
- pagination helper
- auth helper
- role guard helper
- SQL sonucu mapleme mantigi
- response error message helper

Kural:

- ayni fonksiyon farkli isimle ikinci kez yazilmaz
- ayni helper alias ile kopyalanmaz
- tek is yapan kodun tek kaynagi olur

## 3.1 Type Disiplini

- `any` kullanimi yasaktir.
- `as any` gecici kacis olarak da yazilmaz.
- Zorunlu belirsizlik durumunda `unknown` + type guard kullanilir.
- DB row, request body, error ve third-party sonuc daraltmalari en dar tip ile yazilir.
- Yeni helper veya repository refactor'unda tip gevsetmek yerine ortak type/helper tanimi eklenir.

## 4. Shared Katman Secimi

Backend tarafinda tekrar eden mantik dogru yere tasinmalidir.

Tercih sirası:

- modül ici ortak mantik ise `src/modules/<module>/...`
- birden fazla modül kullaniyorsa `src/modules/_shared`
- butun uygulama genelindeyse `src/core` veya `src/common`

Ornek:

- auth/permission yardimcilari `common` veya `core`
- db helper'lari `db`
- modül-ozel mapper `modules/<module>`
- birden fazla modülun kullandigi domain helper `modules/_shared`

## 4.1 Modul Içi Helpers Kurali

- Bir modülde birden fazla helper dosyasi olusuyorsa `src/modules/<module>/helpers/index.ts` acilir.
- Modül ici helper importlari mumkun oldugunca `./helpers` lokal barrel'i uzerinden yapilir.
- Lokal helper barrel explicit export ile yazilir; `export *` kullanilmaz.
- Modül kökunu helper dosyalariyla kirletmek yerine `helpers/` altina tasimak tercih edilir.
- Helper dosyalari controller/service/repository yerine parse, map, patch, builder ve normalize mantigini tasir.

## 5. Controller Kurali

Controller:

- input alir
- validation cagirir veya validate sonucu kullanir
- service/repository cagirir
- HTTP response dondurur

Controller icinde bulunmamasi gereken seyler:

- uzun business logic
- buyuk SQL bloklari
- tekrar eden normalize helper
- env parse
- config builder

## 6. Repository Kurali

Repository:

- DB ile konusur
- query calistirir
- DB sonucunu gerekli minimum shape'e indirir

Repository icinde bulunmamasi gereken seyler:

- Fastify request/reply kullanimi
- toast / UI mantigi benzeri formatlama
- env kaynakli branching
- route bilgisi

Kural:

- raw SQL yazilacaksa tek sorumlulukla yazilir
- ayni sorgu mantigi farkli yerde tekrar edilmez

## 7. Validation Kurali

Validation:

- request body
- params
- query
- admin/public ayrimi

icin ayri ve okunur kalmalidir.

Kurallar:

- validation schema controller icine dagitilmaz
- tekrar eden schema parcasi varsa ortaklastirilir
- admin/public varyantlari net ayrilir

## 8. Env ve Config Kurali

Env kaynakli tum varsayimlar tek noktadan okunur:

- `src/core/env.ts`

Kurallar:

- fallback degerler daginik dosyalarda yazilmaz
- `.env.example`, `docker-compose.yml` ve `env.ts` birbiriyle tutarli olur
- DB defaultlari ve portlar tek gercegi temsil eder

Bu projede ozellikle kontrol edilmesi gereken alanlar:

- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `PORT`
- `PUBLIC_URL`
- `FRONTEND_URL`
- storage ayarlari

Ek kural:

- env parse helper'lari tekrar eden lokal fonksiyonlar olarak yazilmaz
- ortak env parse mantigi `_shared` veya uygun ortak katmanda tek kaynakta tutulur

## 9. DB ve Seed Kurali

Seed ve schema tarafinda:

- SQL seed dosyalari amacina gore parcalanir
- modül datasi ile sistem konfigurasyonu karistirilmaz
- lokal gelistirme varsayimlari README ve `.env.example` ile uyumlu olur

Kural:

- seed mantigi runtime business logic ile karismaz
- DB baglanti ayarlari tek kaynakta kalir

## 10. Adlandirma

Backend tarafinda mevcut klasor yapisi tamamen tek standarda gecmis degil, ama yeni eklenen dosyalarda temiz ve tutarli isimlendirme uygulanir.

Kural:

- yeni dosya adlari mumkun oldugunca `kebab-case` tercih edilerek yazilir
- mevcut modül desenini bozacak rastgele adlar kullanilmaz
- `admin`, `controller`, `repository`, `validation`, `schema`, `service`, `router` suffix mantigi korunur

Not:

- var olan module adlari `siteSettings`, `emailTemplates`, `userRoles` gibi legacy isimler tasiyor olabilir
- yeni eklemede bu daginiklik buyutulmez

Ek kurallar:

- yeni fiziksel dosyalar `kebab-case` olur
- typo veya eski kalinti dosya adi yeniden uretilmez
- yorum basliginda `FILE:` kullaniliyorsa gercek path ile birebir uyusur

## 11. Import Disiplini

Kurallar:

- ayni dosyadan gelen importlar birlestirilir
- gereksiz derin import kullanilmaz
- type/runtime import ayrimi temiz tutulur
- bir yardimci zaten ortak yerdeyse kopyalanmaz
- modül disi kullanimda `@/modules/<module>` kok barrel tercih edilir
- `@/modules/<module>/router`, `admin.routes`, `service` gibi alt-path importlar sadece modül ici veya zorunlu istisnalarda kullanilir
- `@/modules/_shared` icin alt-path import tamamen yasaktir
- ortak helper, schema ve tipler dis kullanimda sadece `@/modules/_shared` uzerinden alinır
- `_shared` altindaki dosyalar sadece `_shared` klasoru icinden relative import ile birbirine baglanabilir
- modül icinde birden fazla helper dosyasi varsa dogrudan helper dosyasi yerine `./helpers` lokal barrel tercih edilir

## 11.1 Explicit Module Barrel

Aktif backend modüllerinde `index.ts` explicit barrel standardi uygulanir.

Kurallar:

- `index.ts` icinde `export *` kullanilmaz
- modül dis API explicit export listesi ile tanimlanir
- public route, admin route, controller, service, repository, validation ve type exportlari bilincli secilir
- modül ici relative importlar sadece refactor riski dusukse degistirilir
- ilk hedef dis kullanimdir; modül ici importlari zorla kok barrel'e cekmek yasaktir
- `_shared` da ayni kurala tabidir; dis kullanimda tek giris kapisi `@/modules/_shared` olur
- modül kök `index.ts` ve lokal `helpers/index.ts` birlikte calisir; biri digerinin yerine gecmez
- dis kullanim kok barrel'den, modül ici yardimci kullanim lokal helper barrel'den akar

Mevcut referans modüller:

- `siteSettings`
- `telegram`
- `auth`
- `notifications`
- `contact`
- `wallet`
- `theme`
- `dashboard`
- `reports`
- `audit`
- `bookings`
- `ilanlar`

## 12. Route ve Yetki Yuzeyi

Admin/public route ayrimi net tutulur.

Kurallar:

- admin route'lari net prefix ve route dosyalariyla ayrilir
- route registration `app.ts` uzerinde eksiksiz kontrol edilir
- var olan dosya sistemde durup route register edilmiyorsa bu bilincli olmalidir

Ozellikle kontrol:

- route dosyasi var mi
- `app.ts` icinde register edilmis mi
- guard/permission dogru uygulanmis mi

## 12.1 Locale ve Config Kaynagi

- Runtime locale listesi hardcoded tutulmaz; DB veya sistemin gercek config kaynagindan okunur.
- `core/i18n.ts` gibi runtime locale kullanan katmanlarda sabit dil listesi yazilmaz.
- Varsayim locale verisi gerekiyorsa bu tek kaynakta tutulur ve domain helper olarak export edilir; service/controller icinde kopyalanmaz.

## 13. Test Kurali

Yeni backend davranisi eklendiginde mumkun oldugunca test eklenir.

Mevcut test alanlari:

- `src/test/auth.test.ts`
- `src/test/booking.test.ts`
- `src/test/ilan.test.ts`

## 14. Son Kontrol Listesi

Kod tamamlanmis sayilmadan once su kontroller yapilir:

- modül dis importlar kök `index.ts` barrel uzerinden mi
- modül ici helper importlari lokal `helpers/index.ts` uzerinden mi
- `export *` eklendi mi
- `any` veya `as any` var mi
- yeni helper/service/repository mantigi ikinci kopya uretiyor mu
- yorum basliklari ve dosya adlari guncel mi
- `npx tsc --noEmit --incremental false --pretty false` temiz mi
- `src/test/wallet.test.ts`

Kural:

- regression riski olan davranis testsiz birakilmaz
- auth, booking, ilan, wallet gibi cekirdek alanlarda degisiklik yapiliyorsa test etkisi kontrol edilir

## 14. Dokumantasyon Kurali

Asagidaki dosyalar guncel tutulur:

- `README.md`
- `.env.example`
- gerekiyorsa bu dosya

Eski proje adi, eski marka veya gecersiz config dokumanda birakilmaz.

## 15. Yeni Modul Ekleme Sirasi

Onerilen sira:

1. route scope belirlenir
2. validation schema yazilir
3. repository katmani yazilir
4. service gerekiyorsa eklenir
5. controller yazilir
6. route dosyasi baglanir
7. `app.ts` registration kontrol edilir
8. env/config etkisi varsa dokuman guncellenir
9. test eklenir veya mevcut testler guncellenir

## 16. Kisa Kontrol Listesi

Bir degisiklik tamamlanmadan once su sorular sorulur:

- controller icinde fazla business logic var mi?
- repository icinde HTTP katmani mantigi var mi?
- validation controller icine dagildi mi?
- ayni helper baska isimle tekrar yazildi mi?
- env fallback'leri daginik yerlere kacmis mi?
- route dosyasi register edilmeyi unuttu mu?
- `.env.example` ve `README.md` guncellenmeli mi?
- test ihtiyaci dogdu mu?

Bu sorulardan biri problemliyse is tamamlanmis sayilmaz.
