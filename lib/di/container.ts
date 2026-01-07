/**
 * Simple dependency injection container
 */
export class Container {
  private services: Map<string, any> = new Map()
  private factories: Map<string, () => any> = new Map()

  /**
   * Register a service instance
   */
  register<T>(token: string, instance: T): void {
    this.services.set(token, instance)
  }

  /**
   * Register a factory function for lazy instantiation
   */
  registerFactory<T>(token: string, factory: () => T): void {
    this.factories.set(token, factory)
  }

  /**
   * Get a service by token
   */
  get<T>(token: string): T {
    // Check if we have an instance
    if (this.services.has(token)) {
      return this.services.get(token) as T
    }

    // Check if we have a factory
    if (this.factories.has(token)) {
      const factory = this.factories.get(token)!
      const instance = factory()
      this.services.set(token, instance)
      return instance as T
    }

    throw new Error(`Service not registered: ${token}`)
  }

  /**
   * Check if a service is registered
   */
  has(token: string): boolean {
    return this.services.has(token) || this.factories.has(token)
  }

  /**
   * Remove a service
   */
  remove(token: string): void {
    this.services.delete(token)
    this.factories.delete(token)
  }

  /**
   * Clear all services
   */
  clear(): void {
    this.services.clear()
    this.factories.clear()
  }
}

// Create a singleton container instance
export const container = new Container()
