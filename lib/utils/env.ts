/**
 * Safely get an environment variable with a fallback value
 */
export function getEnv(key: string, fallback = ""): string {
  // Check server-side environment variables
  if (typeof process !== "undefined" && process.env) {
    return process.env[key] || fallback
  }

  // Check client-side environment variables (Next.js public variables)
  if (typeof window !== "undefined") {
    // @ts-ignore - Custom property
    const env = window.__ENV__ || {}
    if (env[key]) {
      return env[key]
    }

    // Check for Next.js public variables
    // @ts-ignore - Next.js adds this to window
    if (window.__NEXT_DATA__?.props?.pageProps?.env?.[key]) {
      // @ts-ignore - Next.js adds this to window
      return window.__NEXT_DATA__.props.pageProps.env[key]
    }
  }

  return fallback
}

/**
 * Get the Strapi API URL
 */
export function getStrapiApiUrl(): string {
  return getEnv("STRAPI_API_URL", "http://localhost:1337")
}

/**
 * Get the Strapi API token
 */
export function getStrapiApiToken(): string {
  return getEnv("STRAPI_API_TOKEN", "")
}

/**
 * Check if we're in development mode
 */
export function isDevelopment(): boolean {
  return getEnv("NODE_ENV", "development") === "development"
}

export const ENV = {
  STRAPI_API_URL: getStrapiApiUrl(),
  STRAPI_API_TOKEN: getStrapiApiToken(),
  NODE_ENV: getEnv("NODE_ENV", "development"),
  IS_DEVELOPMENT: isDevelopment(),
}

export function isProduction(): boolean {
  return getEnv("NODE_ENV", "development") === "production"
}
