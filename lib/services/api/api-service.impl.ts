import type { ApiService } from "./api-service.interface"
import { ErrorFactory } from "@/lib/errors/factory"

/**
 * Implementation of the API service
 */
export class ApiServiceImpl implements ApiService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  /**
   * Fetch data from an API endpoint
   */
  async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const url = this.buildUrl(endpoint)
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      })

      if (!response.ok) {
        throw ErrorFactory.createApiError(`API request failed with status ${response.status}`, response.status, {
          endpoint,
          method: options?.method || "GET",
        })
      }

      return await response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorFactory.createApiError(
          `API request failed: ${error.message}`,
          500,
          { endpoint, method: options?.method || "GET" },
          error,
        )
      }
      throw error
    }
  }

  /**
   * Post data to an API endpoint
   */
  async post<T, R>(endpoint: string, data: T, options?: RequestInit): Promise<R> {
    return this.fetch<R>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  /**
   * Put data to an API endpoint
   */
  async put<T, R>(endpoint: string, data: T, options?: RequestInit): Promise<R> {
    return this.fetch<R>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  /**
   * Delete a resource at an API endpoint
   */
  async delete<R>(endpoint: string, options?: RequestInit): Promise<R> {
    return this.fetch<R>(endpoint, {
      ...options,
      method: "DELETE",
    })
  }

  /**
   * Build a URL from an endpoint
   */
  private buildUrl(endpoint: string): string {
    // Remove leading slash if present
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint
    return `${this.baseUrl}/${cleanEndpoint}`
  }
}
