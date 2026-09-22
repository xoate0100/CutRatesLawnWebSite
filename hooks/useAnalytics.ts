import { useCallback, useMemo } from "react"
import {
  trackAreaView,
  trackConversionLead,
  trackFormAbandon,
  trackFormError,
  trackFormFieldEngage,
  trackFormStart,
  trackFormStepComplete,
  trackFunnelStep,
  trackPartialFormFill,
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
    (transactionId: string, conversionValue: number, currency = "USD", serviceId?: string, areaSlug?: string) => {
      trackConversionLead({ transactionId, conversionValue, currency, serviceId, areaSlug })
    },
    [],
  )

  const onFormStart = useCallback((formId: string) => trackFormStart(formId), [])
  const onFormFieldEngage = useCallback(
    (formId: string, fieldName: string) => trackFormFieldEngage(formId, fieldName),
    [],
  )
  const onFormStepComplete = useCallback(
    (formId: string, stepName: string, stepNumber: number) =>
      trackFormStepComplete(formId, stepName, stepNumber),
    [],
  )
  const onFormAbandon = useCallback(
    (formId: string, lastStep?: string, lastField?: string) => trackFormAbandon(formId, lastStep, lastField),
    [],
  )
  const onPartialFormFill = useCallback(
    (formId: string, lastStep?: string) => trackPartialFormFill(formId, lastStep),
    [],
  )
  const onFormError = useCallback(
    (formId: string, fieldName: string, errorType: string) => trackFormError(formId, fieldName, errorType),
    [],
  )

  return useMemo(
    () => ({
      onServiceView,
      onAreaView,
      onFunnelStep,
      onPhoneClick,
      onConversionLead,
      onFormStart,
      onFormFieldEngage,
      onFormStepComplete,
      onFormAbandon,
      onPartialFormFill,
      onFormError,
    }),
    [
      onServiceView,
      onAreaView,
      onFunnelStep,
      onPhoneClick,
      onConversionLead,
      onFormStart,
      onFormFieldEngage,
      onFormStepComplete,
      onFormAbandon,
      onPartialFormFill,
      onFormError,
    ],
  )
}
