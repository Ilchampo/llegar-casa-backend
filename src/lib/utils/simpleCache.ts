const ONE_HOUR_MS = 60 * 60 * 1000;
const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;
const FIVE_MINUTES_MS = 5 * 60 * 1000;

interface CacheItem<T = unknown> {
	data: T;
	expires: number;
}

const cache = new Map<string, CacheItem<unknown>>();

/**
 * Get data from cache
 * @param key - Cache key
 * @returns Cached data or null if not found/expired
 */
export const getFromCache = <T>(key: string): T | null => {
	const item = cache.get(key);
	if (!item || Date.now() > item.expires) {
		cache.delete(key);
		return null;
	}
	return item.data as T;
};

/**
 * Set data in cache with TTL
 * @param key - Cache key
 * @param data - Data to cache
 * @param ttlMs - Time to live in milliseconds
 */
export const setInCache = <T>(key: string, data: T, ttlMs: number): void => {
	cache.set(key, { data, expires: Date.now() + ttlMs });
};

/**
 * Get cache statistics
 * @returns Object with cache size and other stats
 */
export const getCacheStats = () => ({
	size: cache.size,
});

/**
 * Clear expired entries from cache
 * @returns Number of entries removed
 */
export const cleanExpiredCache = (): number => {
	let cleaned = 0;
	const now = Date.now();

	for (const [key, item] of cache.entries()) {
		if (now > item.expires) {
			cache.delete(key);
			cleaned++;
		}
	}

	return cleaned;
};

export const CacheTTL = {
	VEHICLES: ONE_HOUR_MS,
	COMPLAINTS: FIFTEEN_MINUTES_MS,
	HEALTH: FIVE_MINUTES_MS,
} as const;
