/**
 * Simple Request Caching Utility
 * Caches API responses to reduce network requests
 */

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class RequestCache {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes default

  /**
   * Get cached value if it exists and hasn't expired
   */
  get<T = any>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) return null;

    // Check if cache entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set cache value with optional TTL
   */
  set<T = any>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Check if key exists and is valid
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Delete specific cache entry
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Clear expired entries
   */
  clearExpired(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > entry.ttl) {
        expiredKeys.push(key);
      }
    });

    expiredKeys.forEach((key) => this.cache.delete(key));
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const validEntries = Array.from(this.cache.values()).filter(
      (entry) => Date.now() - entry.timestamp <= entry.ttl
    );

    return {
      totalEntries: this.cache.size,
      validEntries: validEntries.length,
      expiredEntries: this.cache.size - validEntries.length,
      cacheSize: new Blob([JSON.stringify(Array.from(this.cache.values()))]).size,
    };
  }

  /**
   * Create cache key from URL and options
   */
  static createKey(url: string, options?: RequestInit): string {
    const method = options?.method || "GET";
    const body = options?.body ? JSON.stringify(options.body) : "";
    return `${method}:${url}:${body}`;
  }
}

export const requestCache = new RequestCache();

/**
 * Cached fetch wrapper
 */
export async function cachedFetch<T = any>(
  url: string,
  options: RequestInit & { cacheTTL?: number } = {}
): Promise<T> {
  const { cacheTTL, ...fetchOptions } = options;
  const cacheKey = RequestCache.createKey(url, fetchOptions);

  // Check cache for GET requests only
  if (!fetchOptions.method || fetchOptions.method === "GET") {
    const cached = requestCache.get<T>(cacheKey);
    if (cached) {
      console.log(`[Cache HIT] ${url}`);
      return cached;
    }
  }

  // Make request if not cached
  console.log(`[Cache MISS] ${url}`);
  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json() as T;

  // Cache GET requests
  if (!fetchOptions.method || fetchOptions.method === "GET") {
    requestCache.set(cacheKey, data, cacheTTL);
  }

  return data;
}

/**
 * Invalidate cache for specific endpoint patterns
 */
export function invalidateCache(_pattern: string): number {
  let invalidated = 0;
  requestCache.clearExpired();

  // Simple pattern matching
  requestCache.clear(); // For now, clear all on any invalidation
  invalidated = 1;

  return invalidated;
}

export default requestCache;
