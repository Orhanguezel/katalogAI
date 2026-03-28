// =============================================================
// FILE: src/app/(main)/admin/(admin)/catalogs/[id]/_config/font-options.ts
// Google Fonts Options for Catalog Builder
// =============================================================

export interface FontOption {
  value: string;
  label: string;
  category: 'sans-serif' | 'serif' | 'display' | 'monospace';
  googleUrl: string;
}

export const FONT_OPTIONS: FontOption[] = [
  // Sans-serif
  { value: 'Inter', label: 'Inter', category: 'sans-serif', googleUrl: 'Inter:wght@400;500;600;700' },
  { value: 'Roboto', label: 'Roboto', category: 'sans-serif', googleUrl: 'Roboto:wght@400;500;700' },
  { value: 'Open Sans', label: 'Open Sans', category: 'sans-serif', googleUrl: 'Open+Sans:wght@400;600;700' },
  { value: 'Lato', label: 'Lato', category: 'sans-serif', googleUrl: 'Lato:wght@400;700;900' },
  { value: 'Montserrat', label: 'Montserrat', category: 'sans-serif', googleUrl: 'Montserrat:wght@400;500;600;700' },
  { value: 'Nunito', label: 'Nunito', category: 'sans-serif', googleUrl: 'Nunito:wght@400;600;700' },
  { value: 'Poppins', label: 'Poppins', category: 'sans-serif', googleUrl: 'Poppins:wght@400;500;600;700' },
  { value: 'Raleway', label: 'Raleway', category: 'sans-serif', googleUrl: 'Raleway:wght@400;500;600;700' },
  { value: 'Outfit', label: 'Outfit', category: 'sans-serif', googleUrl: 'Outfit:wght@300;400;500;600' },

  // Serif
  { value: 'Playfair Display', label: 'Playfair Display', category: 'serif', googleUrl: 'Playfair+Display:wght@400;500;600;700' },
  { value: 'Cormorant Garamond', label: 'Cormorant Garamond', category: 'serif', googleUrl: 'Cormorant+Garamond:wght@400;500;600;700' },
  { value: 'Merriweather', label: 'Merriweather', category: 'serif', googleUrl: 'Merriweather:wght@400;700' },
  { value: 'Lora', label: 'Lora', category: 'serif', googleUrl: 'Lora:wght@400;500;600;700' },
  { value: 'Source Serif Pro', label: 'Source Serif Pro', category: 'serif', googleUrl: 'Source+Serif+Pro:wght@400;600;700' },
  { value: 'Crimson Text', label: 'Crimson Text', category: 'serif', googleUrl: 'Crimson+Text:wght@400;600;700' },

  // Display
  { value: 'Oswald', label: 'Oswald', category: 'display', googleUrl: 'Oswald:wght@400;500;600;700' },
  { value: 'Bebas Neue', label: 'Bebas Neue', category: 'display', googleUrl: 'Bebas+Neue' },

  // Monospace
  { value: 'JetBrains Mono', label: 'JetBrains Mono', category: 'monospace', googleUrl: 'JetBrains+Mono:wght@400;500;700' },
  { value: 'Fira Code', label: 'Fira Code', category: 'monospace', googleUrl: 'Fira+Code:wght@400;500;700' },
];

export function buildGoogleFontsUrl(fonts: string[]): string {
  const unique = [...new Set(fonts)];
  const params = unique
    .map((f) => FONT_OPTIONS.find((o) => o.value === f)?.googleUrl)
    .filter(Boolean)
    .join('&family=');
  return params ? `https://fonts.googleapis.com/css2?family=${params}&display=swap` : '';
}
