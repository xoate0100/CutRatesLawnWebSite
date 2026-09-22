"use client"

import type React from "react"
import { Suspense } from "react"

import { AnalyticsProvider } from "@/components/analytics/analytics-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { ReviewsProvider } from "@/contexts/reviews-context"
import { AuthProvider } from "@/contexts/auth-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <AuthProvider>
        <ReviewsProvider>
          {children}
          <Suspense fallback={null}>
            <AnalyticsProvider />
          </Suspense>
        </ReviewsProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
