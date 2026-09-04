"use client"

import { useEffect } from "react"
import { trackAreaView } from "@/lib/analytics/core"

export function AreaViewTracker({
  areaSlug,
  areaName,
}: {
  areaSlug: string
  areaName: string
}) {
  useEffect(() => {
    trackAreaView(areaSlug, areaName)
  }, [areaSlug, areaName])
  return null
}
