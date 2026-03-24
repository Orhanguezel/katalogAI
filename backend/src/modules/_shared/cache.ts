import { getRedisClient } from '@/plugins/redis';

const PREFIX = 'cache';

export const CACHE_TTL = {
  ilanList: 60,
  ilanDetail: 120,
  dashboard: 300,
} as const;

export function buildCacheQueryKey(params: Record<string, unknown>) {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
}

export const cacheKeys = {
  ilanList(filters: Record<string, unknown>) {
    const queryKey = buildCacheQueryKey(filters);
    return `${PREFIX}:ilanlar:list:${queryKey || 'all'}`;
  },
  ilanDetail(id: string) {
    return `${PREFIX}:ilanlar:detail:${id}`;
  },
  dashboard(role: 'carrier' | 'customer', userId: string) {
    return `${PREFIX}:dashboard:${role}:${userId}`;
  },
} as const;

export async function repoGetCacheJson<T>(key: string) {
  const redis = getRedisClient();
  if (!redis) return null;

  try {
    const raw = await redis.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function repoSetCacheJson(key: string, value: unknown, ttlSeconds: number) {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  } catch {
    // cache best-effort
  }
}

export async function repoDeleteCacheByPrefixes(prefixes: string[]) {
  const redis = getRedisClient();
  if (!redis || prefixes.length === 0) return;

  try {
    for (const prefix of prefixes) {
      let cursor = '0';
      do {
        const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', `${prefix}*`, 'COUNT', 100);
        cursor = nextCursor;
        if (keys.length) {
          await redis.del(...keys);
        }
      } while (cursor !== '0');
    }
  } catch {
    // cache best-effort
  }
}

export async function repoInvalidateIlanCache(id: string) {
  await repoDeleteCacheByPrefixes([
    cacheKeys.ilanDetail(id),
    `${PREFIX}:ilanlar:list:`,
  ]);
}

export async function repoInvalidateDashboardCache(userIds: string[]) {
  const uniq = [...new Set(userIds.filter(Boolean))];
  if (!uniq.length) return;

  await repoDeleteCacheByPrefixes(
    uniq.flatMap((userId) => [
      cacheKeys.dashboard('carrier', userId),
      cacheKeys.dashboard('customer', userId),
    ]),
  );
}
