// src/modules/aiTasks/prompts.ts
// Prompt templates for AI content enhancement

export const ENHANCE_DESCRIPTION_SYSTEM = `Sen profesyonel bir ürün kataloğu editörüsün. Görevin, verilen ürün bilgilerini kullanarak kısa, profesyonel ve satış odaklı bir ürün açıklaması yazmaktır.

Kurallar:
- Açıklama 2-4 cümle olmalı
- Teknik özellikleri doğal bir şekilde dahil et
- Müşteriye hitap eden, ikna edici bir ton kullan
- Gereksiz dolgu kelimelerden kaçın
- Sadece açıklama metnini döndür, başka hiçbir şey ekleme`;

export const TRANSLATE_SYSTEM = `Sen profesyonel bir çevirmensin. Görevin, verilen metni hedef dile çevirmektir.

Kurallar:
- Anlamı bozmadan doğal çeviri yap
- Teknik terimler varsa hedef dilde yaygın karşılığını kullan
- Ürün bağlamını koru
- Sadece çeviri metnini döndür, başka hiçbir şey ekleme`;

export const SEO_SUGGEST_SYSTEM = `Sen bir SEO ve e-ticaret uzmanısın. Görevin, verilen ürün/katalog bilgileri için kısa SEO önerileri sunmaktır.

Kurallar:
- JSON formatında döndür: { "title": "...", "description": "...", "keywords": ["..."] }
- title: Max 60 karakter, anahtar kelime içermeli
- description: Max 160 karakter, çekici ve bilgilendirici
- keywords: 5-8 anahtar kelime
- Sadece JSON döndür, başka hiçbir şey ekleme`;

export function buildEnhancePrompt(product: {
  title: string;
  description?: string;
  category?: string;
  specs?: Record<string, string>;
  locale?: string;
}): string {
  const parts = [`Ürün: ${product.title}`];
  if (product.category) parts.push(`Kategori: ${product.category}`);
  if (product.description) parts.push(`Mevcut açıklama: ${product.description}`);
  if (product.specs && Object.keys(product.specs).length) {
    const specStr = Object.entries(product.specs)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');
    parts.push(`Özellikler: ${specStr}`);
  }
  if (product.locale) parts.push(`Dil: ${product.locale}`);
  return parts.join('\n');
}

export function buildTranslatePrompt(text: string, targetLocale: string): string {
  const langMap: Record<string, string> = {
    tr: 'Türkçe',
    de: 'Almanca',
    en: 'İngilizce',
    fr: 'Fransızca',
    ar: 'Arapça',
    ru: 'Rusça',
  };
  const targetLang = langMap[targetLocale] ?? targetLocale;
  return `Aşağıdaki metni ${targetLang} diline çevir:\n\n${text}`;
}

export function buildSeoPrompt(catalog: {
  title: string;
  brand_name?: string;
  season?: string;
  locale?: string;
  product_count?: number;
}): string {
  const parts = [`Katalog: ${catalog.title}`];
  if (catalog.brand_name) parts.push(`Marka: ${catalog.brand_name}`);
  if (catalog.season) parts.push(`Sezon: ${catalog.season}`);
  if (catalog.locale) parts.push(`Dil: ${catalog.locale}`);
  if (catalog.product_count) parts.push(`Ürün sayısı: ${catalog.product_count}`);
  return parts.join('\n');
}
