// src/modules/dashboard/helpers/repository.ts
export function toDashboardCount(value: unknown): number {
  return Number(value ?? 0);
}

export function buildAdminDashboardSummaryItems(input: {
  userCount: unknown;
  carrierCount: unknown;
  ilanCount: unknown;
  bookingCount: unknown;
}) {
  return [
    { key: "users", label: "Kullanıcılar", count: toDashboardCount(input.userCount) },
    { key: "carriers", label: "Taşıyıcılar", count: toDashboardCount(input.carrierCount) },
    { key: "ilanlar", label: "Aktif İlanlar", count: toDashboardCount(input.ilanCount) },
    { key: "bookings", label: "Rezervasyonlar", count: toDashboardCount(input.bookingCount) },
  ];
}

export function buildDashboardWalletSnapshot(wallet?: { balance?: string | null; total_earnings?: string | null }) {
  return {
    balance: wallet?.balance ?? "0.00",
    total_earnings: wallet?.total_earnings ?? "0.00",
  };
}
