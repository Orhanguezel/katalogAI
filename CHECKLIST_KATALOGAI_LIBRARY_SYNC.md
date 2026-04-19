# KatalogAI → Ekosistem Library Sync Checklist

**Bağlam.** KatalogAI'da "Kaydet" basıldığında, katalog hangi hedef marka için
yapılıyorsa (BereketFide / VistaSeed / vb.) o hedefin DB'sindeki `library`
tablosuna otomatik olarak TASLAK olarak yazılır. Mevcut iki aşamalı akış
("Kaydet → katalog_creator", "Yayınla butonu → hedef library") TEK ADIMLI akışa
dönüştürülür.

**Onaylanan kurgu.** Seçenek 2 — explicit hedef (`catalogs.target_source_id`)
+ referans tablosu (`catalog_library_refs`) + PDF lazy render.

**Etkilenen projeler.** KatalogAI (büyük değişiklik), BereketFide (değişiklik
YOK — sadece admin `/library` sayfasında taslakları görüp onaylayacak),
VistaSeed (değişiklik YOK).

**Son güncelleme.** 2026-04-19

---

## 0. Karar / Tasarım Özeti

- [x] **Hedef modeli:** Tek katalog tek hedef markaya yazılır. Çoklu hedef V2'ye ertelendi.
- [x] **Persist:** `catalogs.target_source_id` (explicit) + `catalog_library_refs` (upsert takibi).
- [x] **Tetik:** `POST /admin/catalogs` ve `PATCH /admin/catalogs/:id` sonunda best-effort sync (ana response etkilenmez).
- [x] **PDF:** Kaydet'te render YOK. Library row `file_url=NULL` taslak olarak atılır. PDF sadece "Yayınla" / "PDF İndir" anında üretilir; o an `library_files.file_url` set edilir.
- [x] **Upsert:** Aynı catalog_id için hedef DB'de **tek** library row tutulur. İkinci kaydet = UPDATE.

---

## 1. Schema Değişikliği (KatalogAI DB: `katalog_creator`)

### 1.1 Seed SQL
- [ ] `projects/katalogAI/backend/src/db/seed/sql/040_catalog_seed.sql` (veya ilgili schema dosyası) — `catalogs` CREATE TABLE tanımına ekle:
  - `target_source_id CHAR(36) NULL AFTER slug`
  - `INDEX catalogs_target_source_idx (target_source_id)`
  - `FOREIGN KEY (target_source_id) REFERENCES product_sources(id) ON DELETE SET NULL`
- [ ] Aynı SQL dosyasının sonuna yeni tablo:
  ```sql
  CREATE TABLE catalog_library_refs (
    id CHAR(36) PRIMARY KEY,
    catalog_id CHAR(36) NOT NULL,
    source_id CHAR(36) NOT NULL,
    library_id CHAR(36) NOT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    UNIQUE KEY catalog_source_uq (catalog_id, source_id),
    INDEX catalog_library_refs_catalog_idx (catalog_id),
    INDEX catalog_library_refs_source_idx (source_id),
    FOREIGN KEY (catalog_id) REFERENCES catalogs(id) ON DELETE CASCADE,
    FOREIGN KEY (source_id) REFERENCES product_sources(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  ```

### 1.2 Drizzle Schema
- [ ] `projects/katalogAI/backend/src/modules/catalogs/schema.ts`:
  - `catalogs` tablosuna `target_source_id: char('target_source_id', { length: 36 })` + index + FK
  - Yeni export `catalogLibraryRefs` tablo tanımı
  - Type export: `CatalogLibraryRef`, `NewCatalogLibraryRef`

### 1.3 Canlı DB Migration
VPS'te **veri koruyarak** tek seferlik migration:
- [ ] `ALTER TABLE catalog_creator.catalogs ADD COLUMN target_source_id CHAR(36) NULL AFTER slug, ADD INDEX catalogs_target_source_idx (target_source_id);`
- [ ] FK ekle: `ALTER TABLE catalog_creator.catalogs ADD CONSTRAINT fk_catalogs_target_source FOREIGN KEY (target_source_id) REFERENCES product_sources(id) ON DELETE SET NULL;`
- [ ] `CREATE TABLE catalog_creator.catalog_library_refs (...);`
- [ ] Mevcut `eebb41c9-...` catalog için `target_source_id` NULL kalır → kullanıcı ilk edit'te UI'dan set eder.

> **Not:** Seed SQL güncellenmediği sürece bir sonraki `db:seed:fresh` deploy'da şema bozulur. Adım 1.1 mutlaka 1.3'ten ÖNCE veya birlikte yapılmalı.

---

## 2. Backend — Sync Service

### 2.1 Yeni dosya: `modules/exports/sync-service.ts`
- [ ] `syncCatalogToTarget(catalogId: string): Promise<SyncResult>` fonksiyonu:
  1. Catalog'u yükle. `target_source_id` NULL ise no-op döner.
  2. Hedef `product_source`'u yükle. `is_active=0` veya `source_type != 'database'` ise no-op + log.
  3. `getSourceConnection(...)` ile hedef DB drizzle instance al.
  4. `catalog_library_refs` lookup:
     - Ref var → hedef DB'de `library` + `library_i18n` row'larını bul, `name`, `description`, `image_url`, `featured_image` güncelle. `file_url` alanına dokunma. `is_published` değiştirme.
     - Ref yok → hedef DB'de `library` (is_published=0, is_active=1, file_url yok), `library_i18n` INSERT. Master DB'de `catalog_library_refs` INSERT.
  5. Dönüş: `{ ok: true, library_id, action: 'insert' | 'update' }` veya `{ ok: false, error }`.
- [ ] Hata yönetimi: hiçbir exception yukarı fırlamaz — caller best-effort kullanıyor.

### 2.2 Create / Update entegrasyonu
- [ ] `modules/catalogs/admin.controller.ts`:
  - `adminCreateCatalog`: create sonrası `await syncCatalogToTarget(result.id).catch(logErr)`. Response etkilenmez.
  - `adminUpdateCatalog`: update sonrası aynı çağrı.
- [ ] `modules/catalogs/validation.ts`:
  - `createCatalogSchema`: `target_source_id: z.string().uuid().nullable().optional()` (create'te zorunlu olması admin panelde enforce edilir, backend nullable kabul eder — geriye dönük uyumluluk).
  - `updateCatalogSchema`: aynı alan opsiyonel.
- [ ] `modules/catalogs/repository.ts`:
  - `repoCreateCatalog` / `repoUpdateCatalog` → INSERT/UPDATE SQL'lerine `target_source_id` alanı eklensin.

### 2.3 Publish servis güncellemesi
- [ ] `modules/exports/publish-service.ts`:
  - Mevcut "her seferinde yeni library row yarat" mantığını **kaldır**.
  - Yeni akış:
    1. `catalog_library_refs` lookup.
    2. Ref yoksa önce `syncCatalogToTarget` çağır (veya benzeri logic — ref garantili olsun).
    3. PDF render → PDF URL set.
    4. Hedef DB'de `library_files` UPSERT (catalog_library_refs.library_id'ye bağlı):
       - Var → `file_url`, `size_bytes`, `mime_type` update.
       - Yok → INSERT.
    5. `library.is_published` DEĞİŞTİRİLMEZ (kullanıcı bereketfide admin'inden onaylar).
- [ ] Publish dialog hâlâ çalışır — sadece PDF yükleme rolü oynar.

---

## 3. Admin Panel UI (KatalogAI)

### 3.1 Catalog Create Dialog
- [ ] `src/app/(main)/admin/(admin)/catalogs/_components/catalog-create-dialog.tsx`:
  - "Hedef Marka" dropdown'u ekle (zorunlu alan).
  - Veri kaynağı: `useListProductSourcesAdminQuery({ is_active: 1, source_type: 'database' })`.
  - Form submit'te `target_source_id` mutation'a dahil edilir.
- [ ] Zorunlu alan validation: hedef seçilmeden submit olmaz.

### 3.2 Catalog Builder
- [ ] `src/app/(main)/admin/(admin)/catalogs/[id]/_components/tab-catalog-info.tsx` (veya topbar):
  - "Hedef: **Bereket Fide**" şeklinde readonly badge göster.
  - Hedef değiştirme butonu **YOK** (V2'ye ertelendi — değiştirilirse eski hedefin library row'u yetim kalır, bu ayrı bir tasarım kararı).

### 3.3 Types + Endpoints
- [ ] `src/integrations/shared/catalogs/types.ts` — `Catalog` interface'e `target_source_id: string | null` ekle.
- [ ] `src/integrations/endpoints/admin/catalogs-admin-endpoints.ts` — `createCatalogAdmin` / `updateCatalogAdmin` payload tiplerine alan ekle.

---

## 4. BereketFide / VistaSeed

- [x] Backend → değişiklik **YOK** (library modülü zaten kayıtlı).
- [x] Admin panel → değişiklik **YOK** (`/admin/library` sayfası zaten hazır, taslakları listeliyor, `is_published` toggle detay sayfasında var).
- [x] Frontend `/kataloglar` → değişiklik **YOK** (public endpoint default'u `is_published=1` filtresi uyguluyor).

---

## 5. Deploy

### 5.1 Commit + push
- [ ] KatalogAI seed SQL + schema.ts + backend servis + admin panel UI tek branch'e commit + push.
- [ ] BereketFide tarafında kod değişikliği YOK; sadece bu checklist commit edilir.

### 5.2 Canlı (VPS)
- [ ] `ssh vps-vistainsaat "cd /var/www/katalogAI && git pull"`
- [ ] Canlı MySQL migration (adım 1.3 SQL'leri çalıştır)
- [ ] Backend build: `cd /var/www/katalogAI/backend && bun run build`
- [ ] Admin panel build: `cd /var/www/katalogAI/admin_panel && bun run build`
- [ ] `pm2 restart katalogai-backend katalogai-admin katalogai-thecatalogia`

### 5.3 Rollback planı
- [ ] Commit hash kaydet (git pull öncesi HEAD).
- [ ] Sorun çıkarsa: `git reset --hard <oldHEAD>` + tekrar build + restart.
- [ ] DB rollback: kolon silme gerekirse `ALTER TABLE catalogs DROP FOREIGN KEY fk_catalogs_target_source, DROP COLUMN target_source_id; DROP TABLE catalog_library_refs;` (veri korunmaz, bilinçli tercih).

---

## 6. Smoke Test (Canlı)

- [ ] **Test 1 — Yeni katalog:** KatalogAI'da yeni katalog oluştur, hedef: Bereket Fide. Kaydet'e bas.
  - Beklenti: `bereketfide.library` tablosunda 1 yeni row (is_published=0, file_url NULL).
  - Beklenti: `katalog_creator.catalog_library_refs` tablosunda 1 yeni row.
- [ ] **Test 2 — Admin görünürlük:** `https://www.bereketfide.com/admin/library` → taslak görünüyor mu? Status "Taslak" badge.
- [ ] **Test 3 — Tekrar kaydet:** KatalogAI'da aynı katalogu değiştirip tekrar Kaydet.
  - Beklenti: `bereketfide.library` tablosunda hâlâ **1 row** (yeni row OLUŞMAZ). Sadece name/description/image update.
- [ ] **Test 4 — Yayınla (PDF):** KatalogAI'da "Yayınla" dialog'undan çalıştır.
  - Beklenti: `bereketfide.library_files` tablosunda PDF URL yazılır. `library.is_published` hâlâ 0.
- [ ] **Test 5 — BereketFide onay:** Admin panelden katalogu aç → `is_published=1` yap → kaydet.
  - Beklenti: `https://www.bereketfide.com/tr/kataloglar` sayfasında yeni kart görünür, PDF indirilebilir.

---

## 7. Riskler ve Notlar

- [ ] **Hedef değiştirme:** İlk sürümde UI'dan değiştirilemez. İleride değiştirilecekse eski ref silinmeli + hedef DB'deki library row temizlenmeli.
- [ ] **Sync hatası:** Hedef DB erişilemezse `syncCatalogToTarget` log'a yazar ama catalog kaydetme başarısız olmaz. Kullanıcı Kaydet aldıktan sonra admin'de görmezse log kontrolü gerekir.
- [ ] **PDF yoksa:** Taslak library row'u `file_url=NULL` ile görünür. Admin panelde "PDF henüz üretilmedi" işaretlemek opsiyonel iyileştirme.
- [ ] **product_source silinirse:** `ON DELETE SET NULL` sayesinde catalog'un target'ı NULL olur ama catalog ve library refs yetim kalır → manuel temizlik gerekir (V2).
- [ ] **ALTER TABLE uyarısı:** Seed SQL güncellenmeden canlı ALTER atılırsa, bir sonraki fresh seed deploy'da kolon kaybolur. İki adım **birlikte** yapılmalı.

---

## 8. İş Yükü Tahmini

| Bölüm | Tahmin |
|-------|--------|
| Schema + seed SQL + Drizzle | 30 dk |
| Backend (sync + controller + publish update) | 2 s |
| Admin panel UI | 2 s |
| Test + deploy | 1 s |
| **Toplam** | **~6 saat** |

---

## 9. İlgili Dosyalar (Hızlı Referans)

- [backend/src/modules/catalogs/schema.ts](backend/src/modules/catalogs/schema.ts)
- [backend/src/modules/catalogs/admin.controller.ts](backend/src/modules/catalogs/admin.controller.ts)
- [backend/src/modules/exports/publish-service.ts](backend/src/modules/exports/publish-service.ts)
- [admin_panel/src/app/(main)/admin/(admin)/catalogs/_components/catalog-create-dialog.tsx](admin_panel/src/app/(main)/admin/(admin)/catalogs/_components/catalog-create-dialog.tsx)
- `packages/shared-backend/modules/library/schema.ts` — ekosistem repo'sunun `packages/` dizininde; KatalogAI repo'su dışında.
- BereketFide tarafındaki eşdeğer checklist: `projects/bereketfide/CHECKLIST_KATALOGAI_LIBRARY_SYNC.md` (aynı içerik, BereketFide repo'sunda).
