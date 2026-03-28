// src/modules/exports/pdf-renderer.ts
// Puppeteer-based HTML → PDF renderer

import puppeteer from 'puppeteer';

interface RenderPdfOptions {
  html: string;
  landscape?: boolean;
}

export async function renderPdf({ html, landscape = false }: RenderPdfOptions): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  try {
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30_000 });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape,
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
      preferCSSPageSize: true,
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}
