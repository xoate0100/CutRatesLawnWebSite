"use client"

import { useEffect } from "react"
import { trackServiceView } from "@/lib/analytics/core"

export function ServiceViewTracker({
  serviceId,
  serviceName,
}: {
  serviceId: string
  serviceName: string
}) {
  useEffect(() => {
    trackServiceView(serviceId, serviceName)
  }, [serviceId, serviceName])
  return null
}
