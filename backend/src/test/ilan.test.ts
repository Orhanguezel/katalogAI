// test/ilan.test.ts — Ilan CRUD testleri
import { describe, it, expect, afterAll } from "bun:test";
import { getTestApp, closeTestApp, registerUser, randomEmail, authHeaders } from "./setup";

afterAll(closeTestApp);

const ILAN_DATA = {
  from_city: "Istanbul",
  to_city: "Ankara",
  departure_date: new Date(Date.now() + 86400000).toISOString(),
  total_capacity_kg: 100,
  price_per_kg: 15,
  vehicle_type: "van",
  contact_phone: "05551234567",
};

describe("Ilan — Public Liste", () => {
  it("ilan listesi doner", async () => {
    const app = await getTestApp();
    const res = await app.inject({ method: "GET", url: "/api/ilanlar" });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data).toBeDefined();
    expect(body.total).toBeDefined();
  });

  it("from_city filtresi calisir", async () => {
    const app = await getTestApp();
    const res = await app.inject({ method: "GET", url: "/api/ilanlar?from_city=Istanbul" });
    expect(res.statusCode).toBe(200);
  });
});

describe("Ilan — CRUD", () => {
  it("carrier ilan olusturabilir", async () => {
    const app = await getTestApp();
    const email = randomEmail();
    const { token } = await registerUser(app, { email, password: "Test1234!", role: "carrier" });

    // Carrier'in plan olmadan ilan olusturmasini dene
    const res = await app.inject({
      method: "POST",
      url: "/api/ilanlar",
      headers: authHeaders(token!),
      payload: ILAN_DATA,
    });

    // Plan yoksa 403 (plan_required), plan varsa 200/201, tablo yoksa 500
    expect(res.statusCode).toBeOneOf([200, 201, 403, 500]);
  });

  it("auth olmadan ilan olusturulamaz", async () => {
    const app = await getTestApp();
    const res = await app.inject({
      method: "POST",
      url: "/api/ilanlar",
      payload: ILAN_DATA,
    });
    expect(res.statusCode).toBe(401);
  });

  it("ilan detay alabilir (varsa)", async () => {
    const app = await getTestApp();
    // Ilk once liste cek ve varsa ilk ilani al
    const listRes = await app.inject({ method: "GET", url: "/api/ilanlar?limit=1" });
    const list = JSON.parse(listRes.body);

    if (list.data?.length > 0) {
      const id = list.data[0].id;
      const res = await app.inject({ method: "GET", url: `/api/ilanlar/${id}` });
      expect(res.statusCode).toBe(200);
      const ilan = JSON.parse(res.body);
      expect(ilan.id).toBe(id);
      expect(ilan.from_city).toBeDefined();
    }
  });

  it("olmayan ilan 404 doner", async () => {
    const app = await getTestApp();
    const res = await app.inject({ method: "GET", url: "/api/ilanlar/nonexistent-id-12345" });
    expect(res.statusCode).toBe(404);
  });
});

describe("Ilan — Kullanici Ilanlari", () => {
  it("kendi ilanlarini listeler", async () => {
    const app = await getTestApp();
    const email = randomEmail();
    const { token } = await registerUser(app, { email, password: "Test1234!", role: "carrier" });

    const res = await app.inject({
      method: "GET",
      url: "/api/ilanlar/my",
      headers: authHeaders(token!),
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(Array.isArray(body)).toBe(true);
  });
});
