// test/contact.test.ts — İletişim formu testleri
import { describe, it, expect, afterAll } from "bun:test";
import { getTestApp, closeTestApp } from "./setup";

afterAll(closeTestApp);

describe("Contact — İletişim Formu", () => {
  it("herkese açık iletişim formu gönderilebilir", async () => {
    const app = await getTestApp();
    const res = await app.inject({
      method: "POST",
      url: "/api/contacts",
      payload: {
        name: "Test User",
        email: "test@example.com",
        subject: "Test Konu",
        message: "Bu bir test mesajıdır.",
      },
    });
    
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);
  });

  it("geçersiz email ile hata döner", async () => {
    const app = await getTestApp();
    const res = await app.inject({
      method: "POST",
      url: "/api/contacts",
      payload: {
        name: "Test",
        email: "invalid-email",
        message: "Mesaj",
      },
    });
    
    expect(res.statusCode).toBe(400);
  });
});
