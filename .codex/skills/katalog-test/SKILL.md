---
name: katalog-test
description: >
  KatalogAI projesine ozel test yazma skill'i.
  Backend: Bun test + Fastify inject. Admin: Vitest + React Testing Library.
---

# KatalogAI Test Generator Skill

## Mevcut Test Altyapisi

### Backend
```
backend/src/test/
├── auth.test.ts           — register, login, password reset
├── category.test.ts       — kategori CRUD
└── api.test.ts            — health, genel API
```

Calistirma:
```bash
cd backend && bun test src/test/
bun test:auth
bun test:category
```

### Admin Panel (HENUZ YOK — olusturulacak)

Gerekli paketler:
```bash
cd admin_panel
bun add -D vitest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react jsdom
```

## Backend Test Pattern

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { buildApp } from '../app';
import type { FastifyInstance } from 'fastify';

describe('GET /api/catalogs', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('katalog listesi doner', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/catalogs' });
    expect(res.statusCode).toBe(200);
  });

  it('auth olmadan protected route 401', async () => {
    const res = await app.inject({ method: 'POST', url: '/api/catalogs' });
    expect(res.statusCode).toBe(401);
  });
});
```

## Oncelik Sirasi (Yeni Testler)

1. `modules/catalogs/` — CRUD, template secimi
2. `modules/products/` — urun cekme, filtreleme
3. `modules/productSources/` — veritabani baglanti, sorgulama
4. `modules/templates/` — sablon CRUD
5. `modules/exports/` — PDF uretim, email gonderim

## Kurallar

- Test dosyasi: `*.test.ts` veya `*.test.tsx`
- Test dosyasi test ettigi dosyanin yaninda veya `__tests__/` altinda
- API call'lari MOCK'la (`vi.mock`)
- Her test beforeEach'te state temizle
- Coverage hedefi: yeni kod icin %80+
