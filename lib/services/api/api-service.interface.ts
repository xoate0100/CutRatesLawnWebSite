/**
 * Interface for API service
 */
export interface ApiService {
  /**
   * Fetch data from an API endpoint
   */
  fetch<T>(endpoint: string, options?: RequestInit): Promise<T>

  /**
   * Post data to an API endpoint
   */
  post<T, R>(endpoint: string, data: T, options?: RequestInit): Promise<R>

  /**
   * Put data to an API endpoint
   */
  put<T, R>(endpoint: string, data: T, options?: RequestInit): Promise<R>

  /**
   * Delete a resource at an API endpoint
   */
  delete<R>(endpoint: string, options?: RequestInit): Promise<R>
}

/**
 * Service token for DI container
 */
export const API_SERVICE_TOKEN = "ApiService"
