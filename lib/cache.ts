/**
 * Simple in-memory cache implementation
 */
export class Cache<T> {
  private cache: Map<string, { value: T; expires: number }> = new Map()

  /**
   * Gets a value from the cache
   * @param key - The cache key
   * @returns The cached value or undefined if not found or expired
   */
  get(key: string): T | undefined {
    const entry = this.cache.get(key)

    if (!entry) {
      return undefined
    }

    // Check if the entry has expired
    if (entry.expires < Date.now()) {
      this.cache.delete(key)
      return undefined
    }

    return entry.value
  }

  /**
   * Sets a value in the cache
   * @param key - The cache key
   * @param value - The value to cache
   * @param ttl - Time-to-live in milliseconds
   */
  set(key: string, value: T, ttl = 60000): void {
    this.cache.set(key, {
      value,
      expires: Date.now() + ttl,
    })
  }

  /**
   * Deletes a value from the cache
   * @param key - The cache key
   * @returns True if the value was deleted, false otherwise
   */
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  /**
   * Clears the entire cache
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Gets a value from the cache or computes it if not found
   * @param key - The cache key
   * @param factory - Function to compute the value if not found
   * @param ttl - Time-to-live in milliseconds
   * @returns The cached or computed value
   */
  async getOrSet(key: string, factory: () => Promise<T>, ttl = 60000): Promise<T> {
    const cached = this.get(key)

    if (cached !== undefined) {
      return cached
    }

    const value = await factory()
    this.set(key, value, ttl)
    return value
  }
}

// Create global cache instances
export const apiCache = new Cache<any>()
export const imageCache = new Cache<string>()
