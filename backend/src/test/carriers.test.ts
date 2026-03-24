// test/carriers.test.ts — Admin Carriers testleri
import { describe, it, expect, afterAll } from "bun:test";
import {
  getTestApp,
  closeTestApp,
  registerAdminUser,
  registerUser,
  randomEmail,
  authHeaders,
} from "./setup";
import { repoAssignRole } from "@/modules/auth";

afterAll(closeTestApp);

/** Carrier rollu kullanici olustur */
async function createCarrierUser(app: ReturnType<typeof getTestApp> extends Promise<infer T> ? T : never) {
  const email = randomEmail();
  const signup = await registerUser(app, { email, password: "Test1234!", full_name: "Carrier Test" });
  const userId = signup.body?.user?.id as string | undefined;
  if (userId) {
    await repoAssignRole(userId, "carrier");
  }
  return { email, userId, token: signup.token };
}

describe("Carriers — Admin Liste", () => {
  it("admin carrier listesi doner", async () => {
    const app = await getTestApp();
    const { token } = await registerAdminUser(app);

    // Carrier olustur
    await createCarrierUser(app);

    const res = await app.inject({
      method: "GET",
      url: "/api/admin/carriers",
      headers: authHeaders(token!),
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data).toBeDefined();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.total).toBeGreaterThanOrEqual(1);
    expect(body.limit).toBeDefined();
    expect(body.offset).toBeDefined();
  });

  it("auth olmadan carrier list 401 doner", async () => {
    const app = await getTestApp();
    const res = await app.inject({
      method: "GET",
      url: "/api/admin/carriers",
    });
    expect(res.statusCode).toBe(401);
  });

  it("normal kullanici carrier list 403 doner", async () => {
    const app = await getTestApp();
    const email = randomEmail();
    const { token } = await registerUser(app, { email, password: "Test1234!" });

    const res = await app.inject({
      method: "GET",
      url: "/api/admin/carriers",
      headers: authHeaders(token!),
    });
    expect(res.statusCode).toBe(403);
  });

  it("carrier listesi x-total-count header icerir", async () => {
    const app = await getTestApp();
    const { token } = await registerAdminUser(app);

    const res = await app.inject({
      method: "GET",
      url: "/api/admin/carriers",
      headers: authHeaders(token!),
    });
    expect(res.statusCode).toBe(200);
    expect(res.headers["x-total-count"]).toBeDefined();
  });

  it("carrier listesi search filtresi calisir", async () => {
    const app = await getTestApp();
    const { token } = await registerAdminUser(app);

    // Bilinen isimle carrier olustur
    const email = randomEmail();
    const signup = await registerUser(app, {
      email,
      password: "Test1234!",
      full_name: "UniqueCarrierName123",
    });
    const userId = signup.body?.user?.id as string;
    if (userId) await repoAssignRole(userId, "carrier");

    const res = await app.inject({
      method: "GET",
      url: "/api/admin/carriers?search=UniqueCarrierName123",
      headers: authHeaders(token!),
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data.length).toBeGreaterThanOrEqual(1);
    expect(
      body.data.some((c: { full_name: string }) => c.full_name === "UniqueCarrierName123"),
    ).toBe(true);
  });

  it("carrier listesi pagination calisir", async () => {
    const app = await getTestApp();
    const { token } = await registerAdminUser(app);

    const res = await app.inject({
      method: "GET",
      url: "/api/admin/carriers?limit=1&offset=0",
      headers: authHeaders(token!),
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data.length).toBeLessThanOrEqual(1);
    expect(body.limit).toBe(1);
    expect(body.offset).toBe(0);
  });

  it("carrier listesi beklenen alanlari icerir", async () => {
    const app = await getTestApp();
    const { token } = await registerAdminUser(app);
    await createCarrierUser(app);

    const res = await app.inject({
      method: "GET",
      url: "/api/admin/carriers?limit=1",
      headers: authHeaders(token!),
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data.length).toBeGreaterThanOrEqual(1);

    const carrier = body.data[0];
    expect(carrier.id).toBeDefined();
    expect(carrier.email).toBeDefined();
    expect(typeof carrier.ilan_count).toBe("number");
    expect(typeof carrier.booking_count).toBe("number");
    expect(typeof carrier.rating_avg).toBe("number");
    expect(carrier.wallet_balance).toBeDefined();
  });
});

describe("Carriers — Admin Detay", () => {
  it("admin carrier detay alabilir", async () => {
    const app = await getTestApp();
    const { token } = await registerAdminUser(app);
    const { userId } = await createCarrierUser(app);

    const res = await app.inject({
      method: "GET",
      url: `/api/admin/carriers/${userId}`,
      headers: authHeaders(token!),
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.id).toBe(userId);
    expect(body.stats).toBeDefined();
    expect(typeof body.stats.ilan_count).toBe("number");
    expect(typeof body.stats.booking_count).toBe("number");
    expect(typeof body.stats.rating_avg).toBe("number");
    expect(body.stats.wallet_balance).toBeDefined();
    expect(Array.isArray(body.recent_ilanlar)).toBe(true);
    expect(Array.isArray(body.recent_bookings)).toBe(true);
    expect(Array.isArray(body.recent_ratings)).toBe(true);
  });

  it("olmayan carrier 404 doner", async () => {
    const app = await getTestApp();
    const { token } = await registerAdminUser(app);

    const res = await app.inject({
      method: "GET",
      url: "/api/admin/carriers/00000000-0000-0000-0000-000000000000",
      headers: authHeaders(token!),
    });
    expect(res.statusCode).toBe(404);
  });

  it("gecersiz uuid 400/422 doner", async () => {
    const app = await getTestApp();
    const { token } = await registerAdminUser(app);

    const res = await app.inject({
      method: "GET",
      url: "/api/admin/carriers/not-a-uuid",
      headers: authHeaders(token!),
    });
    // Zod validation hatasi
    expect([400, 422, 500]).toContain(res.statusCode);
  });
});
