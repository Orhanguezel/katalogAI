// src/modules/dashboard/helpers/repository.ts
export function toDashboardCount(value: unknown): number {
  return Number(value ?? 0);
}

export function buildAdminDashboardSummaryItems(input: {
  userCount: unknown;
  catalogCount: unknown;
  productSourceCount: unknown;
}) {
  return [
    { key: "users", label: "Kullanıcılar", count: toDashboardCount(input.userCount) },
    { key: "catalogs", label: "Kataloglar", count: toDashboardCount(input.catalogCount) },
    { key: "product_sources", label: "Veri Kaynakları", count: toDashboardCount(input.productSourceCount) },
  ];
}
