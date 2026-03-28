// =============================================================
// FILE: src/app/(main)/admin/(admin)/catalogs/[id]/_store/catalog-builder-store.ts
// Catalog Builder — Zustand Store
// =============================================================

import { create } from 'zustand';
import type { LayoutType, CatalogFullDto, CatalogPageDto, CatalogPageItemDto } from '@/integrations/shared';
import { getTemplateById } from '../_config/catalog-templates';
import { getSlotCount } from '../_config/layout-presets';

// ── Types ──────────────────────────────────────────────────────

export interface BuilderSlot {
  slotIndex: number;
  itemId: string | null;
  sourceId: string | null;
  sourceProductId: string | null;
  title: string;
  description: string;
  imageUrl: string;
  images: string[];
  price: number | null;
  categoryName: string;
  specs: Record<string, string>;
  locale: string;
  overrideTitle: string | null;
  overrideDescription: string | null;
  overrideImageUrl: string | null;
  overridePrice: number | null;
}

export interface BuilderPage {
  id: string | null;
  pageNumber: number;
  layoutType: LayoutType;
  backgroundColor: string;
  slots: BuilderSlot[];
}

export interface BuilderCustomProduct {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number | null;
  categoryName: string;
  locale: string;
}

export interface CatalogBuilderState {
  // Meta
  catalogId: string;
  title: string;
  brandName: string;
  season: string;
  contactInfo: Record<string, string>;
  locale: string;
  logoUrl: string;
  coverImageUrl: string;

  // Style
  templateId: string;
  colorTheme: string;
  accentColor: string;
  backgroundColor: string;
  fontFamily: string;
  headingFont: string;
  fontSize: 'sm' | 'md' | 'lg';
  cardStyle: string;
  imageAspect: string;
  headerStyle: string;
  pageNumberStyle: string;

  // Pages
  pages: BuilderPage[];
  activePage: number;
  customProducts: BuilderCustomProduct[];

  // UI
  zoom: number;
  isDirty: boolean;
  isSaving: boolean;
  settingsTab: 'template' | 'style' | 'page' | 'info';

  // Actions
  initFromServer: (data: CatalogFullDto) => void;
  setMeta: (partial: Partial<Pick<CatalogBuilderState, 'title' | 'brandName' | 'season' | 'contactInfo' | 'locale' | 'logoUrl' | 'coverImageUrl'>>) => void;
  setStyle: (partial: Partial<Pick<CatalogBuilderState, 'colorTheme' | 'accentColor' | 'backgroundColor' | 'fontFamily' | 'headingFont' | 'fontSize' | 'cardStyle' | 'imageAspect' | 'headerStyle' | 'pageNumberStyle'>>) => void;
  applyTemplate: (templateId: string) => void;
  setActivePage: (index: number) => void;
  setZoom: (zoom: number) => void;
  setSettingsTab: (tab: CatalogBuilderState['settingsTab']) => void;
  addPage: (layout?: LayoutType) => void;
  removePage: (index: number) => void;
  duplicatePage: (index: number) => void;
  reorderPages: (from: number, to: number) => void;
  setPageLayout: (pageIndex: number, layout: LayoutType) => void;
  setPageBackground: (pageIndex: number, color: string) => void;
  clearPageSlots: (pageIndex: number) => void;
  addCustomProduct: (product: Omit<BuilderCustomProduct, 'id'>) => void;
  addProductToSlot: (pageIndex: number, slotIndex: number, product: Omit<BuilderSlot, 'slotIndex' | 'itemId' | 'overrideTitle' | 'overrideDescription' | 'overrideImageUrl' | 'overridePrice'>) => void;
  /** Ilk bos slot'a ekler, yoksa yeni sayfa olusturur */
  addProductToNextSlot: (product: Omit<BuilderSlot, 'slotIndex' | 'itemId' | 'overrideTitle' | 'overrideDescription' | 'overrideImageUrl' | 'overridePrice'>) => { pageIndex: number; slotIndex: number } | null;
  removeProductFromSlot: (pageIndex: number, slotIndex: number) => void;
  updateOverride: (pageIndex: number, slotIndex: number, override: Partial<Pick<BuilderSlot, 'overrideTitle' | 'overrideDescription' | 'overrideImageUrl' | 'overridePrice'>>) => void;
  markSaving: (saving: boolean) => void;
  markClean: () => void;
}

// ── Helpers ────────────────────────────────────────────────────

function createEmptySlots(layoutType: LayoutType): BuilderSlot[] {
  const count = getSlotCount(layoutType);
  return Array.from({ length: count }, (_, i) => ({
    slotIndex: i,
    itemId: null,
    sourceId: null,
    sourceProductId: null,
    title: '',
    description: '',
    imageUrl: '',
    images: [],
    price: null,
    categoryName: '',
    specs: {},
    locale: '',
    overrideTitle: null,
    overrideDescription: null,
    overrideImageUrl: null,
    overridePrice: null,
  }));
}

function mapServerPage(page: CatalogPageDto): BuilderPage {
  const slots = createEmptySlots(page.layout_type);
  for (const item of page.items) {
    if (item.slot_index < slots.length) {
      slots[item.slot_index] = {
        slotIndex: item.slot_index,
        itemId: item.id,
        sourceId: item.source_id,
        sourceProductId: item.source_product_id,
        title: item.snapshot_title,
        description: item.snapshot_description,
        imageUrl: item.snapshot_image_url,
        images: item.snapshot_images ?? [],
        price: item.snapshot_price,
        categoryName: item.snapshot_category_name,
        specs: item.snapshot_specs ?? {},
        locale: item.snapshot_locale,
        overrideTitle: item.override_title,
        overrideDescription: item.override_description,
        overrideImageUrl: item.override_image_url,
        overridePrice: item.override_price,
      };
    }
  }
  return {
    id: page.id,
    pageNumber: page.page_number,
    layoutType: page.layout_type,
    backgroundColor: page.background_color || '',
    slots,
  };
}

// ── Store ──────────────────────────────────────────────────────

export const useCatalogBuilderStore = create<CatalogBuilderState>((set, get) => ({
  // Defaults
  catalogId: '',
  title: '',
  brandName: '',
  season: '',
  contactInfo: {},
  locale: 'tr',
  logoUrl: '',
  coverImageUrl: '',

  templateId: 'classic',
  colorTheme: '#0a0c0a',
  accentColor: '#c29d5d',
  backgroundColor: '#ffffff',
  fontFamily: 'Outfit',
  headingFont: 'Cormorant Garamond',
  fontSize: 'md',
  cardStyle: 'bordered',
  imageAspect: '1:1',
  headerStyle: 'full',
  pageNumberStyle: 'bottom-center',

  pages: [],
  activePage: 0,
  customProducts: [],

  zoom: 100,
  isDirty: false,
  isSaving: false,
  settingsTab: 'template',

  initFromServer: (data) => {
    const pages = [...data.pages]
      .sort((a, b) => a.page_number - b.page_number)
      .map(mapServerPage);

    set({
      catalogId: data.id,
      title: data.title,
      brandName: data.brand_name,
      season: data.season,
      contactInfo: data.contact_info ?? {},
      locale: data.locale || 'tr',
      logoUrl: data.logo_url || '',
      coverImageUrl: data.cover_image_url || '',
      colorTheme: data.color_theme || '#0a0c0a',
      accentColor: data.accent_color || '#c29d5d',
      fontFamily: data.font_family || 'Outfit',
      headingFont: 'Cormorant Garamond',
      pages: pages.length ? pages : [{ id: null, pageNumber: 1, layoutType: '2x2', backgroundColor: '', slots: createEmptySlots('2x2') }],
      activePage: Math.min(get().activePage, Math.max(0, pages.length - 1)),
      isDirty: false,
    });
  },

  setMeta: (partial) => set({ ...partial, isDirty: true }),
  setStyle: (partial) => set({ ...partial, isDirty: true }),

  applyTemplate: (templateId) => {
    const tmpl = getTemplateById(templateId);
    if (!tmpl) return;
    set({
      templateId,
      colorTheme: tmpl.defaults.colorTheme,
      accentColor: tmpl.defaults.accentColor,
      backgroundColor: tmpl.defaults.backgroundColor,
      fontFamily: tmpl.defaults.fontFamily,
      headingFont: tmpl.defaults.headingFont,
      fontSize: tmpl.defaults.fontSize,
      cardStyle: tmpl.defaults.cardStyle,
      imageAspect: tmpl.defaults.imageAspect,
      headerStyle: tmpl.defaults.headerStyle,
      pageNumberStyle: tmpl.defaults.pageNumberStyle,
      isDirty: true,
    });
  },

  setActivePage: (index) => set({ activePage: index }),
  setZoom: (zoom) => set({ zoom }),
  setSettingsTab: (tab) => set({ settingsTab: tab }),

  addPage: (layout = '2x2') => {
    const { pages } = get();
    const newPage: BuilderPage = {
      id: null,
      pageNumber: pages.length + 1,
      layoutType: layout,
      backgroundColor: '',
      slots: createEmptySlots(layout),
    };
    set({ pages: [...pages, newPage], activePage: pages.length, isDirty: true });
  },

  removePage: (index) => {
    const { pages, activePage } = get();
    if (pages.length <= 1) return;
    const next = pages.filter((_, i) => i !== index).map((p, i) => ({ ...p, pageNumber: i + 1 }));
    set({
      pages: next,
      activePage: Math.min(activePage, next.length - 1),
      isDirty: true,
    });
  },

  duplicatePage: (index) => {
    const { pages } = get();
    const source = pages[index];
    if (!source) return;
    const copy: BuilderPage = {
      ...structuredClone(source),
      id: null,
      pageNumber: pages.length + 1,
    };
    set({ pages: [...pages, copy], activePage: pages.length, isDirty: true });
  },

  reorderPages: (from, to) => {
    const { pages } = get();
    const next = [...pages];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    set({
      pages: next.map((p, i) => ({ ...p, pageNumber: i + 1 })),
      isDirty: true,
    });
  },

  setPageLayout: (pageIndex, layout) => {
    const { pages } = get();
    const page = pages[pageIndex];
    if (!page) return;
    const newSlots = createEmptySlots(layout);
    // preserve existing products in matching slots
    for (const existing of page.slots) {
      if (existing.sourceProductId && existing.slotIndex < newSlots.length) {
        newSlots[existing.slotIndex] = { ...existing };
      }
    }
    const next = [...pages];
    next[pageIndex] = { ...page, layoutType: layout, slots: newSlots };
    set({ pages: next, isDirty: true });
  },

  setPageBackground: (pageIndex, color) => {
    const { pages } = get();
    const next = [...pages];
    if (next[pageIndex]) {
      next[pageIndex] = { ...next[pageIndex], backgroundColor: color };
      set({ pages: next, isDirty: true });
    }
  },

  clearPageSlots: (pageIndex) => {
    const { pages } = get();
    const page = pages[pageIndex];
    if (!page) return;
    const next = [...pages];
    next[pageIndex] = {
      ...page,
      slots: createEmptySlots(page.layoutType),
    };
    set({ pages: next, isDirty: true });
  },

  addCustomProduct: (product) => {
    const { customProducts } = get();
    set({
      customProducts: [
        {
          id: `custom-${Date.now()}`,
          ...product,
        },
        ...customProducts,
      ],
    });
  },

  addProductToSlot: (pageIndex, slotIndex, product) => {
    const { pages } = get();
    const next = [...pages];
    const page = next[pageIndex];
    if (!page) return;
    const slots = [...page.slots];
    slots[slotIndex] = {
      ...product,
      slotIndex,
      itemId: null,
      overrideTitle: null,
      overrideDescription: null,
      overrideImageUrl: null,
      overridePrice: null,
    };
    next[pageIndex] = { ...page, slots };
    set({ pages: next, isDirty: true });
  },

  addProductToNextSlot: (product) => {
    const { pages } = get();
    // Mevcut sayfalarda ilk bos slot'u bul
    for (let pi = 0; pi < pages.length; pi++) {
      const page = pages[pi];
      if (page.layoutType === 'cover') continue;
      for (let si = 0; si < page.slots.length; si++) {
        if (!page.slots[si].sourceProductId) {
          get().addProductToSlot(pi, si, product);
          return { pageIndex: pi, slotIndex: si };
        }
      }
    }
    // Bos slot yok — yeni sayfa olustur
    const lastPage = pages[pages.length - 1];
    const layout = lastPage?.layoutType === 'cover' ? '2x2' : (lastPage?.layoutType || '2x2');
    get().addPage(layout as LayoutType);
    const newPageIndex = get().pages.length - 1;
    get().addProductToSlot(newPageIndex, 0, product);
    set({ activePage: newPageIndex });
    return { pageIndex: newPageIndex, slotIndex: 0 };
  },

  removeProductFromSlot: (pageIndex, slotIndex) => {
    const { pages } = get();
    const next = [...pages];
    const page = next[pageIndex];
    if (!page) return;
    const slots = [...page.slots];
    slots[slotIndex] = createEmptySlots(page.layoutType)[0];
    slots[slotIndex].slotIndex = slotIndex;
    next[pageIndex] = { ...page, slots };
    set({ pages: next, isDirty: true });
  },

  updateOverride: (pageIndex, slotIndex, override) => {
    const { pages } = get();
    const next = [...pages];
    const page = next[pageIndex];
    if (!page) return;
    const slots = [...page.slots];
    slots[slotIndex] = { ...slots[slotIndex], ...override };
    next[pageIndex] = { ...page, slots };
    set({ pages: next, isDirty: true });
  },

  markSaving: (saving) => set({ isSaving: saving }),
  markClean: () => set({ isDirty: false }),
}));
