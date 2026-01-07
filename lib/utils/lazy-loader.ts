/**
 * A utility for lazy-loading dependencies to avoid circular references
 */
export class LazyLoader<T> {
  private factory: () => T
  private instance: T | null = null

  constructor(factory: () => T) {
    this.factory = factory
  }

  /**
   * Get the instance, creating it if necessary
   */
  get(): T {
    if (!this.instance) {
      this.instance = this.factory()
    }

    return this.instance
  }

  /**
   * Reset the instance
   */
  reset(): void {
    this.instance = null
  }
}

/**
 * Create a lazy loader for a dependency
 */
export function createLazyLoader<T>(factory: () => T): LazyLoader<T> {
  return new LazyLoader<T>(factory)
}
