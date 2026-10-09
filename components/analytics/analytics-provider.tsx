"use client"

import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { initAnalyticsCapture, trackPageView } from "@/lib/analytics/core"

/**
 * Side-effect-only: do NOT wrap page trees.
 * Wrapping children inside Suspense(useSearchParams) emptied SSR HTML sitewide.
 */
export function AnalyticsProvider() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const lastKey = useRef("")

  useEffect(() => {
    initAnalyticsCapture()
  }, [])

  useEffect(() => {
    const key = `${pathname}?${searchParams?.toString() || ""}`
    if (lastKey.current === key) return
    lastKey.current = key
    trackPageView()
  }, [pathname, searchParams])

  return null
}
