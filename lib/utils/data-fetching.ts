import { ErrorFactory } from "@/lib/errors/factory"

/**
 * Options for fetching data
 */
interface FetchOptions extends RequestInit {
  baseUrl?: string
  timeout?: number
}

/**
 * Fetch data with timeout and error handling
 */
export async function fetchWithTimeout<T>(url: string, options: FetchOptions = {}): Promise<T> {
  const { baseUrl, timeout = 10000, ...fetchOptions } = options

  const fullUrl = baseUrl ? `${baseUrl}/${url.replace(/^\//, "")}` : url

  // Create an abort controller for the timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(fullUrl, {
      ...fetchOptions,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw ErrorFactory.createApiError(`API request failed with status ${response.status}`, response.status, {
        url: fullUrl,
        method: fetchOptions.method || "GET",
      })
    }

    return await response.json()
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof DOMException && error.name === "AbortError") {
      throw ErrorFactory.createApiError(`API request timed out after ${timeout}ms`, 408, {
        url: fullUrl,
        method: fetchOptions.method || "GET",
        timeout,
      })
    }

    if (error instanceof Error) {
      throw ErrorFactory.createApiError(
        `API request failed: ${error.message}`,
        500,
        { url: fullUrl, method: fetchOptions.method || "GET" },
        error,
      )
    }

    throw error
  }
}
