// =============================================================
// FILE: src/app/(main)/admin/(admin)/catalogs/[id]/_components/ai-enhance-dialog.tsx
// AI Content Enhancement Dialog
// =============================================================

'use client';

import * as React from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Check, Languages, Loader2, Sparkles } from 'lucide-react';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import {
  useAiEnhanceDescriptionAdminMutation,
  useAiTranslateAdminMutation,
} from '@/integrations/hooks';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productTitle: string;
  productDescription?: string;
  productCategory?: string;
  productSpecs?: Record<string, string>;
  productLocale?: string;
  onApply: (text: string) => void;
}

type AiMode = 'enhance' | 'translate';

const LOCALE_OPTIONS = [
  { value: 'tr', label: 'Türkçe' },
  { value: 'de', label: 'Deutsch' },
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'ar', label: 'العربية' },
  { value: 'ru', label: 'Русский' },
];

export default function AiEnhanceDialog({
  open,
  onOpenChange,
  productTitle,
  productDescription,
  productCategory,
  productSpecs,
  productLocale,
  onApply,
}: Props) {
  const t = useAdminT('admin.catalogs');
  const [mode, setMode] = React.useState<AiMode>('enhance');
  const [targetLocale, setTargetLocale] = React.useState('de');
  const [result, setResult] = React.useState('');

  const [enhance, { isLoading: isEnhancing }] = useAiEnhanceDescriptionAdminMutation();
  const [translate, { isLoading: isTranslating }] = useAiTranslateAdminMutation();

  const isLoading = isEnhancing || isTranslating;

  const handleGenerate = async () => {
    setResult('');
    try {
      if (mode === 'enhance') {
        const res = await enhance({
          title: productTitle,
          description: productDescription,
          category: productCategory,
          specs: productSpecs,
          locale: productLocale,
        }).unwrap();
        setResult(res.result);
      } else {
        const text = productDescription || productTitle;
        const res = await translate({ text, target_locale: targetLocale }).unwrap();
        setResult(res.result);
      }
    } catch {
      toast.error(t('ai.error'));
    }
  };

  const handleApply = () => {
    if (result) {
      onApply(result);
      onOpenChange(false);
      setResult('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-katalog-gold" />
            {t('ai.title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Product info */}
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-sm font-medium">{productTitle}</p>
            {productDescription && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{productDescription}</p>
            )}
          </div>

          {/* Mode selection */}
          <div className="flex gap-2">
            <Button
              variant={mode === 'enhance' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('enhance')}
              className={mode === 'enhance' ? 'bg-katalog-gold text-katalog-bg-deep hover:bg-katalog-gold-light' : ''}
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              {t('ai.enhance')}
            </Button>
            <Button
              variant={mode === 'translate' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('translate')}
              className={mode === 'translate' ? 'bg-katalog-gold text-katalog-bg-deep hover:bg-katalog-gold-light' : ''}
            >
              <Languages className="mr-1.5 h-3.5 w-3.5" />
              {t('ai.translate')}
            </Button>
          </div>

          {/* Translate locale selector */}
          {mode === 'translate' && (
            <div className="space-y-1.5">
              <Label>{t('ai.targetLocale')}</Label>
              <Select value={targetLocale} onValueChange={setTargetLocale}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LOCALE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Generate button */}
          <Button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full bg-katalog-gold hover:bg-katalog-gold-light text-katalog-bg-deep font-semibold"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {t('ai.generate')}
          </Button>

          {/* Result preview */}
          {result && (
            <div className="rounded-lg border border-katalog-gold/20 bg-katalog-gold/5 p-3">
              <p className="text-[11px] uppercase tracking-wider text-katalog-gold font-semibold mb-1.5">
                {t('ai.result')}
              </p>
              <p className="text-sm leading-relaxed">{result}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {t('ai.cancel')}
          </Button>
          {result && (
            <Button
              onClick={handleApply}
              className="bg-katalog-gold hover:bg-katalog-gold-light text-katalog-bg-deep font-semibold"
            >
              <Check className="mr-2 h-4 w-4" />
              {t('ai.apply')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
