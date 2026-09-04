/** Conformance + runtime shared attribution keys (mined from CRL gtm.ts). */
export const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
] as const

export type AttributionParams = Partial<Record<(typeof ATTRIBUTION_KEYS)[number], string>>

export interface BaseAnalyticsEvent {
  event: string
  timestamp?: number
  page_path: string
  page_title?: string
  page_location?: string
  session_id?: string
  device_type?: "desktop" | "mobile" | "tablet"
}

export interface PageViewEvent extends BaseAnalyticsEvent {
  event: "page_view"
}

export interface ServiceViewEvent extends BaseAnalyticsEvent {
  event: "service_view"
  service_id: string
  service_name: string
}

export interface AreaViewEvent extends BaseAnalyticsEvent {
  event: "area_view"
  area_slug: string
  area_name: string
}

export interface FunnelStepViewEvent extends BaseAnalyticsEvent {
  event: "funnel_step_view"
  funnel_id: string
  step_name: string
  step_number: number
}

export interface PhoneClickEvent extends BaseAnalyticsEvent {
  event: "phone_click"
  click_location: string
}

export interface ConversionLeadEvent extends BaseAnalyticsEvent {
  event: "conversion_lead"
  transaction_id: string
  conversion_value: number
  currency: string
}

export type AnalyticsEvent =
  | PageViewEvent
  | ServiceViewEvent
  | AreaViewEvent
  | FunnelStepViewEvent
  | PhoneClickEvent
  | ConversionLeadEvent

export const CONVERSION_EVENTS = new Set(["conversion_lead", "lead_conversion", "conversion"])
