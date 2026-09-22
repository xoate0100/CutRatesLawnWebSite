/** Conformance + runtime shared attribution keys (mined from CRL gtm.ts). */
export const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
] as const

export const CLICK_ID_KEYS = ["gclid", "gbraid", "wbraid", "fbclid", "msclkid"] as const

export const TOUCH_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "msclkid",
  "landing_page",
  "referrer",
  "first_seen_at",
] as const

export type AttributionParams = Partial<Record<(typeof ATTRIBUTION_KEYS)[number], string>>
export type TouchParams = Partial<Record<(typeof TOUCH_KEYS)[number], string>>

export interface BaseAnalyticsEvent {
  event: string
  timestamp?: number
  page_path: string
  page_title?: string
  page_location?: string
  session_id?: string
  device_type?: "desktop" | "mobile" | "tablet"
  traffic_type?: "paid" | "organic" | "direct" | "referral" | "internal" | "unknown"
  experiment_variant?: string
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
  service_id?: string
  area_slug?: string
}

export interface FormStartEvent extends BaseAnalyticsEvent {
  event: "form_start"
  form_id: string
}

export interface FormFieldEngageEvent extends BaseAnalyticsEvent {
  event: "form_field_engage"
  form_id: string
  field_name: string
}

export interface FormStepCompleteEvent extends BaseAnalyticsEvent {
  event: "form_step_complete"
  form_id: string
  step_name: string
  step_number: number
}

export interface FormAbandonEvent extends BaseAnalyticsEvent {
  event: "form_abandon"
  form_id: string
  last_step?: string
  last_field?: string
}

export interface PartialFormFillEvent extends BaseAnalyticsEvent {
  event: "partial_form_fill"
  form_id: string
  last_step?: string
}

export interface FormErrorEvent extends BaseAnalyticsEvent {
  event: "form_error"
  form_id: string
  field_name: string
  error_type: string
}

export type AnalyticsEvent =
  | PageViewEvent
  | ServiceViewEvent
  | AreaViewEvent
  | FunnelStepViewEvent
  | PhoneClickEvent
  | ConversionLeadEvent
  | FormStartEvent
  | FormFieldEngageEvent
  | FormStepCompleteEvent
  | FormAbandonEvent
  | PartialFormFillEvent
  | FormErrorEvent

export const CONVERSION_EVENTS = new Set(["conversion_lead", "lead_conversion", "conversion"])
export const MARKETING_EVENTS = new Set(["conversion_lead", "lead_conversion", "conversion"])

/** Runtime never drops conversions for missing UTM/gclid (F-CRO-101). Vendor suite may still require attribution. */
export const CONVERSION_GATED_ON_ATTRIBUTION = false

export const DATALAYER_CONTRACT_FIELDS = [
  "event",
  "page_path",
  "timestamp",
  "traffic_type",
  "session_id",
] as const
