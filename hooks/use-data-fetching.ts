"use client"

import { useState, useEffect, useCallback } from "react"
import { handleError } from "@/lib/error-handling"
import { ErrorSeverity } from "@/lib/error-handling"

interface FetchOptions<T> {
  initialData?: T
  fallbackData?: T
  dependencies?: any[]
  onSuccess?: (data: T) => void
  onError?: (error: unknown) => void
  errorMessage?: string
  retry?: boolean
  maxRetries?: number
  retryDelay?: number
}

/**
 * Generic data fetching hook with error handling
 */
export function useDataFetching<T>(fetchFn: () => Promise<T>, options: FetchOptions<T> = {}) {
  const [data, setData] = useState<T | undefined>(options.initialData)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<unknown>(null)
  const [retryCount, setRetryCount] = useState<number>(0)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await fetchFn()
      setData(result)

      if (options.onSuccess) {
        options.onSuccess(result)
      }
    } catch (err) {
      const errorMessage = options.errorMessage || "Failed to fetch data"

      // Handle the error with our error handling system
      const fallbackResult = await handleError<T>(err, errorMessage, {
        severity: ErrorSeverity.MEDIUM,
        retry: options.retry,
        maxRetries: options.maxRetries,
        retryDelay: options.retryDelay,
        fallback: options.fallbackData,
        asyncFn: fetchFn,
        context: { hook: "useDataFetching" },
      })

      // Update state with error
      setError(err)

      // Use fallback data if available
      if (fallbackResult !== undefined) {
        setData(fallbackResult)
      }

      // Call onError callback if provided
      if (options.onError) {
        options.onError(err)
      }
    } finally {
      setIsLoading(false)
    }
  }, [
    fetchFn,
    options.retry,
    options.maxRetries,
    options.retryDelay,
    options.fallbackData,
    options.onSuccess,
    options.onError,
    options.errorMessage,
  ])

  // Function to manually retry the fetch
  const refetch = useCallback(() => {
    setRetryCount((prev) => prev + 1)
    return fetchData()
  }, [fetchData])

  useEffect(() => {
    fetchData()
  }, [...(options.dependencies || []), retryCount])

  return {
    data,
    isLoading,
    error,
    refetch,
  }
}
