import type { CacheService } from "./cache-service.interface"

interface CacheItem<T> {
  value: T
  expiry: number | null
}

/**
 * Implementation of the cache service
 */
export class CacheServiceImpl implements CacheService {
  private cache: Map<string, CacheItem<any>> = new Map()

  /**
   * Get a value from the cache
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key)

    if (!item) {
      return null
    }

    // Check if the item has expired
    if (item.expiry !== null && Date.now() > item.expiry) {
      this.cache.delete(key)
      return null
    }

    return item.value as T
  }

  /**
   * Set a value in the cache
   */
  set<T>(key: string, value: T, ttlSeconds?: number): void {
    const expiry = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null

    this.cache.set(key, {
      value,
      expiry,
    })
  }

  /**
   * Check if a key exists in the cache
   */
  has(key: string): boolean {
    const item = this.cache.get(key)

    if (!item) {
      return false
    }

    // Check if the item has expired
    if (item.expiry !== null && Date.now() > item.expiry) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  /**
   * Remove a value from the cache
   */
  remove(key: string): void {
    this.cache.delete(key)
  }

  /**
   * Clear all values from the cache
   */
  clear(): void {
    this.cache.clear()
  }
}
