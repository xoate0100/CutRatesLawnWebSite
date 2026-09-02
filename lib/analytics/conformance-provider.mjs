/**
 * Conformance provider — mirrors Python AnalyticsTrackingImpl for offline suite execution.
 */
const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
]

const CONVERSION_EVENTS = new Set(["conversion_lead", "lead_conversion", "conversion"])

function mergeAttribution(event, stored, url) {
  const merged = {}
  for (const src of [stored || {}, url || {}]) {
    for (const k of ATTRIBUTION_KEYS) {
      if (src[k]) merged[k] = src[k]
    }
  }
  for (const k of ATTRIBUTION_KEYS) {
    if (event[k]) merged[k] = event[k]
  }
  return merged
}

function hasAttribution(attribution) {
  return Boolean(attribution.utm_source || attribution.gclid)
}

function notifyDestinations(destinations) {
  if (!destinations) return []
  const notified = []
  for (const key of ["ga4", "google_ads", "meta_pixel"]) {
    if (destinations[key]) notified.push(key)
  }
  return notified
}

export class AnalyticsTrackingProvider {
  run(caseInput) {
    const event = { ...(caseInput.event || {}) }
    if (!event.event || !event.page_path) {
      return { outcome: "reject", error_code: "EVENT_SCHEMA_INVALID" }
    }

    const name = String(event.event)
    const attribution = mergeAttribution(
      event,
      caseInput.stored_attribution,
      caseInput.url_attribution,
    )

    if (CONVERSION_EVENTS.has(name)) {
      if (!event.transaction_id) {
        return { outcome: "reject", error_code: "CONVERSION_ID_REQUIRED" }
      }
      if (event.conversion_value == null) {
        return { outcome: "reject", error_code: "CONVERSION_VALUE_REQUIRED" }
      }
      if (!hasAttribution(attribution)) {
        return { outcome: "reject", error_code: "ATTRIBUTION_REQUIRED" }
      }
    }

    const enriched = {
      ...event,
      ...Object.fromEntries(Object.entries(attribution).filter(([, v]) => v)),
    }
    if (!enriched.timestamp) enriched.timestamp = Date.now()

    return {
      outcome: "pass",
      datalayer_push: enriched,
      attribution_captured: hasAttribution(attribution),
      destinations_notified: notifyDestinations(caseInput.destinations),
    }
  }
}

export class BrokenAnalyticsTrackingProvider {
  run(caseInput) {
    const event = { ...(caseInput.event || {}) }
    if (!event.event || !event.page_path) {
      return { outcome: "reject", error_code: "EVENT_SCHEMA_INVALID" }
    }

    const name = String(event.event)
    if (CONVERSION_EVENTS.has(name)) {
      if (!event.transaction_id) {
        return { outcome: "reject", error_code: "CONVERSION_ID_REQUIRED" }
      }
      if (event.conversion_value == null) {
        return { outcome: "reject", error_code: "CONVERSION_VALUE_REQUIRED" }
      }
      return {
        outcome: "pass",
        datalayer_push: event,
        attribution_captured: false,
        destinations_notified: [],
      }
    }

    const attribution = mergeAttribution(
      event,
      caseInput.stored_attribution,
      caseInput.url_attribution,
    )
    const enriched = {
      ...event,
      ...Object.fromEntries(Object.entries(attribution).filter(([, v]) => v)),
    }
    return {
      outcome: "pass",
      datalayer_push: enriched,
      attribution_captured: hasAttribution(attribution),
      destinations_notified: notifyDestinations(caseInput.destinations),
    }
  }
}
