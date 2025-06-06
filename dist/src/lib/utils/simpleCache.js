"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheTTL = exports.cleanExpiredCache = exports.getCacheStats = exports.setInCache = exports.getFromCache = void 0;
const ONE_HOUR_MS = 60 * 60 * 1000;
const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;
const FIVE_MINUTES_MS = 5 * 60 * 1000;
const cache = new Map();
/**
 * Get data from cache
 * @param key - Cache key
 * @returns Cached data or null if not found/expired
 */
const getFromCache = (key) => {
    const item = cache.get(key);
    if (!item || Date.now() > item.expires) {
        cache.delete(key);
        return null;
    }
    return item.data;
};
exports.getFromCache = getFromCache;
/**
 * Set data in cache with TTL
 * @param key - Cache key
 * @param data - Data to cache
 * @param ttlMs - Time to live in milliseconds
 */
const setInCache = (key, data, ttlMs) => {
    cache.set(key, { data, expires: Date.now() + ttlMs });
};
exports.setInCache = setInCache;
/**
 * Get cache statistics
 * @returns Object with cache size and other stats
 */
const getCacheStats = () => ({
    size: cache.size,
});
exports.getCacheStats = getCacheStats;
/**
 * Clear expired entries from cache
 * @returns Number of entries removed
 */
const cleanExpiredCache = () => {
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
exports.cleanExpiredCache = cleanExpiredCache;
exports.CacheTTL = {
    VEHICLES: ONE_HOUR_MS,
    COMPLAINTS: FIFTEEN_MINUTES_MS,
    HEALTH: FIVE_MINUTES_MS,
};
