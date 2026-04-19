// src/modules/exports/pdf-template.ts
// Generates A4-ready HTML for Puppeteer PDF rendering.
// Tasarim hedefi: editor canvas (CatalogPageCanvas) ile birebir gorsel hizalama.

import type { Catalog, CatalogPage, CatalogPageItem } from '@/modules/catalogs/schema';

type FullCatalog = Catalog & {
  pages: (CatalogPage & { items: CatalogPageItem[] })[];
};

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

function escape(html: string | null | undefined): string {
  if (html == null) return '';
  return String(html)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stripHtml(html: string | null | undefined): string {
  if (!html) return '';
  return String(html).replace(/<[^>]*>/g, '').trim();
}

function renderItem(
  item: CatalogPageItem,
  accentColor: string,
  showPrices: boolean,
): string {
  const title = item.override_title ?? item.snapshot_title;
  const imageUrl = item.override_image_url ?? item.snapshot_image_url;
  const price = item.override_price ?? item.snapshot_price;
  const description = stripHtml(item.override_description ?? item.snapshot_description);
  const priceNum = price != null ? Number(price) : NaN;
  const showPriceForItem = showPrices && Number.isFinite(priceNum) && priceNum > 0;

  return `
    <div class="product-slot">
      <div class="product-image-wrap">
        ${
          imageUrl
            ? `<img src="${escape(imageUrl)}" alt="${escape(title)}" class="product-image" />`
            : '<div class="product-image-placeholder"></div>'
        }
      </div>
      <div class="product-info">
        <p class="product-title">${escape(title)}</p>
        ${description ? `<p class="product-desc">${escape(description)}</p>` : ''}
        ${showPriceForItem ? `<p class="product-price" style="color: ${accentColor};">${priceNum.toFixed(2)} \u20ac</p>` : ''}
      </div>
    </div>
  `;
}

function renderCoverPage(catalog: FullCatalog): string {
  const colorTheme = catalog.color_theme || '#1a1c1a';
  const accentColor = catalog.accent_color || '#c29d5d';
  const year = new Date().getFullYear();

  return `
    <div class="page cover-page" style="background-color: ${colorTheme};">
      <div class="cover-blur" style="background-color: ${accentColor};"></div>
      <div class="cover-content">
        ${catalog.logo_url ? `<img src="${escape(catalog.logo_url)}" class="cover-logo" alt="Logo" />` : ''}
        <div class="cover-divider" style="background-color: ${accentColor};"></div>
        <h1 class="cover-title">${escape(catalog.brand_name || catalog.title || '')}</h1>
        ${catalog.title && catalog.brand_name ? `<p class="cover-subtitle">${escape(catalog.title)}</p>` : ''}
        ${catalog.season ? `<div class="cover-season" style="color: ${accentColor};">${escape(catalog.season)}</div>` : ''}
      </div>
      <div class="cover-bottom">© ${year} ${escape(catalog.brand_name || '')}</div>
    </div>
  `;
}

function renderBackCoverPage(catalog: FullCatalog): string {
  const colorTheme = catalog.color_theme || '#1a1c1a';
  const accentColor = catalog.accent_color || '#c29d5d';
  const contact = (catalog.contact_info ?? {}) as Record<string, string | undefined>;

  return `
    <div class="page cover-page" style="background-color: ${colorTheme};">
      <div class="back-content">
        ${catalog.logo_url ? `<img src="${escape(catalog.logo_url)}" class="back-logo" alt="Logo" />` : ''}
        <h2 class="back-brand">${escape(catalog.brand_name || '')}</h2>
        <div class="back-divider" style="background-color: ${accentColor};"></div>
        <div class="back-contact">
          ${contact.website ? `<p>${escape(contact.website)}</p>` : ''}
          ${contact.email ? `<p>${escape(contact.email)}</p>` : ''}
          ${contact.phone ? `<p>${escape(contact.phone)}</p>` : ''}
          ${contact.address ? `<p>${escape(contact.address)}</p>` : ''}
        </div>
        ${contact.copyright ? `<p class="back-copyright">${escape(contact.copyright)}</p>` : ''}
      </div>
    </div>
  `;
}

function renderGridPage(
  page: CatalogPage & { items: CatalogPageItem[] },
  catalog: FullCatalog,
  showPrices: boolean,
): string {
  const layoutCss = LAYOUT_GRIDS[page.layout_type ?? '2x2'] ?? LAYOUT_GRIDS['2x2'];
  const bgColor = page.background_color || '#ffffff';
  const accentColor = catalog.accent_color || '#c29d5d';

  const itemsHtml = page.items
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .map((item) => renderItem(item, accentColor, showPrices))
    .join('');

  const contact = (catalog.contact_info ?? {}) as Record<string, string | undefined>;
  const year = new Date().getFullYear();
  const copyright = contact.copyright || `© ${year} ${catalog.brand_name || ''}`;

  return `
    <div class="page grid-page" style="background-color: ${bgColor};">
      <div class="page-header">
        <div class="header-left">
          ${catalog.logo_url ? `<img src="${escape(catalog.logo_url)}" class="header-logo" alt="" />` : ''}
          <div class="header-text">
            <div class="header-brand">${escape(catalog.brand_name || '')}</div>
            ${catalog.title ? `<div class="header-subtitle">${escape(catalog.title)}</div>` : ''}
          </div>
        </div>
        <div class="header-right">
          ${catalog.season ? `<div class="header-season">${escape(catalog.season)}</div>` : ''}
          <div class="header-page">SAYFA ${page.page_number}</div>
        </div>
      </div>
      <div class="grid-container" style="${layoutCss}">
        ${itemsHtml}
      </div>
      <div class="page-footer">
        <span>${escape(contact.website || '')}</span>
        <span>${escape(copyright)}</span>
      </div>
    </div>
  `;
}

export function buildCatalogHtml(catalog: FullCatalog): string {
  const fontFamily = catalog.font_family || 'Cormorant Garamond';
  // Editor: text-[28px] font-semibold serif (font-serif var). Body sans (DM Sans).
  const bodyFont = 'DM Sans';
  const showPrices = !!catalog.show_prices;

  const pagesHtml = catalog.pages
    .sort((a, b) => a.page_number - b.page_number)
    .map((page) => {
      if (page.layout_type === 'cover') return renderCoverPage(catalog);
      if (page.layout_type === 'backcover') return renderBackCoverPage(catalog);
      return renderGridPage(page, catalog, showPrices);
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="${escape(catalog.locale || 'tr')}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escape(catalog.title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@400;500;600;700&family=${encodeURIComponent(bodyFont)}:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --serif: '${fontFamily}', 'Cormorant Garamond', Georgia, serif;
      --sans: '${bodyFont}', system-ui, -apple-system, sans-serif;
      --text: #1a1e1a;
      --muted: #555;
      --dim: #777;
      --faint: #aaa;
      --line: #e5e5e5;
      --line-strong: #1a1e1a;
    }

    body {
      font-family: var(--sans);
      color: var(--text);
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

    /* ── Cover ── */
    .cover-page {
      color: #fff;
      padding: 25mm 20mm;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      position: relative;
    }
    .cover-blur {
      position: absolute;
      top: -10%; right: -10%;
      width: 40%; height: 40%;
      border-radius: 50%;
      opacity: 0.10;
      filter: blur(100px);
    }
    .cover-content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .cover-logo {
      height: 56px;
      width: auto;
      object-fit: contain;
      margin-bottom: 24px;
    }
    .cover-divider {
      width: 64px;
      height: 2px;
      margin-bottom: 32px;
    }
    .cover-title {
      font-family: var(--serif);
      font-size: 64px;
      font-weight: 700;
      line-height: 0.85;
      letter-spacing: -0.02em;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    .cover-subtitle {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3em;
      opacity: 0.8;
      margin-bottom: 32px;
    }
    .cover-season {
      font-family: var(--serif);
      font-style: italic;
      font-size: 13px;
      padding: 6px 20px;
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 9999px;
    }
    .cover-bottom {
      position: absolute;
      bottom: 24px; left: 0; right: 0;
      text-align: center;
      font-size: 8px;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      opacity: 0.3;
    }

    /* ── Back Cover ── */
    .back-content {
      position: relative;
      z-index: 1;
      max-width: 70%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      color: #fff;
      text-align: center;
    }
    .cover-page .back-content { margin: auto; }
    .back-logo { height: 48px; width: auto; object-fit: contain; opacity: 0.8; }
    .back-brand {
      font-family: var(--serif);
      font-size: 24px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .back-divider { width: 48px; height: 2px; opacity: 0.4; }
    .back-contact { font-size: 11px; opacity: 0.6; line-height: 1.7; }
    .back-copyright { font-size: 9px; opacity: 0.3; margin-top: 16px; }

    /* ── Grid Page ── */
    .grid-page {
      padding: 30px 35px 20px;
      display: flex;
      flex-direction: column;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 12px;
      margin-bottom: 12px;
      border-bottom: 2px solid var(--line-strong);
      flex-shrink: 0;
    }
    .header-left { display: flex; align-items: center; gap: 12px; }
    .header-logo { height: 32px; width: auto; object-fit: contain; }
    .header-text { display: flex; flex-direction: column; }
    .header-brand {
      font-family: var(--serif);
      font-size: 28px;
      line-height: 0.9;
      font-weight: 600;
      letter-spacing: -0.02em;
      color: var(--text);
    }
    .header-subtitle {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: var(--muted);
      margin-top: 4px;
    }
    .header-right { text-align: right; }
    .header-season { font-size: 10px; color: var(--dim); font-weight: 500; }
    .header-page {
      font-size: 8px;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: var(--faint);
      margin-top: 2px;
    }

    .grid-container {
      flex: 1;
      display: grid;
      gap: 16px;
      min-height: 0;
    }

    /* ── Product Slot ── */
    .product-slot {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-height: 0;
    }
    .product-image-wrap {
      position: relative;
      aspect-ratio: 1 / 1;
      background: #f7f9f7;
      border: 1px solid #eee;
      overflow: hidden;
    }
    .product-image {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .product-image-placeholder {
      width: 100%; height: 100%;
      background: #f0f2f0;
    }
    .product-info { display: flex; flex-direction: column; gap: 2px; }
    .product-title {
      font-family: var(--serif);
      font-size: 16px;
      font-weight: 600;
      line-height: 1.15;
      color: var(--text);
    }
    .product-desc {
      font-size: 9px;
      line-height: 1.4;
      color: var(--muted);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .product-price {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.02em;
      margin-top: 2px;
    }

    .page-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 8px;
      margin-top: 10px;
      border-top: 1px solid var(--line);
      font-size: 7px;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      flex-shrink: 0;
    }

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
