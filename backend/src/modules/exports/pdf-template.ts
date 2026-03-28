// src/modules/exports/pdf-template.ts
// Generates A4-ready HTML for Puppeteer PDF rendering

import type { Catalog, CatalogPage, CatalogPageItem } from '@/modules/catalogs/schema';

type FullCatalog = Catalog & {
  pages: (CatalogPage & { items: CatalogPageItem[] })[];
};

// Layout grid CSS based on layout_type
const LAYOUT_GRIDS: Record<string, string> = {
  '2x2': 'grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr;',
  '3x2': 'grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr 1fr;',
  '2x3': 'grid-template-columns: 1fr 1fr 1fr; grid-template-rows: 1fr 1fr;',
  single: 'grid-template-columns: 1fr; grid-template-rows: 1fr;',
  featured:
    'grid-template-columns: 1fr 1fr; grid-template-rows: 2fr 1fr; grid-template-areas: "a a" "b c";',
  asymmetric:
    'grid-template-columns: 2fr 1fr; grid-template-rows: 1fr 1fr; grid-template-areas: "a b" "a c";',
  gallery: 'grid-template-columns: 1fr 1fr 1fr; grid-template-rows: 1fr 1fr 1fr;',
};

function renderItem(item: CatalogPageItem, accentColor: string, headingFont: string): string {
  const title = item.override_title ?? item.snapshot_title;
  const imageUrl = item.override_image_url ?? item.snapshot_image_url;
  const price = item.override_price ?? item.snapshot_price;

  return `
    <div class="product-slot">
      ${
        imageUrl
          ? `<img src="${imageUrl}" alt="${title}" class="product-image" />`
          : '<div class="product-image-placeholder"></div>'
      }
      <div class="product-info">
        <p class="product-title" style="font-family: ${headingFont}, serif;">${title}</p>
        ${item.snapshot_category_name ? `<p class="product-category">${item.snapshot_category_name}</p>` : ''}
        ${price != null ? `<p class="product-price" style="color: ${accentColor};">${Number(price).toFixed(2)} €</p>` : ''}
      </div>
    </div>
  `;
}

function renderCoverPage(catalog: FullCatalog, headingFont: string): string {
  const colorTheme = catalog.color_theme || '#1a1e1a';
  const accentColor = catalog.accent_color || '#c29d5d';

  return `
    <div class="page cover-page" style="background-color: ${colorTheme}; color: #fff;">
      <div class="cover-content">
        ${catalog.logo_url ? `<img src="${catalog.logo_url}" class="cover-logo" alt="Logo" />` : `<div class="cover-logo-placeholder" style="border-color: ${accentColor};"></div>`}
        <h1 class="cover-title" style="font-family: ${headingFont}, serif;">${catalog.title}</h1>
        <div class="cover-divider" style="background-color: ${accentColor};"></div>
        ${catalog.brand_name ? `<p class="cover-brand">${catalog.brand_name}</p>` : ''}
        ${catalog.season ? `<p class="cover-season">${catalog.season}</p>` : ''}
      </div>
      ${
        catalog.contact_info
          ? `<div class="cover-footer">
              ${catalog.contact_info.phone ? `<span>${catalog.contact_info.phone}</span>` : ''}
              ${catalog.contact_info.email ? `<span>${catalog.contact_info.email}</span>` : ''}
              ${catalog.contact_info.website ? `<span>${catalog.contact_info.website}</span>` : ''}
            </div>`
          : ''
      }
    </div>
  `;
}

function renderGridPage(
  page: CatalogPage & { items: CatalogPageItem[] },
  catalog: FullCatalog,
  headingFont: string,
): string {
  const layoutCss = LAYOUT_GRIDS[page.layout_type ?? '2x2'] ?? LAYOUT_GRIDS['2x2'];
  const bgColor = page.background_color || '#ffffff';
  const accentColor = catalog.accent_color || '#c29d5d';

  const itemsHtml = page.items
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .map((item) => renderItem(item, accentColor, headingFont))
    .join('');

  return `
    <div class="page grid-page" style="background-color: ${bgColor};">
      <div class="page-header">
        <span class="page-brand" style="color: ${accentColor};">${catalog.brand_name || ''}</span>
        <span class="page-number">${page.page_number}</span>
      </div>
      <div class="grid-container" style="${layoutCss}">
        ${itemsHtml}
      </div>
    </div>
  `;
}

export function buildCatalogHtml(catalog: FullCatalog): string {
  const fontFamily = catalog.font_family || 'DM Sans';
  const headingFont = fontFamily; // same for now
  const accentColor = catalog.accent_color || '#c29d5d';

  const pagesHtml = catalog.pages
    .sort((a, b) => a.page_number - b.page_number)
    .map((page) => {
      if (page.layout_type === 'cover') {
        return renderCoverPage(catalog, headingFont);
      }
      return renderGridPage(page, catalog, headingFont);
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="${catalog.locale || 'de'}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${catalog.title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: '${fontFamily}', system-ui, sans-serif;
      color: #1a1e1a;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      width: 210mm;
      height: 297mm;
      position: relative;
      overflow: hidden;
      page-break-after: always;
      break-after: page;
    }
    .page:last-child {
      page-break-after: auto;
      break-after: auto;
    }

    /* ── Cover Page ── */
    .cover-page {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 20mm;
    }
    .cover-content { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .cover-logo { width: 80px; height: 80px; object-fit: contain; margin-bottom: 24px; }
    .cover-logo-placeholder {
      width: 80px; height: 80px; border-radius: 50%; border: 3px solid;
      background: rgba(255,255,255,0.1); margin-bottom: 24px;
    }
    .cover-title { font-size: 36px; font-weight: 700; margin-bottom: 16px; letter-spacing: -0.5px; }
    .cover-divider { width: 60px; height: 3px; border-radius: 2px; margin-bottom: 16px; }
    .cover-brand { font-size: 16px; opacity: 0.9; margin-bottom: 4px; }
    .cover-season { font-size: 14px; opacity: 0.7; }
    .cover-footer {
      display: flex; gap: 16px; font-size: 10px; opacity: 0.6;
      position: absolute; bottom: 15mm; left: 0; right: 0; justify-content: center;
    }

    /* ── Grid Page ── */
    .grid-page { padding: 15mm; display: flex; flex-direction: column; }
    .page-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 12px; padding-bottom: 8px;
      border-bottom: 1px solid rgba(0,0,0,0.08);
    }
    .page-brand { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; }
    .page-number { font-size: 10px; color: #8a9a8a; }

    .grid-container {
      flex: 1;
      display: grid;
      gap: 12px;
    }

    /* ── Product Slot ── */
    .product-slot {
      display: flex;
      flex-direction: column;
      border: 1px solid rgba(0,0,0,0.06);
      border-radius: 8px;
      overflow: hidden;
      background: #fff;
    }
    .product-image {
      flex: 1;
      width: 100%;
      object-fit: cover;
      min-height: 0;
    }
    .product-image-placeholder {
      flex: 1;
      background: #f0f2f0;
      min-height: 80px;
    }
    .product-info { padding: 8px 10px; }
    .product-title { font-size: 11px; font-weight: 600; margin-bottom: 2px; }
    .product-category { font-size: 9px; color: #8a9a8a; margin-bottom: 2px; }
    .product-price { font-size: 10px; font-weight: 700; }

    @media print {
      body { margin: 0; padding: 0; }
      .page { margin: 0; box-shadow: none; }
    }
  </style>
</head>
<body>
  ${pagesHtml}
</body>
</html>`;
}
