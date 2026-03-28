// =============================================================
// FILE: src/app/(main)/admin/(admin)/catalogs/[id]/_config/layout-presets.ts
// Layout Preset Definitions for Catalog Pages
// =============================================================

import type { LayoutType } from '@/integrations/shared';

export interface LayoutPreset {
  id: LayoutType;
  name: string;
  slots: number;
  gridTemplate: string;
  gridTemplateAreas?: string;
}

export const LAYOUT_PRESETS: LayoutPreset[] = [
  {
    id: 'cover',
    name: 'Kapak',
    slots: 0,
    gridTemplate: '1fr',
  },
  {
    id: '2x2',
    name: '2×2 Grid',
    slots: 4,
    gridTemplate: 'repeat(2, 1fr) / repeat(2, 1fr)',
  },
  {
    id: '3x2',
    name: '3×2 Grid',
    slots: 6,
    gridTemplate: 'repeat(2, 1fr) / repeat(3, 1fr)',
  },
  {
    id: '2x3',
    name: '2×3 Grid',
    slots: 6,
    gridTemplate: 'repeat(3, 1fr) / repeat(2, 1fr)',
  },
  {
    id: 'featured',
    name: 'Öne Çıkan',
    slots: 3,
    gridTemplate: '2fr 1fr / 1fr 1fr',
    gridTemplateAreas: '"main main" "side1 side2"',
  },
  {
    id: 'asymmetric',
    name: 'Asimetrik',
    slots: 4,
    gridTemplate: 'repeat(3, 1fr) / 2fr 1fr',
    gridTemplateAreas: '"main side1" "main side2" "main side3"',
  },
  {
    id: 'single',
    name: 'Tek Ürün',
    slots: 1,
    gridTemplate: '1fr',
  },
  {
    id: 'gallery',
    name: 'Galeri',
    slots: 8,
    gridTemplate: 'repeat(2, 1fr) / repeat(4, 1fr)',
  },
  {
    id: 'free' as LayoutType,
    name: 'Serbest',
    slots: 6,
    gridTemplate: '1fr',
  },
  {
    id: 'backcover' as LayoutType,
    name: 'Arka Kapak',
    slots: 0,
    gridTemplate: '1fr',
  },
];

export function getLayoutPreset(id: LayoutType): LayoutPreset | undefined {
  return LAYOUT_PRESETS.find((l) => l.id === id);
}

export function getSlotCount(layoutType: LayoutType): number {
  return getLayoutPreset(layoutType)?.slots ?? 4;
}
