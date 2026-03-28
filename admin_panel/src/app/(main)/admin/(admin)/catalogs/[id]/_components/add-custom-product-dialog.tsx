'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Loader2, Plus } from 'lucide-react';
import { AdminImageUploadField } from '@/app/(main)/admin/_components/common/admin-image-upload-field';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCatalogBuilderStore } from '../_store/catalog-builder-store';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddCustomProductDialog({ open, onOpenChange }: Props) {
  const { addCustomProduct, locale } = useCatalogBuilderStore();
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  const resetForm = React.useCallback(() => {
    setTitle('');
    setDescription('');
    setPrice('');
    setImageUrl('');
  }, []);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error('Ürün adı zorunludur.');
      return;
    }

    setSubmitting(true);
    addCustomProduct({
      title: title.trim(),
      description: description.trim(),
      imageUrl,
      price: price.trim() ? Number(price) : null,
      categoryName: 'Özel Ürün',
      locale,
    });
    setSubmitting(false);
    resetForm();
    onOpenChange(false);
    toast.success('Özel ürün kütüphaneye eklendi.');
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) resetForm();
      }}
    >
      <DialogContent className="border-white/10 bg-katalog-bg-panel p-0 text-white sm:max-w-[440px]">
        <div className="rounded-[20px] border border-white/5 bg-katalog-bg-panel p-8">
          <DialogHeader className="space-y-2">
            <DialogTitle className="font-serif text-[28px] leading-none text-katalog-gold">
              Yeni Ürün Ekle
            </DialogTitle>
            <p className="text-sm text-katalog-text-muted">
              Görsel, isim, açıklama ve fiyat bilgisiyle özel ürün oluşturun.
            </p>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-white">Ürün Görseli</Label>
              <AdminImageUploadField
                label=""
                value={imageUrl}
                onChange={(value) => setImageUrl(value ?? '')}
                previewAspect="1x1"
                previewObjectFit="cover"
                bucket="catalogs"
                folder="custom-products"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-white">Ürün Adı</Label>
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="h-10 border-white/8 bg-katalog-bg-card text-white"
                placeholder="Örn: Black Krim Domates"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-white">Açıklama</Label>
              <Textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="min-h-24 border-white/8 bg-katalog-bg-card text-white"
                placeholder="Ürün açıklaması..."
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-white">Fiyat</Label>
              <Input
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                className="h-10 border-white/8 bg-katalog-bg-card text-white"
                inputMode="decimal"
                placeholder="120"
              />
            </div>
          </div>

          <DialogFooter className="mt-6 flex-row justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              className="border border-white/10 text-katalog-text-muted hover:bg-white/5 hover:text-white"
              onClick={() => onOpenChange(false)}
            >
              Vazgeç
            </Button>
            <Button
              type="button"
              className="bg-katalog-gold text-katalog-bg-deep hover:bg-katalog-gold-light"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              Ekle
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
