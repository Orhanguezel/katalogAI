# Katalog Creator Backend

Bu servis katalog creator projesinin Fastify tabanli API katmanidir.

## Rol

Backend asagidaki alanlara zemin saglar:

- auth ve yonetim API'leri
- site settings ve coklu dil konfigurasyonu
- storage ve medya yonetimi
- urun kaynagi baglantilari icin ortak entegrasyon katmani
- katalog, template ve export surecleri icin cekirdek servisler

## Gelistirme Kurallari

- [BACKEND_RULES.md](/home/orhan/Documents/Projeler/katalogAI/backend/BACKEND_RULES.md)
- [CLAUDE.md](/home/orhan/Documents/Projeler/katalogAI/CLAUDE.md)

## Calistirma

### 1. Env dosyasini olustur

```bash
cp .env.example .env
```

### 2. Veritabanini hazirla

Lokal docker-compose kullanacaksan:

```bash
docker compose up -d db
```

Bu compose varsayilan olarak sunlari kullanir:

- `DB_NAME=katalog_creator`
- `DB_USER=app`
- `DB_PASSWORD=app`

### 3. Backend'i baslat

```bash
bun run dev
```

## Sik Gorulen Hata

### `Access denied for user 'app'@'localhost' to database 'katalog_creator'`

Anlami:

- backend `.env` icinde `DB_USER=app`, `DB_PASSWORD=app`, `DB_NAME=katalog_creator` ile acilmaya calisiyor
- ama MySQL tarafinda bu kullanicinin bu veritabanina yetkisi yok

Cozum:

```sql
CREATE DATABASE IF NOT EXISTS katalog_creator;
CREATE USER IF NOT EXISTS 'app'@'localhost' IDENTIFIED BY 'app';
GRANT ALL PRIVILEGES ON katalog_creator.* TO 'app'@'localhost';
FLUSH PRIVILEGES;
```

## Env Notlari

- `src/core/env.ts` fallback olarak `DB_NAME=katalog_creator` kullanir.
- `.env.example` lokal gelistirme icin nortr bir baslangic sunar.
- `STORAGE_DRIVER=local` veya `cloudinary` olarak ayarlanabilir.

## Temizlik Durumu

Kod tabaninda halen onceki projeden kalan domain modulleri ve test script adlari vardir. Bu ilk turda servis branding'i, README ve varsayilan gelistirme degerleri duzeltilmistir; modul budama sonraki fazda yapilmalidir.
