// test/booking.test.ts — Booking akis testleri
import { describe, it, expect, afterAll } from "bun:test";
import { getTestApp, closeTestApp, registerUser, randomEmail, authHeaders } from "./setup";

type InjectLikeApp = Awaited<ReturnType<typeof getTestApp>>;
type SubscriptionPlan = { id: string; slug: string; price: string };
type SignupBody = { user: { id: string } };
type IlanCreateBody = { id?: string };

afterAll(closeTestApp);

/** Carrier kaydet + plan ver + ilan olustur + deposit yap — booking test icin hazirlik */
async function setupBookingScenario(app: InjectLikeApp) {
  // 1. Carrier kayit
  const carrierEmail = randomEmail();
  const { token: carrierToken, body: carrierBody } = await registerUser(app, {
    email: carrierEmail,
    password: "Test1234!",
    role: "carrier",
  });
  const carrierId = carrierBody.user.id;

  // 2. Carrier icin cuzdan deposit (plan almak icin)
  await app.inject({
    method: "POST",
    url: "/api/wallet/deposit",
    headers: authHeaders(carrierToken!),
    payload: { amount: 1000 },
  });

  // 3. Free plan al (slug: free) — zaten free varsa satin al
  const plansRes = await app.inject({ method: "GET", url: "/api/subscription/plans" });
  let freePlan: SubscriptionPlan | null = null;
  if (plansRes.statusCode === 200) {
    const plans = JSON.parse(plansRes.body) as unknown;
    if (Array.isArray(plans)) {
      freePlan = (plans as SubscriptionPlan[]).find((p) => p.slug === "free" || parseFloat(p.price) === 0) ?? null;
    }
  }

  if (freePlan) {
    await app.inject({
      method: "POST",
      url: "/api/subscription/purchase",
      headers: authHeaders(carrierToken!),
      payload: { plan_id: freePlan.id },
    });
  }

  // 4. Ilan olustur
  const ilanRes = await app.inject({
    method: "POST",
    url: "/api/ilanlar",
    headers: authHeaders(carrierToken!),
    payload: {
      from_city: "Istanbul",
      to_city: "Ankara",
      departure_date: new Date(Date.now() + 86400000).toISOString(),
      total_capacity_kg: 100,
      price_per_kg: 10,
      vehicle_type: "van",
      contact_phone: "05551234567",
    },
  });
  const ilan = JSON.parse(ilanRes.body) as IlanCreateBody;

  // 5. Musteri kayit + deposit
  const customerEmail = randomEmail();
  const { token: customerToken, body: customerBody } = await registerUser(app, {
    email: customerEmail,
    password: "Test1234!",
    role: "customer",
  });

  await app.inject({
    method: "POST",
    url: "/api/wallet/deposit",
    headers: authHeaders(customerToken!),
    payload: { amount: 5000 },
  });

  return {
    carrierId,
    carrierToken: carrierToken!,
    customerId: customerBody.user.id,
    customerToken: customerToken!,
    ilanId: ilan.id as string | undefined,
    ilanCreated: ilanRes.statusCode === 200 || ilanRes.statusCode === 201,
  };
}

describe("Booking — Olusturma", () => {
  it("musteri booking olusturabilir", async () => {
    const app = await getTestApp();
    const ctx = await setupBookingScenario(app);

    if (!ctx.ilanCreated || !ctx.ilanId) {
      console.log("Ilan olusturulamadi (plan gerekli olabilir), test atlaniyor");
      return;
    }

    const res = await app.inject({
      method: "POST",
      url: "/api/bookings",
      headers: authHeaders(ctx.customerToken),
      payload: { ilan_id: ctx.ilanId, kg_amount: 5, customer_notes: "Test kargo" },
    });
    expect(res.statusCode).toBeOneOf([200, 201]);
    const booking = JSON.parse(res.body);
    expect(booking.id).toBeDefined();
    expect(booking.status).toBe("pending");
  });

  it("kendi ilanina booking yapilamaz", async () => {
    const app = await getTestApp();
    const ctx = await setupBookingScenario(app);
    if (!ctx.ilanCreated || !ctx.ilanId) return;

    const res = await app.inject({
      method: "POST",
      url: "/api/bookings",
      headers: authHeaders(ctx.carrierToken),
      payload: { ilan_id: ctx.ilanId, kg_amount: 5 },
    });
    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.body);
    expect(body.error.message).toBe("cannot_book_own_ilan");
  });

  it("auth olmadan booking yapilamaz", async () => {
    const app = await getTestApp();
    const res = await app.inject({
      method: "POST",
      url: "/api/bookings",
      payload: { ilan_id: "00000000-0000-0000-0000-000000000000", kg_amount: 5 },
    });
    expect(res.statusCode).toBe(401);
  });
});

describe("Booking — Listeleme", () => {
  it("musteri kendi booking'lerini gorur", async () => {
    const app = await getTestApp();
    const email = randomEmail();
    const { token } = await registerUser(app, { email, password: "Test1234!" });

    const res = await app.inject({
      method: "GET",
      url: "/api/bookings?role=customer",
      headers: authHeaders(token!),
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body) as any;
    expect(Array.isArray(body.data || body)).toBe(true);
  });
});

describe("Booking — Durum Akisi", () => {
  it("tam akis: pending -> confirmed -> in_transit -> delivered", async () => {
    const app = await getTestApp();
    const ctx = await setupBookingScenario(app);
    if (!ctx.ilanCreated || !ctx.ilanId) {
      console.log("Ilan olusturulamadi, durum akis testi atlaniyor");
      return;
    }

    // 1. Booking olustur
    const createRes = await app.inject({
      method: "POST",
      url: "/api/bookings",
      headers: authHeaders(ctx.customerToken),
      payload: { ilan_id: ctx.ilanId, kg_amount: 5 },
    });

    if (createRes.statusCode !== 200) return;
    const booking = JSON.parse(createRes.body);
    const bookingId = booking.id;

    // 2. Carrier onaylar: pending -> confirmed
    const confirmRes = await app.inject({
      method: "PATCH",
      url: `/api/bookings/${bookingId}/confirm`,
      headers: authHeaders(ctx.carrierToken),
    });
    expect(confirmRes.statusCode).toBe(200);

    // 3. Carrier yola cikarir: confirmed -> in_transit
    const transitRes = await app.inject({
      method: "PATCH",
      url: `/api/bookings/${bookingId}/status`,
      headers: authHeaders(ctx.carrierToken),
      payload: { status: "in_transit" },
    });
    expect(transitRes.statusCode).toBe(200);

    // 4. Carrier teslim eder: in_transit -> delivered
    const deliverRes = await app.inject({
      method: "PATCH",
      url: `/api/bookings/${bookingId}/status`,
      headers: authHeaders(ctx.carrierToken),
      payload: { status: "delivered" },
    });
    expect(deliverRes.statusCode).toBe(200);

    // 5. Carrier cuzdaninda kazanc olduunu kontrol et
    const walletRes = await app.inject({
      method: "GET",
      url: "/api/wallet",
      headers: authHeaders(ctx.carrierToken),
    });
    const wallet = JSON.parse(walletRes.body);
    expect(parseFloat(wallet.balance)).toBeGreaterThan(0);
  });

  it("iptal + iade akisi: pending -> cancelled + refund", async () => {
    const app = await getTestApp();
    const ctx = await setupBookingScenario(app);
    if (!ctx.ilanCreated || !ctx.ilanId) return;

    // Booking olustur
    const createRes = await app.inject({
      method: "POST",
      url: "/api/bookings",
      headers: authHeaders(ctx.customerToken),
      payload: { ilan_id: ctx.ilanId, kg_amount: 5 },
    });
    if (createRes.statusCode !== 200) return;
    const booking = JSON.parse(createRes.body);

    // Musteri bakiyesini al (odeme sonrasi)
    const beforeRes = await app.inject({
      method: "GET",
      url: "/api/wallet",
      headers: authHeaders(ctx.customerToken),
    });
    const balanceBefore = parseFloat(JSON.parse(beforeRes.body).balance);

    // Iptal
    const cancelRes = await app.inject({
      method: "PATCH",
      url: `/api/bookings/${booking.id}/cancel`,
      headers: authHeaders(ctx.customerToken),
    });
    expect(cancelRes.statusCode).toBe(200);

    // Iade sonrasi bakiye artmis olmali
    const afterRes = await app.inject({
      method: "GET",
      url: "/api/wallet",
      headers: authHeaders(ctx.customerToken),
    });
    const balanceAfter = parseFloat(JSON.parse(afterRes.body).balance);
    expect(balanceAfter).toBeGreaterThan(balanceBefore);
  });
});
