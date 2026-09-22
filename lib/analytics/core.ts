import {
  analyticsConfig,
  configuredDestinations,
  isAnalyticsEnabled,
} from "./config"
import {
  getFirstTouch,
  getLastTouch,
  getStoredAttribution,
  getUtmParams,
  gtmEvent,
  initConsentDefaults,
  storePaidClickParams,
} from "./gtm"
import { classifyTraffic } from "./traffic"
import {
  ATTRIBUTION_KEYS,
  CONVERSION_EVENTS,
  CONVERSION_GATED_ON_ATTRIBUTION,
  type AnalyticsEvent,
  type AttributionParams,
} from "./types"
import { experimentVariant } from "./experiment"

function mergeAttribution(
  event: Record<string, unknown>,
  stored: AttributionParams,
  url: AttributionParams,
): AttributionParams {
  const merged: AttributionParams = {}
  for (const src of [stored, url]) {
    for (const k of ATTRIBUTION_KEYS) {
      const v = src[k]
      if (v) merged[k] = v
    }
  }
  for (const k of ATTRIBUTION_KEYS) {
    const v = event[k] as string | undefined
    if (v) merged[k] = v
  }
  return merged
}

function notifyDestinations(): string[] {
  const dest = configuredDestinations()
  return (Object.entries(dest) as [string, string | undefined][])
    .filter(([, v]) => Boolean(v))
    .map(([k]) => k)
}

function getDeviceType(): "desktop" | "mobile" | "tablet" | undefined {
  if (typeof window === "undefined" || !window.navigator) return undefined
  const ua = window.navigator.userAgent.toLowerCase()
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "tablet"
  if (/mobile|android|ip(hone|od)|iemobile|blackberry|kindle|silk-accelerated|(hpw|web)os|opera m(obi|ini)/i.test(ua)) {
    return "mobile"
  }
  return "desktop"
}

function sessionId(): string | undefined {
  if (typeof window === "undefined") return undefined
  const key = "analytics_session_id"
  let id = sessionStorage.getItem(key)
  if (!id) {
    id = `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
    sessionStorage.setItem(key, id)
  }
  return id
}

/**
 * Runtime emit — always pushes first-party dataLayer (even with no GTM and no UTM).
 * GTM container load remains env-gated. Conversion events are NEVER dropped for missing attribution.
 */
export function pushAnalyticsEvent(event: AnalyticsEvent): boolean {
  if (typeof window === "undefined") return false
  if (!event.event || !event.page_path) return false

  const stored = getStoredAttribution()
  const url = getUtmParams()
  const attribution = mergeAttribution(event as unknown as Record<string, unknown>, stored, url)
  const last = getLastTouch()
  const first = getFirstTouch()
  const trafficType = classifyTraffic({
    gclid: last.gclid || first.gclid || attribution.gclid,
    gbraid: last.gbraid || first.gbraid,
    wbraid: last.wbraid || first.wbraid,
    fbclid: last.fbclid || first.fbclid,
    msclkid: last.msclkid || first.msclkid,
    utm_source: last.utm_source || first.utm_source || attribution.utm_source,
    utm_medium: last.utm_medium || first.utm_medium || attribution.utm_medium,
    referrer: last.referrer || first.referrer || document.referrer,
    pageHost: window.location.hostname,
  })

  const sid = event.session_id ?? sessionId()
  const enriched = {
    ...event,
    timestamp: event.timestamp ?? Date.now(),
    page_title: event.page_title ?? document.title,
    page_location: event.page_location ?? window.location.href,
    session_id: sid,
    device_type: event.device_type ?? getDeviceType(),
    traffic_type: event.traffic_type ?? trafficType,
    experiment_variant: event.experiment_variant ?? experimentVariant(sid),
    gtm_configured: isAnalyticsEnabled(),
    conversion_gated_on_attribution: CONVERSION_GATED_ON_ATTRIBUTION,
    ...Object.fromEntries(Object.entries(attribution).filter(([, v]) => v)),
    destinations_configured: notifyDestinations(),
  }

  if (CONVERSION_EVENTS.has(event.event) && !attribution.utm_source && !attribution.gclid) {
    Object.assign(enriched, { attribution_captured: false })
  }

  gtmEvent(event.event, enriched)
  return true
}

export function initAnalyticsCapture(): void {
  if (typeof window === "undefined") return
  initConsentDefaults()
  storePaidClickParams()
}

export function trackPageView(pageTitle?: string): void {
  if (typeof window === "undefined") return
  pushAnalyticsEvent({
    event: "page_view",
    page_path: window.location.pathname,
    page_title: pageTitle ?? document.title,
  })
}

export function trackServiceView(serviceId: string, serviceName: string): void {
  if (typeof window === "undefined") return
  pushAnalyticsEvent({
    event: "service_view",
    page_path: window.location.pathname,
    service_id: serviceId,
    service_name: serviceName,
  })
}

export function trackAreaView(areaSlug: string, areaName: string): void {
  if (typeof window === "undefined") return
  pushAnalyticsEvent({
    event: "area_view",
    page_path: window.location.pathname,
    area_slug: areaSlug,
    area_name: areaName,
  })
}

export function trackFunnelStep(
  funnelId: string,
  stepName: string,
  stepNumber: number,
): void {
  if (typeof window === "undefined") return
  pushAnalyticsEvent({
    event: "funnel_step_view",
    page_path: window.location.pathname,
    funnel_id: funnelId,
    step_name: stepName,
    step_number: stepNumber,
  })
}

export function trackPhoneClick(location: string): void {
  if (typeof window === "undefined") return
  pushAnalyticsEvent({
    event: "phone_click",
    page_path: window.location.pathname,
    click_location: location,
  })
}

export function trackConversionLead(params: {
  transactionId: string
  conversionValue: number
  currency?: string
  serviceId?: string
  areaSlug?: string
}): boolean {
  if (typeof window === "undefined") return false
  return pushAnalyticsEvent({
    event: "conversion_lead",
    page_path: window.location.pathname,
    transaction_id: params.transactionId,
    conversion_value: params.conversionValue,
    currency: params.currency ?? "USD",
    service_id: params.serviceId,
    area_slug: params.areaSlug,
  })
}

export function trackFormStart(formId: string): void {
  if (typeof window === "undefined") return
  pushAnalyticsEvent({ event: "form_start", page_path: window.location.pathname, form_id: formId })
}

export function trackFormFieldEngage(formId: string, fieldName: string): void {
  if (typeof window === "undefined") return
  pushAnalyticsEvent({
    event: "form_field_engage",
    page_path: window.location.pathname,
    form_id: formId,
    field_name: fieldName,
  })
}

export function trackFormStepComplete(formId: string, stepName: string, stepNumber: number): void {
  if (typeof window === "undefined") return
  pushAnalyticsEvent({
    event: "form_step_complete",
    page_path: window.location.pathname,
    form_id: formId,
    step_name: stepName,
    step_number: stepNumber,
  })
}

export function trackFormAbandon(formId: string, lastStep?: string, lastField?: string): void {
  if (typeof window === "undefined") return
  pushAnalyticsEvent({
    event: "form_abandon",
    page_path: window.location.pathname,
    form_id: formId,
    last_step: lastStep,
    last_field: lastField,
  })
}

export function trackPartialFormFill(formId: string, lastStep?: string): void {
  if (typeof window === "undefined") return
  pushAnalyticsEvent({
    event: "partial_form_fill",
    page_path: window.location.pathname,
    form_id: formId,
    last_step: lastStep,
  })
}

export function trackFormError(formId: string, fieldName: string, errorType: string): void {
  if (typeof window === "undefined") return
  pushAnalyticsEvent({
    event: "form_error",
    page_path: window.location.pathname,
    form_id: formId,
    field_name: fieldName,
    error_type: errorType,
  })
}

export function getAttributionPayload() {
  return {
    firstTouch: getFirstTouch(),
    lastTouch: getLastTouch(),
    sessionId: sessionId(),
    deviceType: getDeviceType(),
    pagePath: typeof window === "undefined" ? undefined : window.location.pathname,
  }
}

export { analyticsConfig, isAnalyticsEnabled }
