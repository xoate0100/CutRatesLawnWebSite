"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

export function MarketingChrome({ children }: { children: ReactNode }) {
  const path = usePathname()
  if (path?.startsWith("/lp")) return null
  return <>{children}</>
}
