// test/carrier-bank.test.ts — Taşıyıcı banka hesabı testleri
import { describe, it, expect, afterAll } from "bun:test";
import { getTestApp, closeTestApp, registerUser, randomEmail, authHeaders } from "./setup";

afterAll(closeTestApp);

describe("Carrier Bank Account", () => {
  it("taşıyıcı banka hesabı ekleyebilir", async () => {
    const app = await getTestApp();
    const email = randomEmail();
    const { token } = await registerUser(app, { email, password: "Test1234!", role: "carrier" });

    const res = await app.inject({
      method: "PUT",
      url: "/api/carrier-bank",
      headers: authHeaders(token!),
      payload: {
        iban: "TR112233445566778899001122",
        account_holder: "Ahmet Yılmaz",
        bank_name: "T.C. Ziraat Bankası",
      },
    });
    
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.iban).toBe("TR112233445566778899001122");
    expect(body.account_holder).toBe("Ahmet Yılmaz");
  });

  it("banka hesabı bilgilerini alabilir", async () => {
    const app = await getTestApp();
    const email = randomEmail();
    const { token } = await registerUser(app, { email, password: "Test1234!", role: "carrier" });
    
    // Create first
    await app.inject({
      method: "PUT",
      url: "/api/carrier-bank",
      headers: authHeaders(token!),
      payload: { iban: "TR001122334455667788990011", account_holder: "Mehmet Demir", bank_name: "Garanti" },
    });

    const res = await app.inject({
      method: "GET",
      url: "/api/carrier-bank",
      headers: authHeaders(token!),
    });
    
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.iban).toBe("TR001122334455667788990011");
  });

  it("geçersiz IBAN (Zod) ile ekleme reddedilir", async () => {
    const app = await getTestApp();
    const email = randomEmail();
    const { token } = await registerUser(app, { email, password: "Test1234!", role: "carrier" });

    const res = await app.inject({
      method: "PUT",
      url: "/api/carrier-bank",
      headers: authHeaders(token!),
      payload: {
        iban: "TR123456", // short
        account_holder: "A", // short
        bank_name: "B",
      },
    });
    
    expect(res.statusCode).toBe(400);
  });

  it("banka hesabını silebilir", async () => {
    const app = await getTestApp();
    const email = randomEmail();
    const { token } = await registerUser(app, { email, password: "Test1234!", role: "carrier" });
    
    await app.inject({
      method: "PUT",
      url: "/api/carrier-bank",
      headers: authHeaders(token!),
      payload: { iban: "TR001122334455667788992233", account_holder: "Ayşe Kaplan", bank_name: "İş Bankası" },
    });

    const res = await app.inject({
      method: "DELETE",
      url: "/api/carrier-bank",
      headers: authHeaders(token!),
    });
    
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);

    // Get should return 404 or empty
    const getRes = await app.inject({
      method: "GET",
      url: "/api/carrier-bank",
      headers: authHeaders(token!),
    });
    expect(getRes.statusCode).toBe(404);
  });
});
