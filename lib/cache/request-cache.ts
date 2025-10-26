/**
 * Request-Level Cache Manager
 *
 * Caches data within a single HTTP request to prevent repeated queries
 * Automatically clears after request completes
 *
 * Use cases:
 * - Mentor school IDs (called multiple times per request)
 * - User permissions (static during request)
 * - Lookup tables (provinces, districts, etc.)
 *
 * Performance Impact:
 * - Mentor list request: 3 queries → 1 query per mentor (2 cache hits)
 * - Bulk operations: Reduces N+1 to single batch query
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl?: number; // milliseconds
}

class RequestCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private hits = 0;
  private misses = 0;

  /**
   * Get cached value or execute function
   */
  async get<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number // TTL in milliseconds
  ): Promise<T> {
    const cached = this.cache.get(key);

    // Check if cached and not expired
    if (cached && (!ttl || Date.now() - cached.timestamp < ttl)) {
      this.hits++;
      return cached.data as T;
    }

    // Not in cache, fetch
    const data = await fetchFn();
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });

    this.misses++;
    return data;
  }

  /**
   * Get or null
   */
  getSync<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached) {
      this.hits++;
      return cached.data as T;
    }
    this.misses++;
    return null;
  }

  /**
   * Set value directly
   */
  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  /**
   * Clear specific key
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear by pattern (e.g., "mentor:*")
   */
  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern.replace('*', '.*'));
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? ((this.hits / total) * 100).toFixed(2) : '0.00';
    return {
      hits: this.hits,
      misses: this.misses,
      total,
      hitRate: `${hitRate}%`,
      size: this.cache.size
    };
  }
}

// Export singleton for per-request caching
export const createRequestCache = () => new RequestCache();
