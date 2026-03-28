// =============================================================
// FILE: src/app/(main)/admin/(admin)/catalogs/[id]/_components/page-grid-renderer.tsx
// Renders Product Slots — grid layout (standart) veya flex-wrap (serbest)
// =============================================================

'use client';

import type { BuilderPage } from '../_store/catalog-builder-store';
import { getLayoutPreset } from '../_config/layout-presets';
import ProductSlot from './product-slot';

interface Props {
  page: BuilderPage;
  pageIndex: number;
  onRemoveProduct?: (pageIndex: number, slotIndex: number) => void | Promise<void>;
  colorTheme: string;
  accentColor: string;
  fontFamily: string;
  headingFont: string;
  cardStyle: string;
  imageAspect: string;
  preview?: boolean;
}

export default function PageGridRenderer({
  page,
  pageIndex,
  onRemoveProduct,
  colorTheme,
  accentColor,
  fontFamily,
  headingFont,
  cardStyle,
  imageAspect,
  preview = false,
}: Props) {
  const layout = getLayoutPreset(page.layoutType);

  // Serbest yerlesim
  if (page.layoutType === 'free' || !layout) {
    return (
      <div className="flex flex-wrap content-start gap-3 h-full items-start">
        {page.slots.map((slot, i) => (
          <ProductSlot
            key={i}
            slot={slot}
            pageIndex={pageIndex}
            slotIndex={i}
            onRemove={onRemoveProduct}
            colorTheme={colorTheme}
            accentColor={accentColor}
            fontFamily={fontFamily}
            headingFont={headingFont}
            cardStyle={cardStyle}
            imageAspect={imageAspect}
            preview={preview}
          />
        ))}
      </div>
    );
  }

  // Standart grid yerlesim
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gap: '16px',
    height: '100%',
  };

  if (layout.gridTemplateAreas) {
    gridStyle.gridTemplateAreas = layout.gridTemplateAreas;
    const parts = layout.gridTemplate.split('/').map((s) => s.trim());
    if (parts.length === 2) {
      gridStyle.gridTemplateRows = parts[0];
      gridStyle.gridTemplateColumns = parts[1];
    }
  } else if (layout.gridTemplate.includes('/')) {
    const parts = layout.gridTemplate.split('/').map((s) => s.trim());
    gridStyle.gridTemplateRows = parts[0];
    gridStyle.gridTemplateColumns = parts[1];
  } else {
    gridStyle.gridTemplateColumns = layout.gridTemplate;
  }

  return (
    <div style={gridStyle}>
      {page.slots.map((slot, i) => (
        <ProductSlot
          key={i}
          slot={slot}
          pageIndex={pageIndex}
          slotIndex={i}
          onRemove={onRemoveProduct}
          colorTheme={colorTheme}
          accentColor={accentColor}
          fontFamily={fontFamily}
          headingFont={headingFont}
          cardStyle={cardStyle}
          imageAspect={imageAspect}
          preview={preview}
        />
      ))}
    </div>
  );
}
