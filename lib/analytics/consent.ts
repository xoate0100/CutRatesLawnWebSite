export type ConsentState = {
  analytics: boolean
  ads: boolean
  updatedAt: number
}

const KEY = "cro_consent_v1"
export const CONSENT_COOKIE = "cro_consent"

export const DEFAULT_CONSENT: ConsentState = {
  analytics: false,
  ads: false,
  updatedAt: 0,
}

export function readConsent(): ConsentState {
  if (typeof window === "undefined") return DEFAULT_CONSENT
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULT_CONSENT
    const parsed = JSON.parse(raw) as Partial<ConsentState>
    return {
      analytics: Boolean(parsed.analytics),
      ads: Boolean(parsed.ads),
      updatedAt: Number(parsed.updatedAt) || 0,
    }
  } catch {
    return DEFAULT_CONSENT
  }
}

export function hasChosenConsent(): boolean {
  return readConsent().updatedAt > 0
}

export function writeConsent(next: Pick<ConsentState, "analytics" | "ads">): ConsentState {
  const state: ConsentState = { ...next, updatedAt: Date.now() }
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(state))
    document.cookie = `${CONSENT_COOKIE}=${state.analytics ? "a1" : "a0"}${state.ads ? "d1" : "d0"};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`
  }
  pushConsentToDataLayer(state)
  return state
}

export function pushConsentToDataLayer(state: ConsentState): void {
  if (typeof window === "undefined") return
  const dl = (window.dataLayer = window.dataLayer || [])
  dl.push({
    event: "consent_update",
    analytics_storage: state.analytics ? "granted" : "denied",
    ad_storage: state.ads ? "granted" : "denied",
  })
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
  if (typeof gtag === "function") {
    gtag("consent", "update", {
      analytics_storage: state.analytics ? "granted" : "denied",
      ad_storage: state.ads ? "granted" : "denied",
      ad_user_data: state.ads ? "granted" : "denied",
      ad_personalization: state.ads ? "granted" : "denied",
    })
  }
}

/** Marketing destinations (Ads/Meta) wait for ads consent. First-party dataLayer always allowed. */
export function allowMarketingTags(): boolean {
  return readConsent().ads
}
