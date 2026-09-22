/**
 * Env-gated analytics platform IDs. Unset → no-op silently.
 *
 * IMPORTANT: Next.js only inlines NEXT_PUBLIC_* into the client bundle when
 * accessed as a static property (process.env.NEXT_PUBLIC_FOO). Dynamic
 * process.env[key] stays empty in the browser even when Vercel has the var.
 */
function trim(v: string | undefined): string | undefined {
  if (!v || !v.trim()) return undefined
  return v.trim()
}

export const analyticsConfig = {
  gtmContainerId: trim(process.env.NEXT_PUBLIC_GTM_CONTAINER_ID),
  ga4MeasurementId: trim(process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID),
  googleAdsConversionId: trim(process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID),
  googleAdsConversionLabel: trim(process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL),
  metaPixelId: trim(process.env.NEXT_PUBLIC_META_PIXEL_ID),
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
  ga4PropertyId: trim(process.env.GA4_PROPERTY_ID),
  credentialsJson: trim(process.env.GA4_DATA_API_CREDENTIALS_JSON),
  emailTo: trim(process.env.WEEKLY_REPORT_EMAIL_TO),
  emailFrom: trim(process.env.WEEKLY_REPORT_EMAIL_FROM),
  smtpHost: trim(process.env.SMTP_HOST),
  smtpPort: trim(process.env.SMTP_PORT),
  smtpUser: trim(process.env.SMTP_USER),
  smtpPass: trim(process.env.SMTP_PASS),
  monthlyLineItemUsd: 449,
} as const

export const HUMAN_SETUP_CALLOUT =
  "HUMAN SETUP: Set GA4_PROPERTY_ID and GA4_DATA_API_CREDENTIALS_JSON (service account JSON with Analytics Data API read access on the GA4 property) to enable the weekly report."
