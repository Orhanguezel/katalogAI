// =============================================================
// FILE: src/navigation/nav-path-utils.ts
// Shared path matching utilities for navigation active state
// =============================================================

export function normalizePathname(pathname: string) {
  if (!pathname) return '/';
  return pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

export function toUrlParts(targetUrl: string) {
  const parsed = new URL(String(targetUrl || '/'), 'http://localhost');
  return {
    pathname: normalizePathname(parsed.pathname || '/'),
    searchEntries: Array.from(parsed.searchParams.entries()),
  };
}

export function isPathActive(
  currentPath: string,
  currentSearchParams: URLSearchParams,
  targetUrl: string,
) {
  const activePath = normalizePathname(String(currentPath || '/'));
  const target = toUrlParts(targetUrl);

  if (target.searchEntries.length > 0) {
    return (
      activePath === target.pathname &&
      target.searchEntries.every(([key, value]) => currentSearchParams.get(key) === value)
    );
  }

  return activePath === target.pathname || activePath.startsWith(`${target.pathname}/`);
}
