"use client"

import { useState, useEffect } from "react"
import { useService } from "@/lib/di/context"
import { type CMSService, CMS_SERVICE_TOKEN } from "@/lib/services/cms/cms-service.interface"
import { type LoggerService, LOGGER_SERVICE_TOKEN } from "@/lib/services/logger/logger-service.interface"

interface UseCMSDataOptions {
  contentType: string
  id?: string
  params?: Record<string, any>
}

interface UseCMSDataResult<T> {
  data: T | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

/**
 * Hook for fetching CMS data
 */
export function useCMSData<T>({ contentType, id, params }: UseCMSDataOptions): UseCMSDataResult<T> {
  const cmsService = useService<CMSService>(CMS_SERVICE_TOKEN)
  const logger = useService<LoggerService>(LOGGER_SERVICE_TOKEN)

  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      let result: T

      if (id) {
        // Fetch a single entry
        result = await cmsService.getEntry<T>(contentType, id)
      } else {
        // Fetch multiple entries
        result = (await cmsService.getEntries<T>(contentType, params)) as unknown as T
      }

      setData(result)
    } catch (err) {
      logger.error(`Error fetching CMS data for ${contentType}`, err)
      setError(err instanceof Error ? err : new Error("Unknown error"))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [contentType, id, JSON.stringify(params)])

  const refetch = async () => {
    await fetchData()
  }

  return { data, isLoading, error, refetch }
}
