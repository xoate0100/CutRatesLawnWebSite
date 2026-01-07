import { getStrapiURL } from "./api"
import { apiCache } from "./cache"
import { logDetailedError } from "./error-utils"

/**
 * API request options
 */
export interface ApiRequestOptions extends RequestInit {
  /**
   * Cache time-to-live in milliseconds
   */
  cacheTtl?: number

  /**
   * Whether to bypass the cache
   */
  bypassCache?: boolean

  /**
   * Maximum number of retry attempts
   */
  maxRetries?: number

  /**
   * Delay between retry attempts in milliseconds
   */
  retryDelay?: number

  /**
   * Request timeout in milliseconds
   */
  timeout?: number
}

/**
 * Default API request options
 */
const DEFAULT_OPTIONS: ApiRequestOptions = {
  cacheTtl: 60000, // 1 minute
  bypassCache: false,
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  timeout: 10000, // 10 seconds
}

/**
 * Enhanced API client with retry logic and caching
 */
export class ApiClient {
  private baseUrl: string
  private token: string

  /**
   * Creates a new API client
   * @param baseUrl - The base URL for API requests
   * @param token - The API token
   */
  constructor(baseUrl: string = process.env.STRAPI_API_URL || "", token: string = process.env.STRAPI_API_TOKEN || "") {
    this.baseUrl = baseUrl
    this.token = token
  }

  /**
   * Sends a request to the API
   * @param path - The API path
   * @param options - Request options
   * @returns The API response
   */
  async request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
    // Merge options with defaults
    const mergedOptions: ApiRequestOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
        ...options.headers,
      },
    }

    // Generate cache key
    const cacheKey = `${path}-${JSON.stringify(mergedOptions)}`

    // Check cache if not bypassing
    if (!mergedOptions.bypassCache) {
      const cachedResponse = apiCache.get(cacheKey)
      if (cachedResponse) {
        return cachedResponse as T
      }
    }

    // Prepare for retries
    let lastError: Error | null = null
    const maxRetries = mergedOptions.maxRetries || 0

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Create URL
        const url = path.startsWith("http") ? path : getStrapiURL(path)

        // Create timeout promise
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new Error(`Request timed out after ${mergedOptions.timeout}ms`))
          }, mergedOptions.timeout)
        })

        // Send request with timeout
        const response = (await Promise.race([fetch(url, mergedOptions), timeoutPromise])) as Response

        // Handle non-OK responses
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`API request failed with status ${response.status}: ${errorText}`)
        }

        // Parse response
        const data = await response.json()

        // Cache response if not bypassing
        if (!mergedOptions.bypassCache) {
          apiCache.set(cacheKey, data, mergedOptions.cacheTtl)
        }

        return data as T
      } catch (error) {
        lastError = error as Error

        // Log retry attempt
        if (attempt < maxRetries) {
          console.warn(`API request to ${path} failed (attempt ${attempt + 1}/${maxRetries + 1}):`, error)

          // Wait before retrying
          await new Promise((resolve) => setTimeout(resolve, mergedOptions.retryDelay))
        }
      }
    }

    // If we get here, all attempts failed
    logDetailedError(`API request to ${path} failed after ${maxRetries + 1} attempts`, lastError as Error)
    throw lastError
  }

  /**
   * Sends a GET request to the API
   * @param path - The API path
   * @param options - Request options
   * @returns The API response
   */
  async get<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "GET",
    })
  }

  /**
   * Sends a POST request to the API
   * @param path - The API path
   * @param data - The request data
   * @param options - Request options
   * @returns The API response
   */
  async post<T>(path: string, data: any, options: ApiRequestOptions = {}): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  /**
   * Sends a PUT request to the API
   * @param path - The API path
   * @param data - The request data
   * @param options - Request options
   * @returns The API response
   */
  async put<T>(path: string, data: any, options: ApiRequestOptions = {}): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  /**
   * Sends a DELETE request to the API
   * @param path - The API path
   * @param options - Request options
   * @returns The API response
   */
  async delete<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "DELETE",
    })
  }

  /**
   * Clears the API cache
   */
  clearCache(): void {
    apiCache.clear()
  }
}

// Create a default API client instance
export const apiClient = new ApiClient()
