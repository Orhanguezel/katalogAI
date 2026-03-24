// test/withdrawal.test.ts — Para çekme testleri
import { describe, it, expect, afterAll } from "bun:test";
import { getTestApp, closeTestApp, registerUser, registerAdminUser, randomEmail, authHeaders } from "./setup";

afterAll(closeTestApp);

async function addBalance(app: any, token: string, amount: number) {
  await app.inject({
    method: "POST",
    url: "/api/wallet/deposit",
    headers: authHeaders(token),
    payload: { amount, description: "Test balance" },
  });
}

async function addBank(app: any, token: string) {
  await app.inject({
    method: "PUT",
    url: "/api/carrier-bank",
    headers: authHeaders(token),
    payload: {
      iban: "TR123456789012345678901234",
      account_holder: "Test Carrier",
      bank_name: "Test Bank",
    },
  });
}

describe("Withdrawal — Para Çekme", () => {
  it("bakiyesi yetersizken hata döner", async () => {
    const app = await getTestApp();
    const email = randomEmail();
    const { token } = await registerUser(app, { email, password: "Test1234!", role: "carrier" });
    await addBank(app, token!);

    const res = await app.inject({
      method: "POST",
      url: "/api/withdrawal",
      headers: authHeaders(token!),
      payload: { amount: 100 },
    });
    
    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.body);
    expect(body.error.message).toBe("insufficient_balance");
  });

  it("banka hesabı yokken hata döner", async () => {
    const app = await getTestApp();
    const email = randomEmail();
    const { token } = await registerUser(app, { email, password: "Test1234!", role: "carrier" });
    await addBalance(app, token!, 500);

    const res = await app.inject({
      method: "POST",
      url: "/api/withdrawal",
      headers: authHeaders(token!),
      payload: { amount: 100 },
    });
    
    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.body);
    expect(body.error.message).toBe("no_bank_account");
  });

  it("başarılı çekim talebi oluşturulur ve bakiye düşer", async () => {
    const app = await getTestApp();
    const email = randomEmail();
    const { token } = await registerUser(app, { email, password: "Test1234!", role: "carrier" });
    await addBalance(app, token!, 1000);
    await addBank(app, token!);

    const res = await app.inject({
      method: "POST",
      url: "/api/withdrawal",
      headers: authHeaders(token!),
      payload: { amount: 400 },
    });
    
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.status).toBe("pending");
    expect(parseFloat(body.amount)).toBe(400);

    // Bakiye kontrol
    const walletRes = await app.inject({
      method: "GET",
      url: "/api/wallet",
      headers: authHeaders(token!),
    });
    const wallet = JSON.parse(walletRes.body);
    expect(parseFloat(wallet.balance)).toBe(600);
  });

  it("admin talepleri listeleyebilir", async () => {
    const app = await getTestApp();
    const admin = await registerAdminUser(app);

    const res = await app.inject({
      method: "GET",
      url: "/api/admin/withdrawals",
      headers: authHeaders(admin.token!),
    });
    
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data).toBeDefined();
    expect(Array.isArray(body.data)).toBe(true);
  });

  it("admin talebi onaylayabilir", async () => {
    const app = await getTestApp();
    const admin = await registerAdminUser(app);
    
    // Create req
    const email = randomEmail();
    const { token } = await registerUser(app, { email, password: "Test1234!", role: "carrier" });
    await addBalance(app, token!, 1000);
    await addBank(app, token!);
    const createRes = await app.inject({
      method: "POST",
      url: "/api/withdrawal",
      headers: authHeaders(token!),
      payload: { amount: 300 },
    });
    const withdrawalId = JSON.parse(createRes.body).id;

    // Process
    const processRes = await app.inject({
      method: "PUT",
      url: `/api/admin/withdrawals/${withdrawalId}/process`,
      headers: authHeaders(admin.token!),
      payload: { status: "completed", admin_notes: "Ödendi" },
    });
    
    expect(processRes.statusCode).toBe(200);
    const body = JSON.parse(processRes.body);
    expect(body.status).toBe("completed");
    expect(body.admin_notes).toBe("Ödendi");
  });

  it("admin talebi reddedince bakiye iade edilir", async () => {
    const app = await getTestApp();
    const admin = await registerAdminUser(app);
    
    // Create req
    const email = randomEmail();
    const { token } = await registerUser(app, { email, password: "Test1234!", role: "carrier" });
    await addBalance(app, token!, 1000); // Start 1000
    await addBank(app, token!);
    const createRes = await app.inject({
      method: "POST",
      url: "/api/withdrawals",
      headers: authHeaders(token!),
      payload: { amount: 300 },
    });
    const withdrawalId = JSON.parse(createRes.body).id;

    // Reject
    const processRes = await app.inject({
      method: "PUT",
      url: `/api/admin/withdrawals/${withdrawalId}/process`,
      headers: authHeaders(admin.token!),
      payload: { status: "rejected", admin_notes: "Banka bilgisi hatalı" },
    });
    
    expect(processRes.statusCode).toBe(200);

    // Bakiye kontrol (1000 olmalı tekrar)
    const walletRes = await app.inject({
      method: "GET",
      url: "/api/wallet",
      headers: authHeaders(token!),
    });
    const wallet = JSON.parse(walletRes.body);
    expect(parseFloat(wallet.balance)).toBe(1000);
  });
});
