export type TrafficType = "paid" | "organic" | "direct" | "referral" | "internal" | "unknown"

export type TrafficInput = {
  gclid?: string
  gbraid?: string
  wbraid?: string
  fbclid?: string
  msclkid?: string
  utm_source?: string
  utm_medium?: string
  referrer?: string
  pageHost?: string
}

const PAID_MEDIUMS = new Set(["cpc", "ppc", "paid", "paidsearch", "display", "cpm", "cpv", "sms"])
const SEARCH_HOST = /google\.|bing\.|yahoo\.|duckduckgo\.|baidu\.|ecosia\.|brave\.com/i
const SEARCH_SOURCES = new Set(["google", "bing", "yahoo", "duckduckgo", "baidu"])

function hostOf(value: string | undefined): string {
  if (!value) return ""
  try {
    return new URL(value).hostname.replace(/^www\./, "").toLowerCase()
  } catch {
    return ""
  }
}

export function classifyTraffic(input: TrafficInput): TrafficType {
  if (input.gclid || input.gbraid || input.wbraid || input.fbclid || input.msclkid) {
    return "paid"
  }
  const medium = (input.utm_medium || "").trim().toLowerCase()
  const source = (input.utm_source || "").trim().toLowerCase()
  if (PAID_MEDIUMS.has(medium)) return "paid"
  if (source) {
    if (SEARCH_SOURCES.has(source) && (!medium || medium === "organic")) return "organic"
    if (medium === "organic") return "organic"
    if (medium === "email" || medium === "referral" || medium === "social") return "referral"
    return "referral"
  }
  const ref = (input.referrer || "").trim()
  if (!ref) return "direct"
  const refHost = hostOf(ref)
  const pageHost = (input.pageHost || "").replace(/^www\./, "").toLowerCase()
  if (refHost && pageHost && refHost === pageHost) return "internal"
  if (SEARCH_HOST.test(refHost) || SEARCH_HOST.test(ref)) return "organic"
  if (refHost) return "referral"
  return "unknown"
}
