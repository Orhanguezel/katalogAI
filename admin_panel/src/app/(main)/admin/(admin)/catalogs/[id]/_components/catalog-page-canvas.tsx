// =============================================================
// FILE: src/app/(main)/admin/(admin)/catalogs/[id]/_components/catalog-page-canvas.tsx
// Single A4 Page Render — all content must fit 595×842
// =============================================================

'use client';

import * as React from 'react';
import { useCatalogBuilderStore } from '../_store/catalog-builder-store';

/** Inline editable text on canvas — click to edit, blur to save */
function InlineEdit({
  value, onSave, className, style, placeholder,
}: {
  value: string; onSave: (v: string) => void; className?: string; style?: React.CSSProperties; placeholder?: string;
}) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value);
  const ref = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => { setDraft(value); }, [value]);
  React.useEffect(() => { if (editing) ref.current?.focus(); }, [editing]);
  const save = () => { setEditing(false); if (draft !== value) onSave(draft); };

  if (editing) {
    return (
      <input
        ref={ref}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') save(); }}
        className={`${className || ''} bg-transparent outline-none border-b border-dashed border-blue-400/50 w-full`}
        style={style}
      />
    );
  }
  return (
    <span
      className={`${className || ''} cursor-text hover:bg-blue-50 rounded-sm transition-colors`}
      style={style}
      onClick={() => setEditing(true)}
      title="Düzenlemek için tıkla"
    >
      {value || <span className="opacity-30 italic text-[10px]">{placeholder || 'Tıkla...'}</span>}
    </span>
  );
}
import type { BuilderPage } from '../_store/catalog-builder-store';
import PageGridRenderer from './page-grid-renderer';

interface Props {
  page: BuilderPage;
  pageIndex: number;
  onRemoveProduct?: (pageIndex: number, slotIndex: number) => void | Promise<void>;
  colorTheme: string;
  accentColor: string;
  backgroundColor: string;
  fontFamily: string;
  headingFont: string;
  preview?: boolean;
}

const A4_WIDTH = 595;
const A4_HEIGHT = 842;

export default function CatalogPageCanvas({
  page,
  pageIndex,
  onRemoveProduct,
  colorTheme,
  accentColor,
  backgroundColor,
  fontFamily,
  headingFont,
  preview = false,
}: Props) {
  const { brandName, title, season, logoUrl, contactInfo, cardStyle, imageAspect, setMeta } = useCatalogBuilderStore();

  if (page.layoutType === 'cover') {
    return (
      <div data-print-page data-cover style={{ width: A4_WIDTH, height: A4_HEIGHT, overflow: 'hidden' }}>
        <CoverPage brandName={brandName} title={title} season={season} logoUrl={logoUrl} colorTheme={colorTheme} accentColor={accentColor} />
      </div>
    );
  }

  if (page.layoutType === ('backcover' as string)) {
    return (
      <div data-print-page data-cover style={{ width: A4_WIDTH, height: A4_HEIGHT, overflow: 'hidden' }}>
        <BackCoverPage brandName={brandName} logoUrl={logoUrl} contactInfo={contactInfo} colorTheme={colorTheme} accentColor={accentColor} />
      </div>
    );
  }

  return (
    <div
      data-print-page
      className="relative border flex flex-col"
      style={{
        width: A4_WIDTH,
        height: A4_HEIGHT,
        backgroundColor: page.backgroundColor || backgroundColor || '#ffffff',
        overflow: 'hidden',
        padding: '30px 35px 20px',
      }}
    >
      {/* Header — inline editable */}
      <div className="flex justify-between items-center shrink-0 pb-3 mb-3 border-b-2 border-[#1a1e1a]">
        <div className="flex items-center gap-3">
          {logoUrl && (
            <img src={logoUrl} alt="" className="h-8 w-auto object-contain" />
          )}
          <div>
            <InlineEdit
              value={brandName || ''}
              onSave={(v) => setMeta({ brandName: v })}
              className="text-[28px] leading-[0.9] font-semibold tracking-tight block text-[#1a1e1a]"
              style={{ fontFamily: 'var(--font-serif)', color: '#1a1e1a' }}
              placeholder="Marka Adı"
            />
            <InlineEdit
              value={title || ''}
              onSave={(v) => setMeta({ title: v })}
              className="text-[9px] uppercase tracking-[0.12em] mt-1 text-[#555] block"
              placeholder="Alt Başlık"
            />
          </div>
        </div>
        <div className="text-right">
          <InlineEdit
            value={season || ''}
            onSave={(v) => setMeta({ season: v })}
            className="text-[10px] text-[#777] font-medium block"
            placeholder="Sezon"
          />
          <div className="text-[8px] uppercase tracking-widest text-[#aaa] mt-0.5">
            Sayfa {pageIndex + 1}
          </div>
        </div>
      </div>

      {/* Grid — flex-1 ile kalan alanı doldur */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <PageGridRenderer
          page={page}
          pageIndex={pageIndex}
          onRemoveProduct={onRemoveProduct}
          colorTheme={colorTheme}
          accentColor={accentColor}
          fontFamily={fontFamily}
          headingFont={headingFont}
          cardStyle={cardStyle}
          imageAspect={imageAspect}
          preview={preview}
        />
      </div>

      {/* Footer — inline editable */}
      <div className="shrink-0 pt-2 mt-2 border-t border-[#eee] flex justify-between" style={{ color: '#999' }}>
        <InlineEdit
          value={contactInfo?.website || ''}
          onSave={(v) => setMeta({ contactInfo: { ...contactInfo, website: v } })}
          className="text-[7px] uppercase tracking-wider"
          style={{ color: '#999' }}
          placeholder="website"
        />
        <InlineEdit
          value={contactInfo?.copyright || `© ${new Date().getFullYear()} ${brandName}`}
          onSave={(v) => setMeta({ contactInfo: { ...contactInfo, copyright: v } })}
          className="text-[7px] uppercase tracking-wider"
          style={{ color: '#999' }}
          placeholder="© Copyright"
        />
      </div>
    </div>
  );
}

function CoverPage({
  brandName,
  title,
  season,
  logoUrl,
  colorTheme,
  accentColor,
}: {
  brandName: string;
  title: string;
  season: string;
  logoUrl: string;
  colorTheme: string;
  accentColor: string;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center relative overflow-hidden"
      style={{
        width: A4_WIDTH,
        height: A4_HEIGHT,
        backgroundColor: colorTheme || '#1a1c1a',
        color: '#ffffff',
      }}
    >
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full opacity-10 blur-[100px]" style={{ backgroundColor: accentColor }} />

      <div className="z-10 flex flex-col items-center">
        {logoUrl && (
          <img src={logoUrl} alt="" className="h-14 w-auto object-contain mb-6" />
        )}
        <div className="w-16 h-0.5 mb-8" style={{ backgroundColor: accentColor }} />
        <h1
          className="text-[64px] leading-[0.85] font-bold mb-4 tracking-tight uppercase"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {brandName || ''}
        </h1>
        {title && (
          <p className="text-[12px] uppercase tracking-[0.3em] font-bold opacity-80 mb-8">
            {title}
          </p>
        )}
        {season && (
          <div
            className="px-5 py-1.5 rounded-full border border-white/20 text-[13px] font-serif italic"
            style={{ color: accentColor }}
          >
            {season}
          </div>
        )}
      </div>

      <div className="absolute bottom-8 text-[8px] tracking-[0.2em] font-bold opacity-30 uppercase">
        © {new Date().getFullYear()} {brandName || ''}
      </div>
    </div>
  );
}

function BackCoverPage({
  brandName, logoUrl, contactInfo, colorTheme, accentColor,
}: {
  brandName: string; logoUrl: string; contactInfo: Record<string, string>; colorTheme: string; accentColor: string;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center relative overflow-hidden"
      style={{ width: A4_WIDTH, height: A4_HEIGHT, backgroundColor: colorTheme || '#1a1c1a', color: '#ffffff' }}
    >
      <div className="z-10 flex flex-col items-center gap-6 max-w-[70%]">
        {logoUrl && <img src={logoUrl} alt="" className="h-12 w-auto object-contain opacity-80" />}

        <h2 className="text-[24px] font-bold uppercase tracking-wider" style={{ fontFamily: 'var(--font-serif)' }}>
          {brandName || ''}
        </h2>

        <div className="w-12 h-0.5 opacity-40" style={{ backgroundColor: accentColor }} />

        <div className="space-y-2 text-[11px] opacity-60">
          {contactInfo?.website && <p>{contactInfo.website}</p>}
          {contactInfo?.email && <p>{contactInfo.email}</p>}
          {contactInfo?.phone && <p>{contactInfo.phone}</p>}
          {contactInfo?.address && <p>{contactInfo.address}</p>}
        </div>

        {contactInfo?.copyright && (
          <p className="text-[9px] opacity-30 mt-4">{contactInfo.copyright}</p>
        )}
      </div>
    </div>
  );
}
