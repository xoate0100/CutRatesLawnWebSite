"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { ReviewsProvider } from "@/contexts/reviews-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <ReviewsProvider>{children}</ReviewsProvider>
    </ThemeProvider>
  )
}
