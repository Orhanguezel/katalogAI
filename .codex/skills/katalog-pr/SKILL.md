---
name: katalog-pr
description: >
  KatalogAI projesine ozel PR olusturma skill'i.
  Commit mesaji, branch adlandirma ve PR formati standartlari.
---

# KatalogAI PR Creator Skill

## Branch Adlandirma

```
feat/catalog-templates        — Yeni ozellik
fix/pdf-export-layout         — Bug fix
test/catalog-builder          — Test ekleme
refactor/product-source       — Refactoring
chore/docker-health-check     — Bakim/altyapi
```

## Commit Mesaji

```
<tip>(<kapsam>): <kisa aciklama>

Ornekler:
feat(backend): add catalog template CRUD endpoints
fix(admin): resolve PDF export page break issue
test(backend): add catalog and template tests
refactor(backend): extract product source service
chore(docker): add health check endpoint
```

Kapsam: `backend`, `admin`, `docker`, `db`

## PR Acmadan Once

```bash
# Backend degistiyse:
cd backend && bun run build && bun test

# Admin degistiyse:
cd admin_panel && bun run build
```

**HEPSI basariliysa** PR ac. Biri basarisizsa ONCE DUZELT.

## PR Formati

```bash
gh pr create --title "<tip>(<kapsam>): <baslik>" --body "$(cat <<'EOF'
## Ozet
- <ne yapildi 1>
- <ne yapildi 2>

## Degisiklik Turu
- [ ] Yeni ozellik (feat)
- [ ] Bug duzeltme (fix)
- [ ] Test
- [ ] Refactoring
- [ ] Altyapi/bakim

## Test Edilen
- [ ] `bun test` gecti (backend)
- [ ] `bun run build` basarili (admin)
- [ ] Manuel test yapildi
- [ ] Mevcut testler kirilmadi

## Etkilenen Moduller
- backend/src/modules/xxx
- admin_panel/src/app/xxx

## Kontrol
- [ ] TypeScript strict uyumlu
- [ ] Console.log kalmadi
- [ ] 200 satir limiti asilmadi
- [ ] Yeni route routes.ts'e eklendi (app.ts'e degil)
EOF
)"
```

## Yapilmayacaklar

- `main` branch'e direkt push
- `--force` push
- `--no-verify` ile hook atlama
- WIP (is bitmeden) PR acma
- Bos commit
