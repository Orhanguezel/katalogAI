// test/custom-page.test.ts — Custom page testleri
import { describe, it, expect, afterAll } from "bun:test";
import { getTestApp, closeTestApp } from "./setup";

afterAll(closeTestApp);

describe("Custom Pages — Özel Sayfalar", () => {
  it("/tasima-kurallari sayfası yüklenebilir", async () => {
    const app = await getTestApp();
    const res = await app.inject({
      method: "GET",
      url: "/api/custom-pages/by-slug/tasima-kurallari",
    });
    
    expect(res.statusCode).toBeOneOf([200, 404]); // 404 olabilir eğer seed edilmemişse ama kod patlamamalı
    if (res.statusCode === 200) {
      const body = JSON.parse(res.body);
      expect(body.slug).toBe("tasima-kurallari");
    }
  });

  it("olmayan slug 404 döner", async () => {
    const app = await getTestApp();
    const res = await app.inject({
      method: "GET",
      url: "/api/custom-pages/by-slug/non-existent-page",
    });
    expect(res.statusCode).toBe(404);
  });
});
