"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { ReviewsProvider } from "@/contexts/reviews-context"
import { AuthProvider } from "@/contexts/auth-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <AuthProvider>
        <ReviewsProvider>{children}</ReviewsProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
