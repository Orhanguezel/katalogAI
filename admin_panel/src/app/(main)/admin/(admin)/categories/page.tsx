// =============================================================
// FILE: src/app/(main)/admin/(admin)/categories/page.tsx
// Admin Categories Page
// =============================================================

import CategoriesPage from './categories';

interface Props {
  searchParams: Promise<{ module?: string }>;
}

export default async function Page({ searchParams }: Props) {
  const { module: moduleKey } = await searchParams;
  return <CategoriesPage moduleKey={moduleKey} />;
}
