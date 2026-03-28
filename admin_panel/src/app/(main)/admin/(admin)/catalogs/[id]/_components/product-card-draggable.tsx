// =============================================================
// FILE: src/app/(main)/admin/(admin)/catalogs/[id]/_components/product-card-draggable.tsx
// Draggable + Clickable Product Card (Left Panel)
// =============================================================

'use client';

import { useDraggable } from '@dnd-kit/core';
import { GripVertical, Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { SourceProduct } from '@/integrations/shared';

interface Props {
  product: SourceProduct;
  sourceId: string | number;
  onAddProduct?: (productData: Record<string, unknown>) => void | Promise<void>;
}

export default function ProductCardDraggable({ product, sourceId, onAddProduct }: Props) {

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `product-${sourceId}-${product.id}`,
    data: {
      type: 'product',
      sourceId,
      sourceProductId: product.id,
      title: product.title,
      description: product.description,
      imageUrl: product.image_url,
      images: product.images,
      price: product.price,
      categoryName: product.category_name,
      specs: product.specs,
      locale: product.locale,
    },
  });

  const handleClick = () => {
    const data = {
      sourceId,
      sourceProductId: product.id,
      title: product.title,
      description: product.description || '',
      imageUrl: product.image_url || '',
      images: product.images || [],
      price: product.price,
      categoryName: product.category_name || '',
      specs: product.specs || {},
      locale: product.locale || 'tr',
    };
    if (onAddProduct) {
      onAddProduct(data);
    }
    toast.success(`${product.title} eklendi.`);
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`group flex cursor-grab items-center gap-3 rounded-xl border border-white/5 p-3 active:cursor-grabbing transition-all bg-white/2 ${
        isDragging ? 'scale-95 opacity-50 ring-2 ring-katalog-gold' : 'hover:scale-[1.02] hover:border-white/10 hover:bg-white/5 hover:shadow-2xl hover:shadow-black/40'
      }`}
    >
      <div className="relative shrink-0">
        <div className="h-14 w-14 overflow-hidden rounded-lg border border-white/5 bg-white/2">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <GripVertical className="h-4 w-4 text-white/10" />
            </div>
          )}
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="truncate text-[13px] font-bold text-white tracking-tight mb-1">
          {product.title}
        </h4>
        <div className="flex items-center gap-2">
          {product.category_name && (
            <span className="shrink-0 rounded-full border border-katalog-gold/20 bg-katalog-gold/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-katalog-gold">
              {product.category_name}
            </span>
          )}
        </div>
      </div>

      {/* Click to add */}
      <button
        type="button"
        className="shrink-0 h-7 w-7 rounded-lg bg-katalog-gold/10 text-katalog-gold opacity-0 group-hover:opacity-100 transition-all hover:bg-katalog-gold hover:text-katalog-bg-deep flex items-center justify-center"
        onClick={(e) => { e.stopPropagation(); handleClick(); }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
