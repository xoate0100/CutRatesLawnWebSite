"use client"

import type { ReactNode } from "react"
import { trackPhoneClick } from "@/lib/analytics/core"

export function AnalyticsPhoneLink({
  href,
  location,
  className,
  children,
}: {
  href: string
  location: string
  className?: string
  children: ReactNode
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => trackPhoneClick(location)}
    >
      {children}
    </a>
  )
}
