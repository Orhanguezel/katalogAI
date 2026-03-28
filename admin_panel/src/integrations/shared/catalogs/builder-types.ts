// src/integrations/shared/catalogs/builder-types.ts

import type { LayoutType } from './types';

export interface BuilderSlot {
  slotIndex: number;
  itemId: string | null;
  sourceId: string | null;
  sourceProductId: string | null;
  snapshotTitle: string;
  snapshotDescription: string;
  snapshotImageUrl: string;
  snapshotImages: string[];
  snapshotPrice: number | null;
  snapshotCategoryName: string;
  snapshotSpecs: Record<string, string>;
  snapshotLocale: string;
  overrideTitle: string | null;
  overrideDescription: string | null;
  overrideImageUrl: string | null;
  overridePrice: number | null;
}

export interface BuilderPage {
  id: string | null;
  pageNumber: number;
  layoutType: LayoutType;
  backgroundColor: string;
  slots: BuilderSlot[];
}

export interface SnapshotProduct {
  sourceId: string;
  sourceProductId: string;
  title: string;
  description: string;
  imageUrl: string;
  images: string[];
  price: number | null;
  categoryName: string;
  specs: Record<string, string>;
  locale: string;
}

export interface BuilderOverride {
  title?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  price?: number | null;
}
