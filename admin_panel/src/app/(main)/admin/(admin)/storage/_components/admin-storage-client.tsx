'use client';

// =============================================================
// FILE: src/app/(main)/admin/(admin)/storage/_components/admin-storage-client.tsx
// Admin Storage List
// =============================================================

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Plus,
  RefreshCcw,
  Search,
  Trash2,
  Pencil,
  Loader2,
  Image as ImageIcon,
  File,
  Folder,
  Download,
  CheckSquare,
  Square,
} from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import type { StorageAsset } from '@/integrations/shared';
import {
  ADMIN_STORAGE_ALL_OPTION,
  ADMIN_STORAGE_DEFAULT_FILTERS,
  ADMIN_STORAGE_MIME_OPTIONS,
  buildAdminStorageListQuery,
  formatAdminStorageBytes,
  formatAdminStorageDateTime,
  getAdminStorageMimeColorClass,
  getAdminStorageMimeIcon,
  getErrorMessage,
  truncateNullable,
} from '@/integrations/shared';
import {
  useListAssetsAdminQuery,
  useDeleteAssetAdminMutation,
  useBulkDeleteAssetsAdminMutation,
  useListFoldersAdminQuery,
} from '@/integrations/hooks';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';

export default function AdminStorageClient() {
  const router = useRouter();
  const t = useAdminT('admin.storage');

  const [filters, setFilters] = React.useState(ADMIN_STORAGE_DEFAULT_FILTERS);

  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  // Build query params
  const queryParams = React.useMemo(() => buildAdminStorageListQuery(filters), [filters]);

  // RTK Query
  const {
    data: result,
    isLoading,
    isFetching,
    refetch,
  } = useListAssetsAdminQuery(queryParams);

  const { data: folders = [] } = useListFoldersAdminQuery();

  const [deleteAsset] = useDeleteAssetAdminMutation();
  const [bulkDeleteAssets] = useBulkDeleteAssetsAdminMutation();

  const items = result?.items || [];
  const total = result?.total || 0;

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<StorageAsset | null>(null);

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const handleBucketChange = (value: string) => {
    setFilters((prev) => ({ ...prev, bucket: value }));
  };

  const handleFolderChange = (value: string) => {
    setFilters((prev) => ({ ...prev, folder: value }));
  };

  const handleMimeChange = (value: string) => {
    setFilters((prev) => ({ ...prev, mime: value }));
  };

  const handleSelectAll = () => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((item) => item.id)));
    }
  };

  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) {
      toast.error(t('list.selectFileError'));
      return;
    }

    try {
      await bulkDeleteAssets({ ids: Array.from(selectedIds) }).unwrap();
      toast.success(t('list.filesDeleted', { count: selectedIds.size }));
      setSelectedIds(new Set());
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err, t('errorFallback')));
    }
  };

  const handleEdit = (item: StorageAsset) => {
    router.push(`/admin/storage/${item.id}`);
  };

  const handleDeleteClick = (item: StorageAsset) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      await deleteAsset({ id: itemToDelete.id }).unwrap();
      toast.success(t('list.fileDeleted'));
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err, t('errorFallback')));
    }
  };

  const busy = isLoading;
  const hasSelection = selectedIds.size > 0;

  // Unique buckets from items
  const buckets = React.useMemo(() => {
    const set = new Set(items.map((item) => item.bucket).filter(Boolean));
    return Array.from(set);
  }, [items]);

  return (
    <>
    <div className="mx-auto max-w-7xl space-y-8 py-6 px-2">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-white">
            {t('list.title') || 'Dosya Havuzu'}
          </h1>
          <p className="text-sm text-katalog-text-dim max-w-lg">
            {t('list.description') || 'Tüm görsel ve katalog çıktılarını buradan yönetin.'}
          </p>
        </div>
        <div className="flex gap-2">
          {hasSelection && (
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={busy}
              className="gap-2 bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 active:scale-95 transition-all"
            >
              <Trash2 className="size-4" />
              {t('list.deleteSelected', { count: selectedIds.size })}
            </Button>
          )}
          <Button
            size="lg"
            onClick={() => router.push('/admin/storage/new')}
            disabled={busy}
            className="rounded-xl bg-katalog-gold px-6 font-bold text-katalog-bg-deep shadow-[0_8px_30px_rgba(194,157,93,0.15)] hover:bg-katalog-gold-light active:scale-95 transition-all"
          >
            <Plus className="mr-2 h-5 w-5" />
            {t('list.uploadButton') || 'Dosya Yükle'}
          </Button>
        </div>
      </div>

      <div className="bg-katalog-bg-panel border border-white/5 rounded-2xl overflow-hidden p-6 space-y-6">
        {/* Filters */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-end">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="search" className="text-xs font-bold text-white/60 uppercase tracking-widest">
              {t('list.searchLabel')}
            </Label>
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-focus-within:text-katalog-gold transition-colors" />
              <Input
                id="search"
                placeholder={t('list.searchPlaceholder')}
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                disabled={busy}
                className="pl-11 h-10 bg-katalog-bg-card border-white/5 text-white placeholder:text-katalog-text-dim focus:border-katalog-gold transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bucket" className="text-xs font-bold text-white/60 uppercase tracking-widest">
              {t('list.bucketLabel')}
            </Label>
            <Select value={filters.bucket} onValueChange={handleBucketChange} disabled={busy}>
              <SelectTrigger id="bucket" className="h-10 bg-katalog-bg-card border-white/5 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-katalog-bg-panel border-white/10 text-white">
                <SelectItem value={ADMIN_STORAGE_ALL_OPTION}>{t('list.allOption')}</SelectItem>
                {buckets.map((b) => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="folder" className="text-xs font-bold text-white/60 uppercase tracking-widest">
              <div className="flex items-center gap-1.5">
                <Folder className="size-3.5" />
                {t('list.folderLabel')}
              </div>
            </Label>
            <Select value={filters.folder} onValueChange={handleFolderChange} disabled={busy}>
              <SelectTrigger id="folder" className="h-10 bg-katalog-bg-card border-white/5 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-katalog-bg-panel border-white/10 text-white">
                {folders.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f || t('list.rootFolder')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="mime" className="text-xs font-bold text-white/60 uppercase tracking-widest">
              {t('list.fileTypeLabel')}
            </Label>
            <Select value={filters.mime} onValueChange={handleMimeChange} disabled={busy}>
              <SelectTrigger id="mime" className="h-10 bg-katalog-bg-card border-white/5 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-katalog-bg-panel border-white/10 text-white">
                <SelectItem value={ADMIN_STORAGE_ALL_OPTION}>{t('list.allOption')}</SelectItem>
                {ADMIN_STORAGE_MIME_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {t(`list.${option.labelKey}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end lg:col-span-3 gap-2">
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={busy}
              className="h-10 border-white/10 bg-white/5 text-white hover:bg-white/10"
            >
              <RefreshCcw className={cn('size-4 mr-2', isFetching && 'animate-spin')} />
              {t('list.refreshButton')}
            </Button>
            
            <div className="flex-1 text-right text-[10px] text-katalog-text-dim uppercase tracking-widest font-mono self-center">
              {t('list.totalFiles', { total })}
              {hasSelection && ` • ${t('list.selectedCount', { count: selectedIds.size })}`}
            </div>
          </div>
        </div>
      </div>

      {/* Table (Desktop) */}
      <div className="hidden xl:block bg-katalog-bg-panel border border-white/5 rounded-2xl overflow-hidden p-6">
        <div className="rounded-xl border border-white/5 bg-katalog-bg-card overflow-hidden">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="hover:bg-transparent border-white/5">
                <TableHead className="w-12 items-center justify-center flex">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSelectAll}
                    disabled={busy}
                    className="h-8 w-8 hover:bg-white/5"
                  >
                    {selectedIds.size === items.length && items.length > 0 ? (
                      <CheckSquare className="size-4 text-katalog-gold" />
                    ) : (
                      <Square className="size-4 text-white/30" />
                    )}
                  </Button>
                </TableHead>
                <TableHead className="w-20 text-white font-bold">{t('list.previewColumn')}</TableHead>
                <TableHead className="text-white font-bold">{t('list.fileColumn')}</TableHead>
                <TableHead className="w-32 text-white font-bold">{t('list.typeColumn')}</TableHead>
                <TableHead className="w-24 text-right text-white font-bold">{t('list.sizeColumn')}</TableHead>
                <TableHead className="w-44 text-white font-bold">{t('list.dateColumn')}</TableHead>
                <TableHead className="w-40 text-right pr-6 text-white font-bold"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="size-8 animate-spin text-katalog-gold" />
                      <span className="text-xs text-katalog-text-dim uppercase tracking-widest font-bold">{t('list.loading')}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-40 text-center text-katalog-text-dim/40 italic">
                    {t('list.noFiles')}
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => {
                  const Icon = getAdminStorageMimeIcon(item.mime);
                  const colorClass = getAdminStorageMimeColorClass(item.mime);
                  const isSelected = selectedIds.has(item.id);

                  return (
                    <TableRow key={item.id} className={cn('hover:bg-white/2 border-white/5 transition-colors', isSelected && 'bg-katalog-gold/5')}>
                      <TableCell className="w-12 text-center pl-4 py-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleSelectItem(item.id)}
                          disabled={busy}
                          className="h-8 w-8 hover:bg-white/5"
                        >
                          {isSelected ? (
                            <CheckSquare className="size-4 text-katalog-gold" />
                          ) : (
                            <Square className="size-4 text-white/10" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        {item.url && item.mime.startsWith('image/') ? (
                          <div className="relative group">
                            <img
                              src={item.url}
                              alt={item.name}
                              className="size-12 rounded-lg object-cover ring-1 ring-white/5 shadow-lg group-hover:scale-110 transition-transform cursor-pointer"
                              onClick={() => window.open(item.url || '', '_blank')}
                            />
                          </div>
                        ) : (
                          <div className="flex size-12 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/5">
                            <Icon className={cn('size-6', colorClass)} />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-bold text-white text-sm">{truncateNullable(item.name, 40, '-')}</div>
                          <div className="flex items-center gap-2">
                             <Badge variant="outline" className="text-[9px] border-white/10 text-white/40 uppercase font-mono">{item.bucket}</Badge>
                             {item.folder && (
                               <div className="flex items-center gap-1 text-[10px] text-katalog-text-dim">
                                 <Folder className="size-3" />
                                 {item.folder}
                               </div>
                             )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-[10px] text-katalog-text-dim uppercase tracking-widest font-bold">
                          {item.mime.split('/')[1] || item.mime}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs text-katalog-text-dim pr-4">
                        {formatAdminStorageBytes(item.size)}
                      </TableCell>
                      <TableCell className="text-xs text-katalog-text-dim">
                        <div>{formatAdminStorageDateTime(item.created_at)}</div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          {item.url && (
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                              className="h-9 w-9 text-katalog-text-dim hover:text-white"
                            >
                              <a href={item.url} download target="_blank" rel="noopener noreferrer">
                                <Download className="size-4" />
                              </a>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(item)}
                            disabled={busy}
                            className="h-9 w-9 text-katalog-text-dim hover:text-white"
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(item)}
                            disabled={busy}
                            className="h-9 w-9 text-katalog-text-dim hover:text-red-400"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Cards (Mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:hidden px-2">
        {isLoading ? (
           <div className="col-span-full py-20 text-center">
              <Loader2 className="size-8 animate-spin text-katalog-gold mx-auto mb-4" />
              <p className="text-xs text-katalog-text-dim uppercase tracking-widest font-bold">{t('list.loading')}</p>
           </div>
        ) : items.length === 0 ? (
           <div className="col-span-full py-20 text-center text-katalog-text-dim/40 italic border border-dashed border-white/5 rounded-2xl">
              {t('list.noFiles')}
           </div>
        ) : (
          items.map((item) => {
            const Icon = getAdminStorageMimeIcon(item.mime);
            const colorClass = getAdminStorageMimeColorClass(item.mime);
            const isSelected = selectedIds.has(item.id);

            return (
              <div key={item.id} className={cn('relative bg-katalog-bg-panel border border-white/5 rounded-2xl p-4 transition-all group overflow-hidden', isSelected && 'ring-2 ring-katalog-gold')}>
                <div className="absolute top-2 left-2 z-10">
                   <Button size="icon" variant="ghost" onClick={() => handleSelectItem(item.id)} className="h-8 w-8 bg-black/40 backdrop-blur-sm border border-white/10">
                      {isSelected ? <CheckSquare className="size-4 text-katalog-gold" /> : <Square className="size-4 text-white/50" />}
                   </Button>
                </div>

                <div className="aspect-video w-full mb-4 rounded-xl overflow-hidden bg-katalog-bg-card ring-1 ring-white/5">
                   {item.url && item.mime.startsWith('image/') ? (
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                   ) : (
                      <div className="w-full h-full flex items-center justify-center">
                         <Icon className={cn('size-12', colorClass)} />
                      </div>
                   )}
                </div>

                <div className="space-y-3">
                   <div className="space-y-1">
                      <h3 className="font-bold text-white text-sm line-clamp-1">{item.name}</h3>
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] text-katalog-text-dim uppercase tracking-widest font-bold">{item.mime.split('/')[1]} • {formatAdminStorageBytes(item.size)}</span>
                         <span className="text-[10px] text-katalog-text-dim font-mono">{formatAdminStorageDateTime(item.created_at).split(' ')[0]}</span>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-2 mt-2">
                       <Button variant="outline" size="sm" className="h-9 border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-[11px]" onClick={() => handleEdit(item)}>
                          {t('list.editButtonCompact')}
                       </Button>
                       <Button variant="outline" size="sm" className="h-9 border-white/10 bg-white/5 hover:bg-red-400/10 hover:text-red-400 text-white font-bold text-[11px]" onClick={() => handleDeleteClick(item)}>
                          {t('list.deleteButtonCompact')}
                       </Button>
                   </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-katalog-bg-panel border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-2xl">{t('list.deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription className="text-katalog-text-dim">
              {t('list.deleteConfirmDescription', { name: itemToDelete?.name || t('list.defaultFileName') })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">{t('list.cancelButton')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 text-white hover:bg-red-600">{t('list.deleteButton')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    </>
  );
}
