// =============================================================
// FILE: src/app/(main)/admin/(admin)/catalogs/[id]/_components/product-slot.tsx
// Droppable + Inline Editable Product Slot
// =============================================================

'use client';

import * as React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { ImagePlus, X } from 'lucide-react';
import type { BuilderSlot } from '../_store/catalog-builder-store';
import { useCatalogBuilderStore } from '../_store/catalog-builder-store';

interface Props {
  slot: BuilderSlot;
  pageIndex: number;
  slotIndex: number;
  onRemove?: (pageIndex: number, slotIndex: number) => void | Promise<void>;
  colorTheme: string;
  accentColor: string;
  fontFamily: string;
  headingFont: string;
  cardStyle: string;
  imageAspect: string;
  preview?: boolean;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

function EditableText({
  value, onSave, className, style, placeholder, multiline,
}: {
  value: string; onSave: (v: string) => void; className?: string; style?: React.CSSProperties; placeholder?: string; multiline?: boolean;
}) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value);
  const ref = React.useRef<HTMLElement>(null);
  React.useEffect(() => { setDraft(value); }, [value]);
  React.useEffect(() => { if (editing) ref.current?.focus(); }, [editing]);
  const save = () => { setEditing(false); if (draft !== value) onSave(draft); };

  if (editing) {
    const cls = `${className || ''} bg-transparent outline-none border-b border-dashed border-katalog-gold/50 w-full`;
    return multiline ? (
      <textarea ref={ref as React.RefObject<HTMLTextAreaElement>} value={draft} onChange={(e) => setDraft(e.target.value)} onBlur={save} onKeyDown={(e) => { if (e.key === 'Escape') save(); }} className={cls} style={{ ...style, resize: 'none' }} rows={2} />
    ) : (
      <input ref={ref as React.RefObject<HTMLInputElement>} value={draft} onChange={(e) => setDraft(e.target.value)} onBlur={save} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') save(); }} className={cls} style={style} />
    );
  }
  return (
    <span className={`${className || ''} cursor-text hover:bg-katalog-gold/5 rounded-sm transition-colors`} style={style} onClick={() => setEditing(true)} title="Düzenlemek için tıkla">
      {value || <span className="opacity-30 italic">{placeholder || 'Tıkla...'}</span>}
    </span>
  );
}

export default function ProductSlot({ slot, pageIndex, slotIndex, onRemove, preview = false }: Props) {
  const { updateOverride, showPrices } = useCatalogBuilderStore();
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${pageIndex}-${slotIndex}`,
    data: { type: 'slot', pageIndex, slotIndex },
    disabled: preview,
  });

  const hasProduct = !!slot.sourceProductId;
  const displayTitle = slot.overrideTitle || slot.title;
  const displayImage = slot.overrideImageUrl || slot.imageUrl || null;
  const displayPrice = slot.overridePrice ?? slot.price;
  const displayDesc = stripHtml(slot.overrideDescription || slot.description || '');

  if (!hasProduct) {
    return (
      <div
        ref={setNodeRef}
        className={`flex flex-col items-center justify-center border-2 border-dashed transition-all cursor-pointer ${
          isOver ? 'border-katalog-gold bg-katalog-gold/5 scale-[1.02]' : 'border-[#ddd] hover:border-[#ccc] hover:bg-[#fcfcfc]'
        }`}
        style={{ aspectRatio: '1 / 1' }}
      >
        <ImagePlus className="h-5 w-5 text-[#aaa] mb-1.5" />
        <p className="text-[8px] uppercase tracking-wider font-medium text-[#aaa]">+ Ürün Ekleyin</p>
      </div>
    );
  }

  const priceStr = displayPrice != null
    ? (typeof displayPrice === 'number' ? (displayPrice > 0 ? `₺${displayPrice.toLocaleString()}` : '') : (displayPrice !== '0.00' ? displayPrice : ''))
    : '';

  return (
    <div
      ref={setNodeRef}
      className={`group relative flex flex-col gap-2 transition-all duration-200 ${isOver ? 'ring-2 ring-katalog-gold' : ''}`}
    >
      {/* Image — aspect 1:1 tam genişlik */}
      <div className="relative bg-[#f7f9f7] border border-[#eee] overflow-hidden" style={{ aspectRatio: '1 / 1' }}>
        {displayImage ? (
          <img src={displayImage} alt={displayTitle || ''} className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImagePlus className="h-8 w-8 text-[#ddd]" />
          </div>
        )}
        {!preview && (
          <button
            className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-500/80 hover:bg-red-600 text-white flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onRemove?.(pageIndex, slotIndex)}
          >
            <X className="h-2.5 w-2.5" />
          </button>
        )}
      </div>

      {/* Editable text */}
      <div className="flex flex-col gap-0.5">
        <EditableText
          value={displayTitle}
          onSave={(v) => updateOverride(pageIndex, slotIndex, { overrideTitle: v })}
          className="text-[16px] leading-tight text-[#1a1e1a] block"
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}
          placeholder="Ürün adı"
        />
        {displayDesc && (
          <EditableText
            value={displayDesc}
            onSave={(v) => updateOverride(pageIndex, slotIndex, { overrideDescription: v })}
            className="text-[9px] text-[#555] leading-snug block line-clamp-2"
            placeholder="Açıklama"
            multiline
          />
        )}
        {showPrices && priceStr && (
          <EditableText
            value={priceStr}
            onSave={(v) => updateOverride(pageIndex, slotIndex, { overridePrice: v as unknown as number })}
            className="text-[11px] font-semibold text-black block"
            style={{ fontFamily: 'var(--font-mono)' }}
            placeholder="Fiyat"
          />
        )}
      </div>
    </div>
  );
}
