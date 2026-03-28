// =============================================================
// FILE: src/app/(main)/admin/(admin)/catalogs/[id]/_config/color-palettes.ts
// Preset Color Palettes for Catalog Builder
// =============================================================

export interface ColorPalette {
  id: string;
  name: string;
  primary: string;
  accent: string;
  background: string;
}

export const COLOR_PALETTES: ColorPalette[] = [
  { id: 'ocean', name: 'Okyanus', primary: '#0077b6', accent: '#00b4d8', background: '#ffffff' },
  { id: 'sunset', name: 'Gün Batımı', primary: '#e63946', accent: '#f4a261', background: '#f1faee' },
  { id: 'forest', name: 'Orman', primary: '#2d6a4f', accent: '#52b788', background: '#f0f7f0' },
  { id: 'lavender', name: 'Lavanta', primary: '#7b2cbf', accent: '#c77dff', background: '#faf5ff' },
  { id: 'coral', name: 'Mercan', primary: '#ff6b6b', accent: '#ffa07a', background: '#fff5f5' },
  { id: 'charcoal', name: 'Kömür', primary: '#2b2d42', accent: '#8d99ae', background: '#edf2f4' },
  { id: 'sky', name: 'Gökyüzü', primary: '#4361ee', accent: '#4cc9f0', background: '#f8f9ff' },
  { id: 'earth', name: 'Toprak', primary: '#6b4226', accent: '#d4a574', background: '#faf5f0' },
  { id: 'mint', name: 'Nane', primary: '#087f5b', accent: '#38d9a9', background: '#f0faf5' },
  { id: 'rose', name: 'Gül', primary: '#be185d', accent: '#fb7185', background: '#fff1f2' },
  { id: 'midnight', name: 'Gece', primary: '#1e293b', accent: '#3b82f6', background: '#f8fafc' },
  { id: 'gold', name: 'Altın', primary: '#92400e', accent: '#d4a017', background: '#fffbeb' },
  { id: 'emerald', name: 'Zümrüt', primary: '#065f46', accent: '#10b981', background: '#ecfdf5' },
  { id: 'indigo', name: 'İndigo', primary: '#3730a3', accent: '#818cf8', background: '#eef2ff' },
];
