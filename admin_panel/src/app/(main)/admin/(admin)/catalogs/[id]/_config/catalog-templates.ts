// =============================================================
// FILE: src/app/(main)/admin/(admin)/catalogs/[id]/_config/catalog-templates.ts
// Catalog Template Definitions
// =============================================================

import type { LayoutType } from '@/integrations/shared';

export interface CatalogTemplate {
  id: string;
  name: string;
  description: string;
  category: 'general' | 'agriculture' | 'industrial' | 'luxury';
  defaults: {
    colorTheme: string;
    accentColor: string;
    backgroundColor: string;
    fontFamily: string;
    headingFont: string;
    fontSize: 'sm' | 'md' | 'lg';
    layoutPreset: LayoutType;
    cardStyle: 'bordered' | 'shadow' | 'flat' | 'rounded' | 'glass';
    imageAspect: '1:1' | '4:3' | '3:4' | '16:9';
    showPrice: boolean;
    showDescription: boolean;
    showSpecs: boolean;
    headerStyle: 'full' | 'minimal' | 'centered' | 'split';
    pageNumberStyle: 'bottom-center' | 'bottom-right' | 'none';
  };
}

export const CATALOG_TEMPLATES: CatalogTemplate[] = [
  {
    id: 'classic',
    name: 'Klasik',
    description: 'Geleneksel katalog, temiz çizgiler',
    category: 'general',
    defaults: {
      colorTheme: '#1a1a2e',
      accentColor: '#e94560',
      backgroundColor: '#ffffff',
      fontFamily: 'Inter',
      headingFont: 'Inter',
      fontSize: 'md',
      layoutPreset: '2x2',
      cardStyle: 'bordered',
      imageAspect: '4:3',
      showPrice: true,
      showDescription: true,
      showSpecs: false,
      headerStyle: 'full',
      pageNumberStyle: 'bottom-center',
    },
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Minimalist, geniş boşluklar',
    category: 'general',
    defaults: {
      colorTheme: '#0066ff',
      accentColor: '#00c2ff',
      backgroundColor: '#ffffff',
      fontFamily: 'Inter',
      headingFont: 'Inter',
      fontSize: 'md',
      layoutPreset: '2x2',
      cardStyle: 'shadow',
      imageAspect: '1:1',
      showPrice: true,
      showDescription: true,
      showSpecs: false,
      headerStyle: 'minimal',
      pageNumberStyle: 'bottom-right',
    },
  },
  {
    id: 'nature',
    name: 'Doğa',
    description: 'Yeşil tonlar, organik hissiyat',
    category: 'agriculture',
    defaults: {
      colorTheme: '#2d6a4f',
      accentColor: '#52b788',
      backgroundColor: '#f0f7f0',
      fontFamily: 'Lato',
      headingFont: 'Merriweather',
      fontSize: 'md',
      layoutPreset: '2x3',
      cardStyle: 'rounded',
      imageAspect: '4:3',
      showPrice: true,
      showDescription: true,
      showSpecs: true,
      headerStyle: 'centered',
      pageNumberStyle: 'bottom-center',
    },
  },
  {
    id: 'bold',
    name: 'Cesur',
    description: 'Koyu arka plan, büyük tipografi',
    category: 'general',
    defaults: {
      colorTheme: '#ff6b35',
      accentColor: '#ffc857',
      backgroundColor: '#0a0a0a',
      fontFamily: 'Roboto',
      headingFont: 'Oswald',
      fontSize: 'lg',
      layoutPreset: 'featured',
      cardStyle: 'flat',
      imageAspect: '3:4',
      showPrice: true,
      showDescription: false,
      showSpecs: false,
      headerStyle: 'full',
      pageNumberStyle: 'none',
    },
  },
  {
    id: 'elegant',
    name: 'Zarif',
    description: 'Lüks his, altın aksanlar',
    category: 'luxury',
    defaults: {
      colorTheme: '#2c2c2c',
      accentColor: '#b8860b',
      backgroundColor: '#faf8f5',
      fontFamily: 'Lora',
      headingFont: 'Playfair Display',
      fontSize: 'md',
      layoutPreset: '2x2',
      cardStyle: 'glass',
      imageAspect: '3:4',
      showPrice: true,
      showDescription: true,
      showSpecs: false,
      headerStyle: 'centered',
      pageNumberStyle: 'bottom-center',
    },
  },
  {
    id: 'industrial',
    name: 'Endüstriyel',
    description: 'Teknik, grid-ağırlıklı',
    category: 'industrial',
    defaults: {
      colorTheme: '#333333',
      accentColor: '#0088cc',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Inter',
      headingFont: 'Inter',
      fontSize: 'sm',
      layoutPreset: '3x2',
      cardStyle: 'bordered',
      imageAspect: '1:1',
      showPrice: true,
      showDescription: true,
      showSpecs: true,
      headerStyle: 'split',
      pageNumberStyle: 'bottom-right',
    },
  },
];

export function getTemplateById(id: string): CatalogTemplate | undefined {
  return CATALOG_TEMPLATES.find((t) => t.id === id);
}
