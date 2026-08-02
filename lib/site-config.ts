/**
 * Central site configuration from environment variables.
 * Defaults match the placeholder content baked into the v0 scaffold.
 */
function trimTrailingSlash(url: string): string {
  return url.replace(/\/$/, "")
}

const siteUrl = trimTrailingSlash(
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
)

export const siteConfig = {
  url: siteUrl,
  name: process.env.NEXT_PUBLIC_BUSINESS_NAME ?? "Cut Rates Lawn Care",
  phone: {
    e164: process.env.NEXT_PUBLIC_BUSINESS_PHONE_E164 ?? "+13169255050",
    display: process.env.NEXT_PUBLIC_BUSINESS_PHONE_DISPLAY ?? "(316) 925-5050",
  },
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL ?? "info@cutrateslawn.com",
  address: {
    line1: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS_LINE1 ?? "226 W. Main Street Suite 1",
    cityStateZip:
      process.env.NEXT_PUBLIC_BUSINESS_ADDRESS_CITY_STATE_ZIP ?? "Valley Center, KS 67147",
    full: [
      process.env.NEXT_PUBLIC_BUSINESS_ADDRESS_LINE1 ?? "226 W. Main Street Suite 1",
      process.env.NEXT_PUBLIC_BUSINESS_ADDRESS_CITY_STATE_ZIP ?? "Valley Center, KS 67147",
    ].join(", "),
    mapsQuery: encodeURIComponent(
      [
        process.env.NEXT_PUBLIC_BUSINESS_ADDRESS_LINE1 ?? "226 W. Main Street Suite 1",
        process.env.NEXT_PUBLIC_BUSINESS_ADDRESS_CITY_STATE_ZIP ?? "Valley Center, KS 67147",
      ].join(", "),
    ),
  },
  customerPortalUrl:
    process.env.NEXT_PUBLIC_CUSTOMER_PORTAL_URL ??
    "https://cutrateslawn.fieldportals.com/landing/index",
  twitterHandle: process.env.NEXT_PUBLIC_TWITTER_HANDLE ?? "@cutratelawn",
} as const
