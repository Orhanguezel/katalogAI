// =============================================================
// FILE: src/app/(main)/admin/(admin)/catalogs/[id]/_components/zoom-controls.tsx
// Zoom Controls for Canvas
// =============================================================

'use client';

import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { useCatalogBuilderStore } from '../_store/catalog-builder-store';

const ZOOM_STEPS = [50, 75, 100, 125, 150];

export default function ZoomControls() {
  const { zoom, setZoom } = useCatalogBuilderStore();

  const zoomIn = () => {
    const next = ZOOM_STEPS.find((z) => z > zoom);
    if (next) setZoom(next);
  };

  const zoomOut = () => {
    const prev = [...ZOOM_STEPS].reverse().find((z) => z < zoom);
    if (prev) setZoom(prev);
  };

  return (
    <div className="flex items-center gap-3 text-katalog-text-muted">
      <span className="text-xs">Zoom:</span>
      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md border border-white/8 hover:bg-white/5" onClick={zoomOut}>
        <Minus className="h-3.5 w-3.5" />
      </Button>
      <span className="w-10 text-center font-medium text-sm text-white">{zoom}%</span>
      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md border border-white/8 hover:bg-white/5" onClick={zoomIn}>
        <Plus className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
