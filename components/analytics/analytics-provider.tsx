"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { initAnalyticsCapture, trackPageView } from "@/lib/analytics/core"

/** Initializes attribution capture + page_view on route changes. */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    initAnalyticsCapture()
  }, [])

  useEffect(() => {
    trackPageView()
  }, [pathname, searchParams])

  return <>{children}</>
}
