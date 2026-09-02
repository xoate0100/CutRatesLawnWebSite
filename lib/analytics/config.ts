/**
 * Env-gated analytics platform IDs. Unset → no-op silently.
 */
function readEnv(key: string): string | undefined {
  const v = process.env[key]
  if (!v || !v.trim()) return undefined
  return v.trim()
}

export const analyticsConfig = {
  gtmContainerId: readEnv("NEXT_PUBLIC_GTM_CONTAINER_ID"),
  ga4MeasurementId: readEnv("NEXT_PUBLIC_GA4_MEASUREMENT_ID"),
  googleAdsConversionId: readEnv("NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID"),
  googleAdsConversionLabel: readEnv("NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL"),
  metaPixelId: readEnv("NEXT_PUBLIC_META_PIXEL_ID"),
} as const

export function isAnalyticsEnabled(): boolean {
  return Boolean(analyticsConfig.gtmContainerId)
}

export function configuredDestinations(): Record<string, string | undefined> {
  return {
    ga4: analyticsConfig.ga4MeasurementId,
    google_ads: analyticsConfig.googleAdsConversionId,
    meta_pixel: analyticsConfig.metaPixelId,
  }
}

/** Server-side weekly report credentials (never exposed to client). */
export const reportConfig = {
  ga4PropertyId: readEnv("GA4_PROPERTY_ID"),
  credentialsJson: readEnv("GA4_DATA_API_CREDENTIALS_JSON"),
  emailTo: readEnv("WEEKLY_REPORT_EMAIL_TO"),
  emailFrom: readEnv("WEEKLY_REPORT_EMAIL_FROM"),
  smtpHost: readEnv("SMTP_HOST"),
  smtpPort: readEnv("SMTP_PORT"),
  smtpUser: readEnv("SMTP_USER"),
  smtpPass: readEnv("SMTP_PASS"),
  monthlyLineItemUsd: 449,
} as const

export const HUMAN_SETUP_CALLOUT =
  "HUMAN SETUP: Set GA4_PROPERTY_ID and GA4_DATA_API_CREDENTIALS_JSON (service account JSON with Analytics Data API read access on the GA4 property) to enable the weekly report."
