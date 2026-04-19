'use client';

import * as React from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { toast } from 'sonner';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import {
  useCreateCatalogPageAdminMutation,
  useCreateCatalogPageItemAdminMutation,
  useDeleteCatalogPageAdminMutation,
  useDeleteCatalogPageItemAdminMutation,
  useGetCatalogAdminQuery,
  useUpdateCatalogAdminMutation,
  useUpdateCatalogPageAdminMutation,
} from '@/integrations/hooks';
import { buildGoogleFontsUrl } from './_config/font-options';
import { getSlotCount } from './_config/layout-presets';
import { useCatalogBuilderStore } from './_store/catalog-builder-store';
import CanvasPanel from './_components/canvas-panel';
import CatalogBuilderTopbar from './_components/catalog-builder-topbar';
import ProductLibraryPanel from './_components/product-library-panel';
import SettingsPanel from './_components/settings-panel';

interface Props {
  catalogId: string;
}

export default function CatalogBuilder({ catalogId }: Props) {
  const { data, isLoading, refetch } = useGetCatalogAdminQuery(catalogId);
  const [updateCatalog] = useUpdateCatalogAdminMutation();
  const [createCatalogPage] = useCreateCatalogPageAdminMutation();
  const [updateCatalogPage] = useUpdateCatalogPageAdminMutation();
  const [deleteCatalogPage] = useDeleteCatalogPageAdminMutation();
  const [createCatalogPageItem] = useCreateCatalogPageItemAdminMutation();
  const [deleteCatalogPageItem] = useDeleteCatalogPageItemAdminMutation();
  const store = useCatalogBuilderStore();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const [draggedProduct, setDraggedProduct] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (data) {
      useCatalogBuilderStore.getState().initFromServer(data);
    }
  }, [data]);

  const saveCatalog = React.useCallback(async () => {
    const s = useCatalogBuilderStore.getState();
    if (s.isSaving) return;
    s.markSaving(true);
    try {
      const cleanContact = s.contactInfo
        ? Object.fromEntries(Object.entries(s.contactInfo).filter(([, v]) => v && v.trim()))
        : undefined;
      await updateCatalog({
        id: s.catalogId,
        patch: {
          title: s.title || undefined,
          brand_name: s.brandName || undefined,
          season: s.season || undefined,
          contact_info: Object.keys(cleanContact || {}).length ? cleanContact : undefined,
          locale: s.locale || undefined,
          logo_url: s.logoUrl || undefined,
          cover_image_url: s.coverImageUrl || undefined,
          color_theme: s.colorTheme || undefined,
          accent_color: s.accentColor || undefined,
          font_family: s.fontFamily || undefined,
          show_prices: s.showPrices,
          show_cover: s.showCover,
          show_back_cover: s.showBackCover,
        },
      }).unwrap();
      s.markClean();
    } finally {
      useCatalogBuilderStore.getState().markSaving(false);
    }
  }, [updateCatalog]);

  // Autosave: 5s debounce sonrasi calisir
  React.useEffect(() => {
    if (!store.isDirty || store.isSaving) return;
    const timer = setTimeout(() => { void saveCatalog(); }, 5000);
    return () => clearTimeout(timer);
  }, [store.isDirty, store.isSaving, saveCatalog]);

  const fontsUrl = buildGoogleFontsUrl([store.fontFamily, store.headingFont]);

  const syncCatalog = React.useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleDragStart = React.useCallback((event: DragStartEvent) => {
    setDraggedProduct(String(event.active.id));
  }, []);

  const handleRemoveProduct = React.useCallback(async (pageIndex: number, slotIndex: number) => {
    const page = store.pages[pageIndex];
    const slot = page?.slots[slotIndex];
    if (!page || !slot?.sourceProductId) return;

    store.removeProductFromSlot(pageIndex, slotIndex);

    if (!page.id || !slot.itemId) return;

    try {
      await deleteCatalogPageItem({
        catalogId,
        pageId: page.id,
        itemId: slot.itemId,
      }).unwrap();
      await syncCatalog();
    } catch {
      toast.error('Ürün katalogdan kaldırılırken hata oluştu.');
      await syncCatalog();
    }
  }, [catalogId, deleteCatalogPageItem, store, syncCatalog]);

  const handleClearPage = React.useCallback(async (pageIndex: number) => {
    const page = store.pages[pageIndex];
    if (!page) return;

    store.clearPageSlots(pageIndex);

    if (!page.id) return;

    try {
      await Promise.all(
        page.slots
          .filter((slot) => slot.itemId)
          .map((slot) =>
            deleteCatalogPageItem({
              catalogId,
              pageId: page.id!,
              itemId: slot.itemId!,
            }).unwrap(),
          ),
      );
      await syncCatalog();
    } catch {
      toast.error('Sayfa temizlenirken hata oluştu.');
      await syncCatalog();
    }
  }, [catalogId, deleteCatalogPageItem, store, syncCatalog]);

  const handleAddPage = React.useCallback(async () => {
    try {
      await createCatalogPage({
        catalogId,
        payload: { layout_type: '2x2' },
      }).unwrap();
      await syncCatalog();
    } catch {
      toast.error('Yeni sayfa eklenemedi.');
    }
  }, [catalogId, createCatalogPage, syncCatalog]);

  const handleDeletePage = React.useCallback(async (index: number) => {
    const page = useCatalogBuilderStore.getState().pages[index];
    if (!page) return;
    if (useCatalogBuilderStore.getState().pages.length <= 1) {
      toast.error('Son sayfayi silemezsin.');
      return;
    }
    useCatalogBuilderStore.getState().removePage(index);
    if (page.id) {
      try {
        await deleteCatalogPage({ catalogId, pageId: page.id }).unwrap();
        await syncCatalog();
      } catch {
        toast.error('Sayfa silinirken hata olustu.');
        await syncCatalog();
      }
    }
  }, [catalogId, deleteCatalogPage, syncCatalog]);

  const handleLayoutChange = React.useCallback(async (layout: 'single' | '2x2' | '2x3' | 'free') => {
    const page = store.pages[store.activePage];
    if (!page) return;

    const removedSlots = page.slots.filter(
      (slot) => slot.itemId && slot.slotIndex >= getSlotCount(layout),
    );

    store.setPageLayout(store.activePage, layout);

    if (!page.id) return;

    try {
      await updateCatalogPage({
        catalogId,
        pageId: page.id,
        payload: { layout_type: layout },
      }).unwrap();

      if (removedSlots.length) {
        await Promise.all(
          removedSlots.map((slot) =>
            deleteCatalogPageItem({
              catalogId,
              pageId: page.id!,
              itemId: slot.itemId!,
            }).unwrap(),
          ),
        );
      }

      await syncCatalog();
    } catch {
      toast.error('Sayfa yerleşimi kaydedilemedi.');
      await syncCatalog();
    }
  }, [catalogId, deleteCatalogPageItem, store, syncCatalog, updateCatalogPage]);

  /** Ürünü bir sonraki boş slot'a ekle, sayfa yoksa backend'de oluştur */
  const addProductWithAutoPage = React.useCallback(async (productData: Record<string, unknown>) => {
    // Boş slot bul
    const pages = store.pages;
    for (let pi = 0; pi < pages.length; pi++) {
      const page = pages[pi];
      if (page.layoutType === 'cover') continue;
      for (let si = 0; si < page.slots.length; si++) {
        if (!page.slots[si].sourceProductId) {
          // Boş slot bulundu — direkt ekle
          store.addProductToSlot(pi, si, {
            sourceId: productData.sourceId as string,
            sourceProductId: productData.sourceProductId as string,
            title: productData.title as string,
            description: (productData.description as string) || '',
            imageUrl: (productData.imageUrl as string) || '',
            images: (productData.images as string[]) || [],
            price: productData.price as number | null,
            categoryName: (productData.categoryName as string) || '',
            specs: (productData.specs as Record<string, string>) || {},
            locale: (productData.locale as string) || 'tr',
          });

          if (page.id) {
            try {
              await createCatalogPageItem({
                catalogId,
                pageId: page.id,
                payload: {
                  slot_index: si,
                  source_id: (productData.sourceId as string) || null,
                  source_product_id: (productData.sourceProductId as string) ?? null,
                  snapshot_title: productData.title as string,
                  snapshot_description: (productData.description as string) || undefined,
                  snapshot_image_url: (productData.imageUrl as string) || undefined,
                  snapshot_images: (productData.images as string[]) || [],
                  snapshot_price: (productData.price as number) ?? undefined,
                  snapshot_category_name: (productData.categoryName as string) || undefined,
                  snapshot_specs: (productData.specs as Record<string, string>) || {},
                  snapshot_locale: (productData.locale as string) || 'tr',
                },
              }).unwrap();
              await syncCatalog();
            } catch {
              toast.error('Ürün kaydedilirken hata oluştu.');
            }
          }
          return;
        }
      }
    }

    // Boş slot yok — yeni sayfa oluştur
    try {
      await createCatalogPage({
        catalogId,
        payload: { layout_type: '2x2' },
      }).unwrap();
      await syncCatalog();

      // Sync sonrası store güncellenmiş olacak, yeni sayfanın ilk slot'una ekle
      const updatedPages = useCatalogBuilderStore.getState().pages;
      const newPage = updatedPages[updatedPages.length - 1];
      if (newPage) {
        useCatalogBuilderStore.getState().addProductToSlot(updatedPages.length - 1, 0, {
          sourceId: productData.sourceId as string,
          sourceProductId: productData.sourceProductId as string,
          title: productData.title as string,
          description: (productData.description as string) || '',
          imageUrl: (productData.imageUrl as string) || '',
          images: (productData.images as string[]) || [],
          price: productData.price as number | null,
          categoryName: (productData.categoryName as string) || '',
          specs: (productData.specs as Record<string, string>) || {},
          locale: (productData.locale as string) || 'tr',
        });
        useCatalogBuilderStore.getState().setActivePage(updatedPages.length - 1);

        if (newPage.id) {
          await createCatalogPageItem({
            catalogId,
            pageId: newPage.id,
            payload: {
              slot_index: 0,
              source_id: (productData.sourceId as string) || null,
              source_product_id: (productData.sourceProductId as string) ?? null,
              snapshot_title: productData.title as string,
              snapshot_description: (productData.description as string) || undefined,
              snapshot_image_url: (productData.imageUrl as string) || undefined,
              snapshot_images: (productData.images as string[]) || [],
              snapshot_price: (productData.price as number) ?? undefined,
              snapshot_category_name: (productData.categoryName as string) || undefined,
              snapshot_specs: (productData.specs as Record<string, string>) || {},
              snapshot_locale: (productData.locale as string) || 'tr',
            },
          }).unwrap();
          await syncCatalog();
        }
      }
      toast.success('Yeni sayfa oluşturuldu.');
    } catch {
      toast.error('Sayfa oluşturulamadı.');
    }
  }, [catalogId, createCatalogPage, createCatalogPageItem, store, syncCatalog]);

  const handleDragEnd = React.useCallback(async (event: DragEndEvent) => {
    setDraggedProduct(null);
    const { active, over } = event;
    if (!over) return;

    const productData = active.data.current;
    const slotData = over.data.current;
    if (productData?.type !== 'product' || slotData?.type !== 'slot') return;

    const page = store.pages[slotData.pageIndex];
    const slot = page?.slots[slotData.slotIndex];
    if (!page) return;

    store.addProductToSlot(slotData.pageIndex, slotData.slotIndex, {
      sourceId: productData.sourceId,
      sourceProductId: productData.sourceProductId,
      title: productData.title,
      description: productData.description,
      imageUrl: productData.imageUrl,
      images: productData.images ?? [],
      price: productData.price,
      categoryName: productData.categoryName,
      specs: productData.specs ?? {},
      locale: productData.locale,
    });

    if (!page.id) {
      return;
    }

    try {
      if (slot?.itemId) {
        await deleteCatalogPageItem({
          catalogId,
          pageId: page.id,
          itemId: slot.itemId,
        }).unwrap();
      }

        await createCatalogPageItem({
          catalogId,
          pageId: page.id,
          payload: {
            slot_index: slotData.slotIndex,
            source_id: productData.sourceId || null,
            source_product_id: productData.sourceProductId ?? null,
            snapshot_title: productData.title,
            snapshot_description: productData.description,
          snapshot_image_url: productData.imageUrl,
          snapshot_images: productData.images ?? [],
          snapshot_price: productData.price ?? undefined,
          snapshot_category_name: productData.categoryName,
          snapshot_specs: productData.specs ?? {},
          snapshot_locale: productData.locale,
        },
      }).unwrap();

      await syncCatalog();
    } catch {
      toast.error('Ürün sayfaya eklenirken hata oluştu.');
      await syncCatalog();
    }
  }, [catalogId, createCatalogPageItem, deleteCatalogPageItem, store, syncCatalog]);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <p className="text-muted-foreground">Katalog yükleniyor...</p>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      {fontsUrl && <link rel="stylesheet" href={fontsUrl} />}

      <div className="flex h-[calc(100vh-64px)] flex-col">
        <CatalogBuilderTopbar onSave={saveCatalog} />

        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={25} minSize={15} maxSize={40}>
            <ProductLibraryPanel onAddProduct={addProductWithAutoPage} />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={50} minSize={30}>
            <CanvasPanel
              onClearPage={handleClearPage}
              onRemoveProduct={handleRemoveProduct}
              onAddPage={handleAddPage}
              onDeletePage={handleDeletePage}
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={25} minSize={15} maxSize={40}>
            <SettingsPanel onLayoutChange={handleLayoutChange} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <DragOverlay>
        {draggedProduct && (
          <div className="w-48 rounded-lg border border-katalog-gold/30 bg-card p-2 shadow-xl ring-2 ring-katalog-gold/20">
            <p className="truncate text-xs font-medium">{draggedProduct}</p>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
