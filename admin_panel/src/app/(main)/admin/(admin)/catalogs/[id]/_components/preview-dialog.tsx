// =============================================================
// FILE: src/app/(main)/admin/(admin)/catalogs/[id]/_components/preview-dialog.tsx
// Full-page Preview Dialog
// =============================================================

'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { useCatalogBuilderStore } from '../_store/catalog-builder-store';
import CatalogPageCanvas from './catalog-page-canvas';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PreviewDialog({ open, onOpenChange }: Props) {
  const t = useAdminT('admin.catalogs');
  const { pages, colorTheme, accentColor, backgroundColor, fontFamily, headingFont } = useCatalogBuilderStore();
  const printRef = React.useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{t('actions.preview')}</DialogTitle>
            <Button
              size="sm"
              onClick={handlePrint}
              className="bg-katalog-gold hover:bg-katalog-gold-light text-katalog-bg-deep font-semibold"
            >
              <Printer className="mr-2 h-4 w-4" />
              {t('actions.print')}
            </Button>
          </div>
        </DialogHeader>

        <div ref={printRef} data-print-area className="space-y-8 py-4">
          {pages.map((page, index) => (
            <div key={index} className="mx-auto" style={{ maxWidth: 595 }}>
              <CatalogPageCanvas
                page={page}
                pageIndex={index}
                colorTheme={colorTheme}
                accentColor={accentColor}
                backgroundColor={backgroundColor}
                fontFamily={fontFamily}
                headingFont={headingFont}
                preview
              />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
