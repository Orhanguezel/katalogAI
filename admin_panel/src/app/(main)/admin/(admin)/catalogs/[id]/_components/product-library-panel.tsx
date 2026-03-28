// =============================================================
// FILE: src/app/(main)/admin/(admin)/catalogs/[id]/_components/product-library-panel.tsx
// Left Panel — Product Library (Search, Filter, Drag)
// =============================================================

'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import {
  useListProductSourcesAdminQuery,
  useGetSourceCategoriesAdminQuery,
  useGetSourceProductsAdminQuery,
} from '@/integrations/hooks';
import type { SourceProduct } from '@/integrations/shared';
import { useCatalogBuilderStore } from '../_store/catalog-builder-store';

import AddCustomProductDialog from './add-custom-product-dialog';
import ProductCardDraggable from './product-card-draggable';

interface ProductLibraryPanelProps {
  onAddProduct?: (productData: Record<string, unknown>) => void | Promise<void>;
}

export default function ProductLibraryPanel({ onAddProduct }: ProductLibraryPanelProps) {
  const t = useAdminT('admin.catalogs');
  const { customProducts, setMeta } = useCatalogBuilderStore();
  const { data: sources } = useListProductSourcesAdminQuery();

  const [sourceId, setSourceId] = React.useState<string | null>(null);
  const [categoryId, setCategoryId] = React.useState<string>('');
  const [search, setSearch] = React.useState('');
  const [showCustomDialog, setShowCustomDialog] = React.useState(false);

  // Auto-select first source
  React.useEffect(() => {
    if (sources?.length && !sourceId) {
      setSourceId(sources[0].id);
    }
  }, [sources, sourceId]);

  // Locale'i seçili kaynağın default_locale'inden al
  const selectedSource = sources?.find((s) => s.id === sourceId);
  const sourceLocale = selectedSource?.default_locale || 'tr';

  const { data: categories } = useGetSourceCategoriesAdminQuery(
    { id: sourceId!, locale: sourceLocale },
    { skip: !sourceId },
  );

  const { data: products } = useGetSourceProductsAdminQuery(
    {
      id: sourceId!,
      locale: sourceLocale,
      category_id: categoryId || undefined,
      search: search || undefined,
      limit: 50,
    },
    { skip: !sourceId },
  );

  const filteredCustomProducts = React.useMemo<SourceProduct[]>(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return customProducts
      .filter((product) => {
        if (!normalizedSearch) return true;
        const haystack = [product.title, product.description, product.categoryName].join(' ').toLowerCase();
        return haystack.includes(normalizedSearch);
      })
      .map((product) => ({
        id: product.id,
        title: product.title,
        slug: product.id,
        description: product.description,
        image_url: product.imageUrl,
        images: product.imageUrl ? [product.imageUrl] : [],
        price: product.price,
        category_name: product.categoryName,
        category_id: 'custom',
        specs: {},
        locale: product.locale,
      }));
  }, [customProducts, search]);

  const libraryProducts = React.useMemo(
    () => [...filteredCustomProducts, ...(products?.items ?? [])],
    [filteredCustomProducts, products?.items],
  );

  return (
    <>
      <div data-panel="library" className="flex flex-col border-r border-white/6 bg-katalog-bg-panel" style={{ height: '100%' }}>
      <div className="shrink-0 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-katalog-gold/80">
            {t('panel.products') || 'KÜTÜPHANE'}
          </h2>
          <button
            className="h-[28px] px-3 bg-katalog-gold hover:bg-katalog-gold-light text-katalog-bg-deep rounded-lg text-[10px] font-bold transition-all hover:scale-105 shadow-[0_4px_12px_rgba(194,157,93,0.3)] uppercase tracking-widest"
            onClick={() => setShowCustomDialog(true)}
          >
            + {t('panel.newProduct') || 'Yeni Ürün'}
          </button>
        </div>

        {/* Source selector — her zaman goster */}
        {sources && sources.length > 0 && (
          <Select
            value={sourceId ?? ''}
            onValueChange={(v) => {
              setSourceId(v);
              setCategoryId('');
              const src = sources?.find((s) => s.id === v);
              if (src) {
                setMeta({
                  brandName: src.brand_title || src.name,
                  title: src.brand_subtitle || '',
                  logoUrl: src.brand_logo_url || '',
                });
              }
            }}
          >
            <SelectTrigger className="h-9 text-xs bg-katalog-bg-card/50 border-white/5 text-white rounded-xl">
              <SelectValue placeholder={t('panel.selectSource') || 'Kaynak seç...'} />
            </SelectTrigger>
            <SelectContent className="bg-katalog-bg-panel border-white/10 text-white">
              {sources.map((s) => (
                <SelectItem key={s.id} value={s.id} className="text-xs cursor-pointer">
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-katalog-text-dim group-focus-within:text-katalog-gold transition-colors" />
          <Input
            className="pl-10 h-9 text-[13px] bg-katalog-bg-card/50 border-white/5 focus:border-katalog-gold/50 ring-0 focus:ring-katalog-gold/10 text-white placeholder:text-katalog-text-dim/50 rounded-xl transition-all"
            placeholder={t('panel.searchProducts') || 'Ürün ara...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category tabs */}
        {categories?.items?.length ? (
          <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar scrollbar-none">
            <button
              onClick={() => setCategoryId('')}
              className={`h-6 px-3.5 rounded-full text-[10px] uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
                !categoryId 
                ? 'bg-katalog-gold text-katalog-bg-deep font-bold shadow-lg shadow-katalog-gold/20 scale-105' 
                : 'bg-white/5 text-katalog-text-dim hover:text-white hover:bg-white/10'
              }`}
            >
              {t('panel.allCategories') || 'Tümü'}
            </button>
            {categories.items.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryId(cat.id)}
                className={`h-6 px-3.5 rounded-full text-[10px] uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
                  categoryId === cat.id 
                  ? 'bg-katalog-gold text-katalog-bg-deep font-bold shadow-lg shadow-katalog-gold/20 scale-105' 
                  : 'bg-white/5 text-katalog-text-dim hover:text-white hover:bg-white/10'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {/* Product list — scrollable */}
      <div className="flex-1 overflow-auto px-4" style={{ minHeight: 0 }}>
        <div className="pb-6 space-y-2">
          {!libraryProducts.length ? (
            <div className="flex flex-col items-center justify-center py-12 text-katalog-text-dim gap-3 mt-4 bg-katalog-bg-card/30 rounded-xl border border-dashed border-white/5">
              <Search className="h-8 w-8 opacity-20" />
              <p className="text-xs font-medium">
                {t('panel.noProducts') || 'Henüz ürün bulunamadı.'}
              </p>
            </div>
          ) : (
            libraryProducts.map((product) => (
              <ProductCardDraggable
                key={product.id}
                product={product}
                sourceId={product.category_id === 'custom' ? '' : (sourceId ?? '')}
                onAddProduct={onAddProduct}
              />
            ))
          )}
        </div>
      </div>
      </div>

      <AddCustomProductDialog open={showCustomDialog} onOpenChange={setShowCustomDialog} />
    </>
  );
}
