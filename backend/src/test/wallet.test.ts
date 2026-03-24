// test/wallet.test.ts — Wallet testleri
import { describe, it, expect, afterAll } from "bun:test";
import { getTestApp, closeTestApp, registerUser, randomEmail, authHeaders } from "./setup";

afterAll(closeTestApp);

describe("Wallet — Bakiye", () => {
  it("yeni kullanici icin cuzdan olusturulur", async () => {
    const app = await getTestApp();
    const email = randomEmail();
    const { token } = await registerUser(app, { email, password: "Test1234!" });

    const res = await app.inject({
      method: "GET",
      url: "/api/wallet",
      headers: authHeaders(token!),
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.balance).toBeDefined();
  });

  it("deposit ile bakiye artar", async () => {
    const app = await getTestApp();
    const email = randomEmail();
    const { token } = await registerUser(app, { email, password: "Test1234!" });

    // Deposit
    const depositRes = await app.inject({
      method: "POST",
      url: "/api/wallet/deposit",
      headers: authHeaders(token!),
      payload: { amount: 500 },
    });
    expect(depositRes.statusCode).toBe(200);

    // Bakiye kontrol
    const walletRes = await app.inject({
      method: "GET",
      url: "/api/wallet",
      headers: authHeaders(token!),
    });
    const wallet = JSON.parse(walletRes.body);
    expect(parseFloat(wallet.balance)).toBeGreaterThanOrEqual(500);
  });

  it("islem gecmisi kaydi olusur", async () => {
    const app = await getTestApp();
    const email = randomEmail();
    const { token } = await registerUser(app, { email, password: "Test1234!" });

    await app.inject({
      method: "POST",
      url: "/api/wallet/deposit",
      headers: authHeaders(token!),
      payload: { amount: 100 },
    });

    const res = await app.inject({
      method: "GET",
      url: "/api/wallet/transactions",
      headers: authHeaders(token!),
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    const txList = Array.isArray(body) ? body : (body.data ?? body.transactions ?? []);
    expect(Array.isArray(txList)).toBe(true);
    expect(txList.length).toBeGreaterThanOrEqual(1);
  });

  it("auth olmadan deposit reddedilir", async () => {
    const app = await getTestApp();
    const res = await app.inject({
      method: "POST",
      url: "/api/wallet/deposit",
      payload: { amount: 100 },
    });
    expect(res.statusCode).toBe(401);
  });
});
