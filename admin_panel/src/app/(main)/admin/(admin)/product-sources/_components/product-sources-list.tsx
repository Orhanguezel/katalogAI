// =============================================================
// FILE: src/app/(main)/admin/(admin)/product-sources/_components/product-sources-list.tsx
// Product Sources — List Panel
// =============================================================

'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Database, MoreHorizontal, Pencil, Plus, TestTube, Trash2, Upload } from 'lucide-react';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import {
  useListProductSourcesAdminQuery,
  useDeleteProductSourceAdminMutation,
} from '@/integrations/hooks';
import type { ProductSourceDto } from '@/integrations/shared';

import ProductSourceForm from './product-source-form';
import ProductSourceTestDialog from './product-source-test-dialog';

export default function ProductSourcesList() {
  const t = useAdminT('admin.productSources');
  const { data: sources, isLoading } = useListProductSourcesAdminQuery();
  const [deleteSource] = useDeleteProductSourceAdminMutation();

  const [editingSource, setEditingSource] = React.useState<ProductSourceDto | null>(null);
  const [showForm, setShowForm] = React.useState(false);
  const [testingSourceId, setTestingSourceId] = React.useState<string | null>(null);

  const handleCreate = () => {
    setEditingSource(null);
    setShowForm(true);
  };

  const handleEdit = (source: ProductSourceDto) => {
    setEditingSource(source);
    setShowForm(true);
  };

  const handleDelete = async (source: ProductSourceDto) => {
    if (!confirm(t('messages.confirmDelete', { name: source.name }))) return;
    await deleteSource(source.id);
  };

  if (isLoading) {
    return <p className="text-muted-foreground text-sm py-8 text-center">{t('list.loading')}</p>;
  }

  return (
    <>
      <div className="flex justify-end mb-6">
        <Button 
          size="lg" 
          onClick={handleCreate}
          className="rounded-xl bg-katalog-gold px-6 font-bold text-katalog-bg-deep shadow-[0_8px_30px_rgba(194,157,93,0.15)] hover:bg-katalog-gold-light transition-all"
        >
          <Plus className="mr-2 h-5 w-5" />
          {t('actions.create') || 'Yeni Kaynak Ekle'}
        </Button>
      </div>

      {!sources?.length ? (
        <div className="py-12 text-center bg-katalog-bg-card/40 rounded-2xl border border-dashed border-white/5">
          <Database className="mx-auto h-12 w-12 text-katalog-text-dim/40 mb-4" />
          <p className="text-katalog-text-dim text-sm">{t('list.empty') || 'Henüz bir veri kaynağı eklenmedi.'}</p>
        </div>
      ) : (
        <div className="rounded-xl border border-white/5 bg-katalog-bg-card overflow-hidden">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="hover:bg-transparent border-white/5">
                <TableHead className="text-white font-bold">{t('table.name')}</TableHead>
                <TableHead className="text-white font-bold">{t('table.type')}</TableHead>
                <TableHead className="text-white font-bold">{t('table.locale')}</TableHead>
                <TableHead className="text-white font-bold">{t('table.status')}</TableHead>
                <TableHead className="w-[80px] text-right pr-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sources.map((source) => (
                <TableRow key={source.id} className="hover:bg-white/2 border-white/5 transition-colors">
                  <TableCell className="font-medium text-white py-4 pl-6">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-katalog-gold/10 flex items-center justify-center">
                          <Database className="h-4 w-4 text-katalog-gold" />
                       </div>
                       {source.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-katalog-gold/30 text-katalog-gold bg-katalog-gold/5 uppercase tracking-widest text-[10px] font-bold">
                      {t(`sourceTypes.${source.source_type}`) || source.source_type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-katalog-text-dim font-mono text-xs">{source.default_locale}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       <div className={`w-1.5 h-1.5 rounded-full ${source.is_active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`} />
                       <span className={`text-xs font-medium ${source.is_active ? 'text-emerald-400' : 'text-red-400'}`}>
                         {source.is_active ? t('status.active') : t('status.inactive')}
                       </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-katalog-text-dim hover:text-white hover:bg-white/5 transition-all">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-katalog-bg-panel border-white/10 text-white w-48">
                        <DropdownMenuItem onClick={() => handleEdit(source)} className="focus:bg-white/5 cursor-pointer">
                          <Pencil className="mr-2 h-4 w-4" />
                          {t('actions.edit') || 'Düzenle'}
                        </DropdownMenuItem>
                        {source.source_type === 'database' && (
                          <DropdownMenuItem onClick={() => setTestingSourceId(source.id)} className="focus:bg-white/5 cursor-pointer">
                            <TestTube className="mr-2 h-4 w-4" />
                            {t('actions.test') || 'Bağlantıyı Test Et'}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="text-red-400 focus:bg-red-400/10 focus:text-red-400 cursor-pointer"
                          onClick={() => handleDelete(source)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t('actions.delete') || 'Sil'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ProductSourceForm
        open={showForm}
        onOpenChange={setShowForm}
        source={editingSource}
      />

      <ProductSourceTestDialog
        sourceId={testingSourceId}
        open={testingSourceId !== null}
        onOpenChange={(open) => { if (!open) setTestingSourceId(null); }}
      />
    </>
  );
}
