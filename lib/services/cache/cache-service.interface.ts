/**
 * Interface for cache service
 */
export interface CacheService {
  /**
   * Get a value from the cache
   */
  get<T>(key: string): T | null

  /**
   * Set a value in the cache
   */
  set<T>(key: string, value: T, ttlSeconds?: number): void

  /**
   * Check if a key exists in the cache
   */
  has(key: string): boolean

  /**
   * Remove a value from the cache
   */
  remove(key: string): void

  /**
   * Clear all values from the cache
   */
  clear(): void
}

/**
 * Service token for DI container
 */
export const CACHE_SERVICE_TOKEN = "CacheService"
