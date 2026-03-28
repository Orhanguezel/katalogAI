// =============================================================
// FILE: src/app/(main)/admin/(admin)/catalogs/[id]/_components/export-email-dialog.tsx
// Send Catalog via Email Dialog
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Send } from 'lucide-react';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { useSendCatalogEmailAdminMutation } from '@/integrations/hooks';
import { useCatalogBuilderStore } from '../_store/catalog-builder-store';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ExportEmailDialog({ open, onOpenChange }: Props) {
  const t = useAdminT('admin.catalogs');
  const { catalogId, title } = useCatalogBuilderStore();
  const [sendEmail, { isLoading }] = useSendCatalogEmailAdminMutation();

  const [to, setTo] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    if (open) {
      setSubject(title || '');
      setMessage('');
    }
  }, [open, title]);

  const handleSend = async () => {
    if (!to.trim()) return;
    try {
      await sendEmail({
        catalogId,
        payload: {
          to: to.trim(),
          subject: subject || title || 'Katalog',
          message: message || undefined,
        },
      }).unwrap();
      toast.success(t('messages.emailSent'));
      onOpenChange(false);
      setTo('');
    } catch {
      toast.error(t('messages.emailFailed'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('export.emailTitle')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="email-to">{t('export.emailTo')}</Label>
            <Input
              id="email-to"
              type="email"
              placeholder="ornek@email.com"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email-subject">{t('export.emailSubject')}</Label>
            <Input
              id="email-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email-message">{t('export.emailMessage')}</Label>
            <Input
              id="email-message"
              placeholder={t('export.emailMessagePlaceholder')}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {t('export.cancel')}
          </Button>
          <Button
            onClick={handleSend}
            disabled={isLoading || !to.trim()}
            className="bg-katalog-gold hover:bg-katalog-gold-light text-katalog-bg-deep font-semibold"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {t('export.send')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
