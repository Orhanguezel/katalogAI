import { afterAll, describe, expect, it } from "bun:test";
import { closeTestApp, getTestApp, authHeaders, randomEmail, registerAdminUser, registerUser } from "./setup";

afterAll(closeTestApp);

type CarrierListResponse = {
  data: Array<{ id: string; email: string; ilan_count: number }>;
  total: number;
};

type CarrierDetailResponse = {
  id: string;
  email: string;
  stats: {
    ilan_count: number;
    booking_count: number;
    rating_count: number;
  };
  recent_ilanlar: Array<{ id: string }>;
  recent_bookings: Array<{ id: string }>;
  recent_ratings: Array<{ id: string }>;
};

async function createCarrier(app: Awaited<ReturnType<typeof getTestApp>>) {
  const carrierEmail = randomEmail();
  const carrier = await registerUser(app, {
    email: carrierEmail,
    password: "Test1234!",
    full_name: "Carrier Test",
    role: "carrier",
  });

  const carrierId = carrier.body.user.id as string;
  const carrierToken = carrier.token as string;

  await app.inject({
    method: "POST",
    url: "/api/wallet/deposit",
    headers: authHeaders(carrierToken),
    payload: { amount: 2500 },
  });

  const ilanRes = await app.inject({
    method: "POST",
    url: "/api/ilanlar",
    headers: authHeaders(carrierToken),
    payload: {
      from_city: "Istanbul",
      to_city: "Izmir",
      departure_date: new Date(Date.now() + 86400000).toISOString(),
      total_capacity_kg: 100,
      price_per_kg: 12,
      vehicle_type: "van",
      contact_phone: "05551234567",
    },
  });

  const ilanBody = JSON.parse(ilanRes.body) as { id?: string };
  const ilanId = ilanBody.id;

  const customer = await registerUser(app, {
    email: randomEmail(),
    password: "Test1234!",
    full_name: "Customer Test",
  });

  const customerToken = customer.token as string;

  await app.inject({
    method: "POST",
    url: "/api/wallet/deposit",
    headers: authHeaders(customerToken),
    payload: { amount: 5000 },
  });

  if (ilanId) {
    const bookingRes = await app.inject({
      method: "POST",
      url: "/api/bookings",
      headers: authHeaders(customerToken),
      payload: { ilan_id: ilanId, kg_amount: 10, customer_notes: "Admin carrier test" },
    });

    if (bookingRes.statusCode === 200) {
      const bookingBody = JSON.parse(bookingRes.body) as { id: string };

      await app.inject({
        method: "PATCH",
        url: `/api/bookings/${bookingBody.id}/confirm`,
        headers: authHeaders(carrierToken),
      });

      await app.inject({
        method: "PATCH",
        url: `/api/bookings/${bookingBody.id}/status`,
        headers: authHeaders(carrierToken),
        payload: { status: "delivered" },
      });
      await app.inject({
        method: "POST",
        url: "/api/ratings",
        headers: authHeaders(customerToken),
        payload: { booking_id: bookingBody.id, score: 5, comment: "Hizli teslimat" },
      });
    }
  }

  return { carrierId, carrierEmail };
}

describe("Admin Carriers", () => {
  it("admin carrier listesini gorebilir", async () => {
    const app = await getTestApp();
    const admin = await registerAdminUser(app);
    const carrier = await createCarrier(app);

    const res = await app.inject({
      method: "GET",
      url: `/api/admin/carriers?search=${encodeURIComponent(carrier.carrierEmail)}`,
      headers: authHeaders(admin.token as string),
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body) as CarrierListResponse;
    expect(body.total).toBeGreaterThan(0);
    expect(body.data.some((item) => item.id === carrier.carrierId)).toBe(true);
  });

  it("admin carrier detayini gorebilir", async () => {
    const app = await getTestApp();
    const admin = await registerAdminUser(app);
    const carrier = await createCarrier(app);

    const res = await app.inject({
      method: "GET",
      url: `/api/admin/carriers/${carrier.carrierId}`,
      headers: authHeaders(admin.token as string),
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body) as CarrierDetailResponse;
    expect(body.id).toBe(carrier.carrierId);
    expect(body.email).toBe(carrier.carrierEmail);
    expect(body.stats.ilan_count).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(body.recent_ilanlar)).toBe(true);
    expect(Array.isArray(body.recent_bookings)).toBe(true);
    expect(Array.isArray(body.recent_ratings)).toBe(true);
  });
});
