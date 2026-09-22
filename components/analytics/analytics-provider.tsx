"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { initAnalyticsCapture, trackPageView } from "@/lib/analytics/core"

/**
 * Side-effect-only: do NOT wrap page trees.
 * Wrapping children inside Suspense(useSearchParams) emptied SSR HTML sitewide.
 */
export function AnalyticsProvider() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    initAnalyticsCapture()
  }, [])

  useEffect(() => {
    trackPageView()
  }, [pathname, searchParams])

  return null
}
