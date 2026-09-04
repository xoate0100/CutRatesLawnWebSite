import {
  analyticsConfig,
  configuredDestinations,
  isAnalyticsEnabled,
} from "./config"
import {
  getStoredAttribution,
  getUtmParams,
  gtmEvent,
  storePaidClickParams,
} from "./gtm"
import {
  ATTRIBUTION_KEYS,
  CONVERSION_EVENTS,
  type AnalyticsEvent,
  type AttributionParams,
} from "./types"

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

function hasAttribution(attribution: AttributionParams): boolean {
  return Boolean(attribution.utm_source || attribution.gclid)
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

/** Runtime emit — validates, enriches, pushes to dataLayer. No-op when GTM unset. */
export function pushAnalyticsEvent(event: AnalyticsEvent): boolean {
  if (typeof window === "undefined") return false
  if (!isAnalyticsEnabled()) return false

  if (!event.event || !event.page_path) return false

  const stored = getStoredAttribution()
  const url = getUtmParams()
  const attribution = mergeAttribution(event as Record<string, unknown>, stored, url)

  if (CONVERSION_EVENTS.has(event.event) && !hasAttribution(attribution)) {
    return false
  }

  const enriched = {
    ...event,
    timestamp: event.timestamp ?? Date.now(),
    page_title: event.page_title ?? document.title,
    page_location: event.page_location ?? window.location.href,
    session_id: event.session_id ?? sessionId(),
    device_type: event.device_type ?? getDeviceType(),
    ...Object.fromEntries(Object.entries(attribution).filter(([, v]) => v)),
    destinations_configured: notifyDestinations(),
  }

  gtmEvent(event.event, enriched)
  return true
}

export function initAnalyticsCapture(): void {
  if (typeof window === "undefined") return
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
}): void {
  if (typeof window === "undefined") return
  pushAnalyticsEvent({
    event: "conversion_lead",
    page_path: window.location.pathname,
    transaction_id: params.transactionId,
    conversion_value: params.conversionValue,
    currency: params.currency ?? "USD",
  })
}

export { analyticsConfig, isAnalyticsEnabled }
