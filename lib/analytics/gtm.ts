import type { TouchParams } from "./types"
import { allowMarketingTags, pushConsentToDataLayer, readConsent } from "./consent"
import { isAnalyticsEnabled } from "./config"

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
    google_tag_manager?: unknown
    gtag?: (...args: unknown[]) => void
  }
}

const FIRST_KEY = "cro_first_touch_v1"
const LAST_KEY = "cro_last_touch_v1"
const TTL_MS = 90 * 24 * 60 * 60 * 1000

function searchParams(): URLSearchParams {
  if (typeof window === "undefined") return new URLSearchParams()
  return new URLSearchParams(window.location.search)
}

function captureNow(): TouchParams {
  const sp = searchParams()
  const touch: TouchParams = {}
  const keys: Array<keyof TouchParams> = [
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
  ]
  for (const k of keys) {
    const v = sp.get(k)
    if (v) touch[k] = v
  }
  if (typeof window !== "undefined") {
    touch.landing_page = `${window.location.pathname}${window.location.search}`
    touch.referrer = document.referrer || undefined
    touch.first_seen_at = new Date().toISOString()
  }
  return touch
}

function hasTouchSignal(t: TouchParams): boolean {
  return Boolean(
    t.utm_source || t.gclid || t.gbraid || t.wbraid || t.fbclid || t.msclkid || t.referrer || t.landing_page,
  )
}

function readJson(storage: Storage, key: string): TouchParams | null {
  try {
    const raw = storage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw) as TouchParams & { _exp?: number }
    if (parsed._exp && Date.now() > parsed._exp) {
      storage.removeItem(key)
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function writeFirst(touch: TouchParams): void {
  if (typeof window === "undefined") return
  const existing = readJson(localStorage, FIRST_KEY)
  if (existing) return
  localStorage.setItem(FIRST_KEY, JSON.stringify({ ...touch, _exp: Date.now() + TTL_MS }))
}

function writeLast(touch: TouchParams): void {
  if (typeof window === "undefined") return
  sessionStorage.setItem(LAST_KEY, JSON.stringify(touch))
}

export function getUtmParams(): TouchParams {
  if (typeof window === "undefined") return {}
  const sp = searchParams()
  return {
    utm_source: sp.get("utm_source") || undefined,
    utm_medium: sp.get("utm_medium") || undefined,
    utm_campaign: sp.get("utm_campaign") || undefined,
    utm_term: sp.get("utm_term") || undefined,
    utm_content: sp.get("utm_content") || undefined,
  }
}

export function getGclid(): string | undefined {
  if (typeof window === "undefined") return undefined
  return searchParams().get("gclid") || undefined
}

export function storeUtmParams(): void {
  storePaidClickParams()
}

export function storeGclid(): void {
  storePaidClickParams()
}

/** Dual first-touch (localStorage 90d) + last-touch (session). */
export function storePaidClickParams(): void {
  if (typeof window === "undefined") return
  const touch = captureNow()
  if (hasTouchSignal(touch)) {
    writeFirst(touch)
    writeLast(touch)
  } else {
    writeFirst({
      landing_page: `${window.location.pathname}${window.location.search}`,
      referrer: document.referrer || undefined,
      first_seen_at: new Date().toISOString(),
    })
  }
}

export function getFirstTouch(): TouchParams {
  if (typeof window === "undefined") return {}
  return readJson(localStorage, FIRST_KEY) || {}
}

export function getLastTouch(): TouchParams {
  if (typeof window === "undefined") return {}
  return readJson(sessionStorage, LAST_KEY) || getUtmParams()
}

export function getStoredUtmParams(): TouchParams {
  const last = getLastTouch()
  const first = getFirstTouch()
  return { ...first, ...last }
}

export function getStoredGclid(): string | undefined {
  return getLastTouch().gclid || getFirstTouch().gclid
}

export function getStoredAttribution(): TouchParams {
  return { ...getFirstTouch(), ...getLastTouch() }
}

export function isGTMLoaded(): boolean {
  if (typeof window === "undefined") return false
  return Boolean(window.dataLayer && window.google_tag_manager)
}

export function waitForGTM(callback: () => void, maxWaitMs = 5000): void {
  if (typeof window === "undefined") return
  // No container in this env — first-party dataLayer must not wait 5s (thank-you bounce + e2e).
  if (!isAnalyticsEnabled() || isGTMLoaded()) {
    callback()
    return
  }
  const startTime = Date.now()
  const check = () => {
    if (isGTMLoaded()) callback()
    else if (Date.now() - startTime < maxWaitMs) setTimeout(check, 100)
    else callback()
  }
  check()
}

/**
 * First-party dataLayer always. Marketing tag *consumers* in GTM should honor Consent Mode.
 * We still push conversion events with zero UTMs (F-CRO-101).
 */
export function gtmEvent(eventName: string, eventData?: Record<string, unknown>): void {
  if (typeof window === "undefined") return
  const consent = readConsent()
  const fire = () => {
    const dl = (window.dataLayer = window.dataLayer || [])
    const payload = {
      ...(eventData || {}),
      analytics_consent: consent.analytics,
      ads_consent: consent.ads,
      marketing_tags_allowed: allowMarketingTags(),
    }
    if (Object.keys(payload).length > 0) dl.push(payload)
    setTimeout(() => dl.push({ event: eventName }), 50)
  }
  waitForGTM(fire)
}

export function initConsentDefaults(): void {
  if (typeof window === "undefined") return
  const dl = (window.dataLayer = window.dataLayer || [])
  // US opt-out: default granted; explicit opt-out updates via pushConsentToDataLayer.
  dl.push({
    event: "consent_default",
    analytics_storage: "granted",
    ad_storage: "granted",
  })
  const existing = readConsent()
  pushConsentToDataLayer(existing)
}
