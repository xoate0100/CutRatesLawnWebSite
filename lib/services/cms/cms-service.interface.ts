/**
 * Interface for CMS service
 */
export interface CMSService {
  /**
   * Get a single entry by ID
   */
  getEntry<T>(contentType: string, id: string): Promise<T>

  /**
   * Get multiple entries with optional filters
   */
  getEntries<T>(contentType: string, params?: Record<string, any>): Promise<T[]>

  /**
   * Create a new entry
   */
  createEntry<T>(contentType: string, data: Partial<T>): Promise<T>

  /**
   * Update an existing entry
   */
  updateEntry<T>(contentType: string, id: string, data: Partial<T>): Promise<T>

  /**
   * Delete an entry
   */
  deleteEntry(contentType: string, id: string): Promise<void>
}

/**
 * Service token for DI container
 */
export const CMS_SERVICE_TOKEN = "CMSService"
