"use client"

import { useCallback } from "react"
import {
  trackAreaView,
  trackConversionLead,
  trackFunnelStep,
  trackPhoneClick,
  trackServiceView,
} from "@/lib/analytics/core"

export function useAnalytics() {
  const onServiceView = useCallback((serviceId: string, serviceName: string) => {
    trackServiceView(serviceId, serviceName)
  }, [])

  const onAreaView = useCallback((areaSlug: string, areaName: string) => {
    trackAreaView(areaSlug, areaName)
  }, [])

  const onFunnelStep = useCallback(
    (funnelId: string, stepName: string, stepNumber: number) => {
      trackFunnelStep(funnelId, stepName, stepNumber)
    },
    [],
  )

  const onPhoneClick = useCallback((location: string) => {
    trackPhoneClick(location)
  }, [])

  const onConversionLead = useCallback(
    (transactionId: string, conversionValue: number, currency = "USD") => {
      trackConversionLead({ transactionId, conversionValue, currency })
    },
    [],
  )

  return {
    onServiceView,
    onAreaView,
    onFunnelStep,
    onPhoneClick,
    onConversionLead,
  }
}
