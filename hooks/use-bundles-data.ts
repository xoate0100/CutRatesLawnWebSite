"use client"

import { useState, useEffect } from "react"
import { getAllBundles, getBundleBySlug } from "@/lib/api"
import type { BundleType } from "@/lib/api"

export function useBundlesData() {
  const [bundles, setBundles] = useState<BundleType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchBundles() {
      try {
        setLoading(true)
        const data = await getAllBundles()
        setBundles(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching bundles:", err)
        setError(err instanceof Error ? err : new Error("Failed to fetch bundles"))
      } finally {
        setLoading(false)
      }
    }

    fetchBundles()
  }, [])

  return { bundles, loading, error }
}

export function useBundleData(slug: string) {
  const [bundle, setBundle] = useState<BundleType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchBundle() {
      if (!slug) return

      try {
        setLoading(true)
        const data = await getBundleBySlug(slug)
        setBundle(data)
        setError(null)
      } catch (err) {
        console.error(`Error fetching bundle with slug ${slug}:`, err)
        setError(err instanceof Error ? err : new Error("Failed to fetch bundle"))
      } finally {
        setLoading(false)
      }
    }

    fetchBundle()
  }, [slug])

  return { bundle, loading, error }
}
