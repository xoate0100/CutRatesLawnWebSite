import { logDetailedError } from "./error-utils"

/**
 * Wraps an async function with error handling
 * @param fn - The async function to wrap
 * @param errorHandler - Optional custom error handler
 * @returns A wrapped function that handles errors
 */
export function withErrorHandling<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  errorHandler?: (error: any, ...args: Args) => T,
): (...args: Args) => Promise<T> {
  return async (...args: Args) => {
    try {
      return await fn(...args)
    } catch (error) {
      // Log the error
      logDetailedError(error, `Error in ${fn.name || "anonymous function"}`, { args })

      // Use custom error handler if provided, otherwise rethrow
      if (errorHandler) {
        return errorHandler(error, ...args)
      }
      throw error
    }
  }
}

/**
 * Creates a retry wrapper for async functions
 * @param fn - The async function to wrap
 * @param maxRetries - Maximum number of retries
 * @param delayMs - Delay between retries in milliseconds
 * @returns A wrapped function that retries on failure
 */
export function withRetry<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  maxRetries = 3,
  delayMs = 1000,
): (...args: Args) => Promise<T> {
  return async (...args: Args) => {
    let lastError: any

    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        return await fn(...args)
      } catch (error) {
        lastError = error

        // Log the retry attempt
        console.warn(`Attempt ${attempt}/${maxRetries + 1} failed for ${fn.name || "anonymous function"}:`, error)

        // If this was the last attempt, don't delay
        if (attempt <= maxRetries) {
          // Wait before retrying
          await new Promise((resolve) => setTimeout(resolve, delayMs))
        }
      }
    }

    // If we get here, all retries failed
    throw lastError
  }
}

/**
 * Creates a timeout wrapper for async functions
 * @param fn - The async function to wrap
 * @param timeoutMs - Timeout in milliseconds
 * @returns A wrapped function that times out after the specified duration
 */
export function withTimeout<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  timeoutMs = 5000,
): (...args: Args) => Promise<T> {
  return async (...args: Args) => {
    return Promise.race([
      fn(...args),
      new Promise<T>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Operation timed out after ${timeoutMs}ms`))
        }, timeoutMs)
      }),
    ])
  }
}

/**
 * Creates a cache wrapper for async functions
 * @param fn - The async function to wrap
 * @param ttlMs - Time-to-live for cache entries in milliseconds
 * @returns A wrapped function that caches results
 */
export function withCache<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  ttlMs = 60000,
): (...args: Args) => Promise<T> {
  const cache = new Map<string, { value: T; timestamp: number }>()

  return async (...args: Args) => {
    // Create a cache key from the function name and arguments
    const key = `${fn.name || "anonymous"}-${JSON.stringify(args)}`

    // Check if we have a valid cache entry
    const entry = cache.get(key)
    const now = Date.now()

    if (entry && now - entry.timestamp < ttlMs) {
      return entry.value
    }

    // Otherwise, call the function and cache the result
    const result = await fn(...args)
    cache.set(key, { value: result, timestamp: now })
    return result
  }
}
