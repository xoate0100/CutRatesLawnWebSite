import { getEnv } from "./env-check"

/**
 * Application configuration
 */
export const config = {
  // API configuration
  api: {
    url: getEnv("STRAPI_API_URL", "http://localhost:1337"),
    token: getEnv("STRAPI_API_TOKEN", ""),
    publicUrl: getEnv("NEXT_PUBLIC_STRAPI_API_URL", getEnv("STRAPI_API_URL", "http://localhost:1337")),
    timeout: 10000, // 10 seconds
    retries: 3,
  },

  // Feature flags
  features: {
    enableDevTools: process.env.NODE_ENV === "development",
    enableCache: true,
    enableOfflineMode: false,
  },

  // Content configuration
  content: {
    pageSize: 10,
    imageSizes: {
      thumbnail: { width: 100, height: 100 },
      small: { width: 300, height: 200 },
      medium: { width: 600, height: 400 },
      large: { width: 1200, height: 800 },
    },
  },

  // SEO configuration
  seo: {
    defaultTitle: "CutRatesLawn - Professional Lawn Care Services",
    defaultDescription: "Professional lawn care services at competitive rates. Serving the local community since 2010.",
    defaultKeywords: "lawn care, lawn mowing, hedge trimming, fertilization, weed control",
    defaultOgImage: "/images/og-image.jpg",
  },
}

/**
 * Gets a configuration value by path
 * @param path - The path to the configuration value (dot notation)
 * @param defaultValue - Default value if the configuration value doesn't exist
 * @returns The configuration value or default value
 */
export function getConfig<T>(path: string, defaultValue: T): T {
  const keys = path.split(".")
  let result: any = config

  for (const key of keys) {
    if (result === undefined || result === null) {
      return defaultValue
    }
    result = result[key]
  }

  return result === undefined || result === null ? defaultValue : (result as T)
}
