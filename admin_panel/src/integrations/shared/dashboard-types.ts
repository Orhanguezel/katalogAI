// =============================================================
// FILE: src/integrations/shared/dashboard-types.ts
// Dashboard Types — KatalogAI
// =============================================================

export interface DashboardCountItemDto {
  key: string;
  label: string;
  count: number;
}

export type DashboardSummaryItem = DashboardCountItemDto;

export type DashboardSummary = {
  items: DashboardCountItemDto[];
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function toCountItem(raw: unknown): DashboardCountItemDto {
  const source = isRecord(raw) ? raw : {};
  const key = String(source.key ?? "").trim();
  const label = String(source.label ?? "").trim();
  const countNum = Number(source.count ?? 0);
  return {
    key,
    label: label || key,
    count: Number.isFinite(countNum) ? countNum : 0,
  };
}

export function normalizeDashboardSummary(res: unknown): DashboardSummary {
  const itemsRaw = Array.isArray(res) ? res : [];
  const items = itemsRaw.map(toCountItem).filter((x) => x.key.length > 0);
  return { items };
}
