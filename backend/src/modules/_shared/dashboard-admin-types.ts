// src/modules/_shared/dashboard-admin-types.ts
// KatalogAI dashboard analytics DTO types.

export type DashboardSummaryItem = {
  key: string;
  label: string;
  count: number;
};

export type DashboardSummaryDto = DashboardSummaryItem[];
