// test/profile.test.ts — Profil testleri
import { describe, it, expect, afterAll } from "bun:test";
import { getTestApp, closeTestApp, registerUser, randomEmail, authHeaders } from "./setup";

afterAll(closeTestApp);

describe("Profile — Kullanıcı Profili", () => {
  it("kendi profilini alabilir", async () => {
    const app = await getTestApp();
    const email = randomEmail();
    const { token } = await registerUser(app, { email, password: "Test1234!", full_name: "John Doe" });

    const res = await app.inject({
      method: "GET",
      url: "/api/profiles/me",
      headers: authHeaders(token!),
    });
    
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.full_name).toBe("John Doe");
  });

  it("profilini güncelleyebilir", async () => {
    const app = await getTestApp();
    const email = randomEmail();
    const { token } = await registerUser(app, { email, password: "Test1234!" });

    const res = await app.inject({
      method: "PUT",
      url: "/api/profiles/me",
      headers: authHeaders(token!),
      payload: {
        profile: {
          full_name: "Jane Smith",
          phone: "05001112233",
        }
      },
    });
    
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.full_name).toBe("Jane Smith");
    expect(body.phone).toBe("05001112233");
  });
});
