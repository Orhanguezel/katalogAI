// =============================================================
// FILE: src/app/(main)/admin/(admin)/catalogs/[id]/page.tsx
// Catalog Builder Page (Server Component)
// =============================================================

import CatalogBuilder from './catalog-builder';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <CatalogBuilder catalogId={id} />;
}
