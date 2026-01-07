"use client"

import { useState, useEffect } from "react"
import { getAllServices, getServiceBySlug } from "@/lib/api"
import type { ServiceType } from "@/lib/api"

export function useServicesData() {
  const [services, setServices] = useState<ServiceType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true)
        const data = await getAllServices()
        setServices(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching services:", err)
        setError(err instanceof Error ? err : new Error("Failed to fetch services"))
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  return { services, loading, error }
}

export function useServiceData(slug: string) {
  const [service, setService] = useState<ServiceType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchService() {
      if (!slug) return

      try {
        setLoading(true)
        const data = await getServiceBySlug(slug)
        setService(data)
        setError(null)
      } catch (err) {
        console.error(`Error fetching service with slug ${slug}:`, err)
        setError(err instanceof Error ? err : new Error("Failed to fetch service"))
      } finally {
        setLoading(false)
      }
    }

    fetchService()
  }, [slug])

  return { service, loading, error }
}
