import type { AttributionParams } from "./types"

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
    google_tag_manager?: unknown
  }
}

export function getUtmParams(): AttributionParams {
  if (typeof window === "undefined") return {}
  const searchParams = new URLSearchParams(window.location.search)
  return {
    utm_source: searchParams.get("utm_source") || undefined,
    utm_medium: searchParams.get("utm_medium") || undefined,
    utm_campaign: searchParams.get("utm_campaign") || undefined,
    utm_term: searchParams.get("utm_term") || undefined,
    utm_content: searchParams.get("utm_content") || undefined,
  }
}

export function getGclid(): string | undefined {
  if (typeof window === "undefined") return undefined
  return new URLSearchParams(window.location.search).get("gclid") || undefined
}

export function storeUtmParams(): void {
  if (typeof window === "undefined") return
  const utmParams = getUtmParams()
  if (utmParams.utm_source) {
    sessionStorage.setItem("utm_params", JSON.stringify(utmParams))
  }
}

export function storeGclid(): void {
  if (typeof window === "undefined") return
  const gclid = getGclid()
  if (gclid) sessionStorage.setItem("gclid", gclid)
}

/** Capture UTM and gclid from URL on first page load of paid journey. */
export function storePaidClickParams(): void {
  storeUtmParams()
  storeGclid()
}

export function getStoredUtmParams(): AttributionParams {
  if (typeof window === "undefined") return {}
  const stored = sessionStorage.getItem("utm_params")
  if (!stored) return {}
  try {
    return JSON.parse(stored) as AttributionParams
  } catch {
    return {}
  }
}

export function getStoredGclid(): string | undefined {
  if (typeof window === "undefined") return undefined
  return sessionStorage.getItem("gclid") || undefined
}

export function getStoredAttribution(): AttributionParams {
  const utm = getStoredUtmParams()
  const gclid = getStoredGclid()
  return { ...utm, ...(gclid ? { gclid } : {}) }
}

export function isGTMLoaded(): boolean {
  if (typeof window === "undefined") return false
  return Boolean(window.dataLayer && window.google_tag_manager)
}

export function waitForGTM(callback: () => void, maxWaitMs = 5000): void {
  if (typeof window === "undefined") return
  const startTime = Date.now()
  const check = () => {
    if (isGTMLoaded()) callback()
    else if (Date.now() - startTime < maxWaitMs) setTimeout(check, 100)
    else callback()
  }
  check()
}

export function gtmEvent(eventName: string, eventData?: Record<string, unknown>): void {
  if (typeof window === "undefined") return
  const fire = () => {
    const dl = (window.dataLayer = window.dataLayer || [])
    if (eventData && Object.keys(eventData).length > 0) dl.push(eventData)
    setTimeout(() => dl.push({ event: eventName }), 50)
  }
  waitForGTM(fire)
}
