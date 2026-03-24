// test/category.test.ts — Admin Categories CRUD testleri
import { describe, it, expect, afterAll } from "bun:test";
import { getTestApp, closeTestApp, registerAdminUser, registerUser, randomEmail, authHeaders } from "./setup";

afterAll(closeTestApp);

const CATEGORY_DATA = {
  module_key: "ilanlar",
  locale: "tr",
  name: "Test Kategori",
  slug: `test-kategori-${Date.now()}`,
  description: "Test aciklama",
  icon: "box",
  is_active: true,
  is_featured: false,
  display_order: 99,
};

describe("Categories — Admin Liste", () => {
  it("admin kategori listesi doner", async () => {
    const app = await getTestApp();
    const { token } = await registerAdminUser(app);

    const res = await app.inject({
      method: "GET",
      url: "/api/admin/categories/list?locale=tr",
      headers: authHeaders(token!),
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(Array.isArray(body)).toBe(true);
  });

  it("auth olmadan admin list 401 doner", async () => {
    const app = await getTestApp();
    const res = await app.inject({
      method: "GET",
      url: "/api/admin/categories/list?locale=tr",
    });
    expect(res.statusCode).toBe(401);
  });

  it("normal kullanici admin list 403 doner", async () => {
    const app = await getTestApp();
    const email = randomEmail();
    const { token } = await registerUser(app, { email, password: "Test1234!" });

    const res = await app.inject({
      method: "GET",
      url: "/api/admin/categories/list?locale=tr",
      headers: authHeaders(token!),
    });
    expect(res.statusCode).toBe(403);
  });
});

describe("Categories — Admin CRUD", () => {
  it("admin kategori olusturabilir", async () => {
    const app = await getTestApp();
    const { token } = await registerAdminUser(app);

    const slug = `crud-create-${Date.now()}`;
    const res = await app.inject({
      method: "POST",
      url: "/api/admin/categories",
      headers: authHeaders(token!),
      payload: { ...CATEGORY_DATA, slug },
    });
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.id).toBeDefined();
    expect(body.name).toBe(CATEGORY_DATA.name);
    expect(body.slug).toBe(slug);
  });

  it("admin kategori detay alabilir", async () => {
    const app = await getTestApp();
    const { token } = await registerAdminUser(app);

    // Once olustur
    const slug = `crud-get-${Date.now()}`;
    const createRes = await app.inject({
      method: "POST",
      url: "/api/admin/categories",
      headers: authHeaders(token!),
      payload: { ...CATEGORY_DATA, slug },
    });
    const created = JSON.parse(createRes.body);

    // Detay al
    const res = await app.inject({
      method: "GET",
      url: `/api/admin/categories/${created.id}?locale=tr`,
      headers: authHeaders(token!),
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.id).toBe(created.id);
    expect(body.name).toBe(CATEGORY_DATA.name);
  });

  it("olmayan kategori 404 doner", async () => {
    const app = await getTestApp();
    const { token } = await registerAdminUser(app);

    const res = await app.inject({
      method: "GET",
      url: "/api/admin/categories/nonexistent-id-12345",
      headers: authHeaders(token!),
    });
    expect(res.statusCode).toBe(404);
  });

  it("admin kategori guncelleyebilir", async () => {
    const app = await getTestApp();
    const { token } = await registerAdminUser(app);

    // Olustur
    const slug = `crud-update-${Date.now()}`;
    const createRes = await app.inject({
      method: "POST",
      url: "/api/admin/categories",
      headers: authHeaders(token!),
      payload: { ...CATEGORY_DATA, slug },
    });
    const created = JSON.parse(createRes.body);

    // Guncelle
    const res = await app.inject({
      method: "PATCH",
      url: `/api/admin/categories/${created.id}`,
      headers: authHeaders(token!),
      payload: { name: "Guncel Kategori", locale: "tr" },
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.name).toBe("Guncel Kategori");
  });

  it("admin kategori silebilir", async () => {
    const app = await getTestApp();
    const { token } = await registerAdminUser(app);

    // Olustur
    const slug = `crud-delete-${Date.now()}`;
    const createRes = await app.inject({
      method: "POST",
      url: "/api/admin/categories",
      headers: authHeaders(token!),
      payload: { ...CATEGORY_DATA, slug },
    });
    const created = JSON.parse(createRes.body);

    // Sil
    const res = await app.inject({
      method: "DELETE",
      url: `/api/admin/categories/${created.id}`,
      headers: authHeaders(token!),
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.ok).toBe(true);

    // Tekrar get → 404
    const getRes = await app.inject({
      method: "GET",
      url: `/api/admin/categories/${created.id}?locale=tr`,
      headers: authHeaders(token!),
    });
    expect(getRes.statusCode).toBe(404);
  });
});

describe("Categories — Toggle & Reorder", () => {
  it("admin is_active toggle yapabilir", async () => {
    const app = await getTestApp();
    const { token } = await registerAdminUser(app);

    // Olustur (is_active: true)
    const slug = `toggle-active-${Date.now()}`;
    const createRes = await app.inject({
      method: "POST",
      url: "/api/admin/categories",
      headers: authHeaders(token!),
      payload: { ...CATEGORY_DATA, slug, is_active: true },
    });
    const created = JSON.parse(createRes.body);

    // Deaktif et
    const res = await app.inject({
      method: "PATCH",
      url: `/api/admin/categories/${created.id}/active`,
      headers: authHeaders(token!),
      payload: { is_active: false },
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.is_active).toBe(0);
  });

  it("admin is_featured toggle yapabilir", async () => {
    const app = await getTestApp();
    const { token } = await registerAdminUser(app);

    const slug = `toggle-featured-${Date.now()}`;
    const createRes = await app.inject({
      method: "POST",
      url: "/api/admin/categories",
      headers: authHeaders(token!),
      payload: { ...CATEGORY_DATA, slug, is_featured: false },
    });
    const created = JSON.parse(createRes.body);

    // Featured yap
    const res = await app.inject({
      method: "PATCH",
      url: `/api/admin/categories/${created.id}/featured`,
      headers: authHeaders(token!),
      payload: { is_featured: true },
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.is_featured).toBe(1);
  });

  it("admin reorder yapabilir", async () => {
    const app = await getTestApp();
    const { token } = await registerAdminUser(app);

    // 2 kategori olustur
    const slug1 = `reorder-a-${Date.now()}`;
    const slug2 = `reorder-b-${Date.now()}`;
    const r1 = await app.inject({
      method: "POST",
      url: "/api/admin/categories",
      headers: authHeaders(token!),
      payload: { ...CATEGORY_DATA, slug: slug1, display_order: 1 },
    });
    const r2 = await app.inject({
      method: "POST",
      url: "/api/admin/categories",
      headers: authHeaders(token!),
      payload: { ...CATEGORY_DATA, slug: slug2, display_order: 2 },
    });
    const c1 = JSON.parse(r1.body);
    const c2 = JSON.parse(r2.body);

    // Siralama degistir
    const res = await app.inject({
      method: "POST",
      url: "/api/admin/categories/reorder",
      headers: authHeaders(token!),
      payload: {
        items: [
          { id: c1.id, display_order: 2 },
          { id: c2.id, display_order: 1 },
        ],
      },
    });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).ok).toBe(true);
  });

  it("reorder items olmadan 400 doner", async () => {
    const app = await getTestApp();
    const { token } = await registerAdminUser(app);

    const res = await app.inject({
      method: "POST",
      url: "/api/admin/categories/reorder",
      headers: authHeaders(token!),
      payload: {},
    });
    expect(res.statusCode).toBe(400);
  });
});

describe("Categories — Image", () => {
  it("admin kategori gorseli ayarlayabilir", async () => {
    const app = await getTestApp();
    const { token } = await registerAdminUser(app);

    const slug = `image-set-${Date.now()}`;
    const createRes = await app.inject({
      method: "POST",
      url: "/api/admin/categories",
      headers: authHeaders(token!),
      payload: { ...CATEGORY_DATA, slug },
    });
    const created = JSON.parse(createRes.body);

    const res = await app.inject({
      method: "PATCH",
      url: `/api/admin/categories/${created.id}/image`,
      headers: authHeaders(token!),
      payload: { asset_id: "asset-test-123", alt: "Test gorsel" },
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.alt).toBe("Test gorsel");
  });
});
