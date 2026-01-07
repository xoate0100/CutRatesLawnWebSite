import {
  getEndpoint,
  mapFieldName,
  transformData,
  validateSchema,
  initializeSchemaDiscovery,
  discoverStrapiSchema,
} from "./schema-discovery"
import { logDetailedError } from "./error-utils"
import { getFallbackData } from "./fallback-data"

// Initialize schema discovery when this module is imported
if (typeof window !== "undefined") {
  initializeSchemaDiscovery()
}

// API configuration
const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337"
const API_TOKEN = process.env.STRAPI_API_TOKEN || ""

// Request cache to avoid duplicate requests
const requestCache: Record<string, { data: any; timestamp: number }> = {}
const CACHE_DURATION = 60 * 1000 // 1 minute

/**
 * Get full API URL for a path
 */
export function getApiUrl(path = ""): string {
  return `${API_URL}${path}`
}

/**
 * Smart API fetch function with schema discovery, caching, and error handling
 */
export async function smartFetch<T>(
  contentType: string,
  options: {
    slug?: string
    filters?: Record<string, any>
    populate?: string | string[] | Record<string, any>
    pagination?: Record<string, any>
    sort?: string | string[]
    fields?: string[]
    publicationState?: "live" | "preview"
    locale?: string | string[]
    cacheKey?: string
    skipCache?: boolean
    method?: string
    body?: any
    headers?: Record<string, string>
    expectedFields?: string[]
    fallback?: T
    transform?: boolean
  } = {},
): Promise<T> {
  const {
    slug,
    filters = {},
    populate = "*",
    pagination,
    sort,
    fields,
    publicationState,
    locale,
    cacheKey,
    skipCache = false,
    method = "GET",
    body,
    headers = {},
    expectedFields,
    fallback,
    transform = true,
  } = options

  try {
    // Get the correct endpoint for this content type
    const endpoint = await getEndpoint(contentType)

    // Build query parameters
    const queryParams = new URLSearchParams()

    // Add slug filter if provided
    if (slug) {
      queryParams.append("filters[slug][$eq]", slug)
    }

    // Add other filters
    Object.entries(filters).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        Object.entries(value).forEach(([operator, operatorValue]) => {
          queryParams.append(`filters[${key}][${operator}]`, String(operatorValue))
        })
      } else {
        queryParams.append(`filters[${key}]`, String(value))
      }
    })

    // Add populate
    if (populate) {
      if (typeof populate === "string") {
        queryParams.append("populate", populate)
      } else if (Array.isArray(populate)) {
        populate.forEach((field) => {
          queryParams.append("populate", field)
        })
      } else {
        Object.entries(populate).forEach(([key, value]) => {
          queryParams.append(`populate[${key}]`, String(value))
        })
      }
    }

    // Add pagination
    if (pagination) {
      Object.entries(pagination).forEach(([key, value]) => {
        queryParams.append(`pagination[${key}]`, String(value))
      })
    }

    // Add sort
    if (sort) {
      if (Array.isArray(sort)) {
        sort.forEach((field) => {
          queryParams.append("sort", field)
        })
      } else {
        queryParams.append("sort", sort)
      }
    }

    // Add fields
    if (fields) {
      fields.forEach((field) => {
        // Map field name to backend field if needed
        const mappedField = mapFieldName(contentType, field)
        queryParams.append("fields", mappedField)
      })
    }

    // Add publication state
    if (publicationState) {
      queryParams.append("publicationState", publicationState)
    }

    // Add locale
    if (locale) {
      if (Array.isArray(locale)) {
        locale.forEach((loc) => {
          queryParams.append("locale", loc)
        })
      } else {
        queryParams.append("locale", locale)
      }
    }

    // Build full URL
    const queryString = queryParams.toString()
    const url = getApiUrl(`${endpoint}${queryString ? `?${queryString}` : ""}`)

    // Check cache if applicable
    const effectiveCacheKey = cacheKey || url
    if (
      !skipCache &&
      method === "GET" &&
      requestCache[effectiveCacheKey] &&
      Date.now() - requestCache[effectiveCacheKey].timestamp < CACHE_DURATION
    ) {
      console.log(`Using cached data for ${contentType}`)
      return requestCache[effectiveCacheKey].data
    }

    // Set up headers with authentication
    const requestHeaders: HeadersInit = {
      "Content-Type": "application/json",
      ...headers,
    }

    if (API_TOKEN) {
      requestHeaders["Authorization"] = `Bearer ${API_TOKEN}`
    }

    // Make the request
    console.log(`Fetching ${contentType} from ${url}`)
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    })

    // Handle non-OK responses
    if (!response.ok) {
      const errorMessage = `API request to ${endpoint} failed with status ${response.status}`
      throw new Error(errorMessage)
    }

    // Parse response
    let data = await response.json()

    // Transform data if requested
    if (transform) {
      data = transformData(contentType, data)
    }

    // Validate schema if expected fields provided
    if (expectedFields && process.env.NODE_ENV === "development") {
      const validation = validateSchema(contentType, expectedFields)
      if (!validation.valid) {
        console.warn(`Schema validation for ${contentType}:`, validation)
      }
    }

    // Cache the result for GET requests
    if (method === "GET") {
      requestCache[effectiveCacheKey] = {
        data,
        timestamp: Date.now(),
      }
    }

    return data as T
  } catch (error) {
    logDetailedError(`Error fetching ${contentType}`, error, {
      contentType,
      options,
    })

    // Return fallback data if provided
    if (fallback !== undefined) {
      console.log(`Using fallback data for ${contentType}`)
      return fallback
    }

    // Otherwise, get default fallback based on content type
    const defaultFallback = getFallbackForContentType(contentType, slug)
    return defaultFallback as T
  }
}

/**
 * Get appropriate fallback data for a content type
 */
function getFallbackForContentType(contentType: string, slug?: string): any {
  const fallbackData = getFallbackData()

  switch (contentType) {
    case "services":
      return slug
        ? { data: fallbackData.services.data.filter((s) => s.attributes.slug === slug) }
        : fallbackData.services

    case "bundles":
      return slug ? { data: fallbackData.bundles.data.filter((b) => b.attributes.slug === slug) } : fallbackData.bundles

    case "testimonials":
      return fallbackData.testimonials

    case "blogs":
      return { data: [] }

    case "faqs":
      return { data: [] }

    case "team":
      return { data: [] }

    default:
      return { data: [] }
  }
}

/**
 * Get all services with smart schema discovery
 */
export async function getAllServices() {
  return await smartFetch("services", {
    expectedFields: ["title", "slug", "description", "shortDescription", "price", "priceUnit", "coverImage", "icon"],
    fallback: getFallbackData().services,
  })
}

/**
 * Get service by slug with smart schema discovery
 */
export async function getServiceBySlug(slug: string) {
  return await smartFetch("services", {
    slug,
    expectedFields: ["title", "slug", "description", "shortDescription", "price", "priceUnit", "coverImage", "icon"],
    fallback: {
      data: getFallbackData().services.data.filter((s) => s.attributes.slug === slug),
    },
  })
}

/**
 * Get all bundles with smart schema discovery
 */
export async function getAllBundles() {
  return await smartFetch("bundles", {
    expectedFields: [
      "title",
      "slug",
      "description",
      "shortDescription",
      "price",
      "priceUnit",
      "coverImage",
      "services",
    ],
    fallback: getFallbackData().bundles,
  })
}

/**
 * Get bundle by slug with smart schema discovery
 */
export async function getBundleBySlug(slug: string) {
  return await smartFetch("bundles", {
    slug,
    expectedFields: [
      "title",
      "slug",
      "description",
      "shortDescription",
      "price",
      "priceUnit",
      "coverImage",
      "services",
    ],
    fallback: {
      data: getFallbackData().bundles.data.filter((b) => b.attributes.slug === slug),
    },
  })
}

/**
 * Get all testimonials with smart schema discovery
 */
export async function getAllTestimonials() {
  return await smartFetch("testimonials", {
    expectedFields: ["name", "text", "rating", "service", "image", "location"],
    fallback: getFallbackData().testimonials,
  })
}

/**
 * Get testimonials by service with smart schema discovery
 */
export async function getTestimonialsByService(serviceId?: string, serviceSlug?: string) {
  const filters: Record<string, any> = {}

  if (serviceId) {
    filters["service"] = { id: { $eq: serviceId } }
  } else if (serviceSlug) {
    filters["service"] = { slug: { $eq: serviceSlug } }
  }

  return await smartFetch("testimonials", {
    filters,
    expectedFields: ["name", "text", "rating", "service", "image", "location"],
    fallback: getFallbackData().testimonials,
  })
}

/**
 * Submit contact form with smart schema discovery
 */
export async function submitContactForm(data: any) {
  return await smartFetch("contact-submissions", {
    method: "POST",
    body: { data },
    skipCache: true,
    fallback: { success: true, message: "Form submitted successfully (offline mode)" },
  })
}

/**
 * Submit quote request with smart schema discovery
 */
export async function submitQuoteRequest(data: any) {
  return await smartFetch("quote-requests", {
    method: "POST",
    body: { data },
    skipCache: true,
    fallback: { success: true, message: "Quote request submitted successfully (offline mode)" },
  })
}

/**
 * Search content with smart schema discovery
 */
export async function searchContent(query: string) {
  // Try to search across multiple content types
  const results = await Promise.allSettled([
    smartFetch("services", {
      filters: { $or: [{ title: { $containsi: query } }, { description: { $containsi: query } }] },
      fallback: { data: [] },
    }),
    smartFetch("bundles", {
      filters: { $or: [{ title: { $containsi: query } }, { description: { $containsi: query } }] },
      fallback: { data: [] },
    }),
    smartFetch("blogs", {
      filters: { $or: [{ title: { $containsi: query } }, { content: { $containsi: query } }] },
      fallback: { data: [] },
    }),
  ])

  // Combine results
  const combinedResults: any[] = []

  results.forEach((result, index) => {
    if (result.status === "fulfilled" && result.value.data) {
      const contentType = ["services", "bundles", "blogs"][index]
      result.value.data.forEach((item: any) => {
        combinedResults.push({
          ...item,
          contentType,
        })
      })
    }
  })

  return { data: combinedResults }
}

/**
 * Clear the request cache
 */
export function clearCache(): void {
  Object.keys(requestCache).forEach((key) => {
    delete requestCache[key]
  })
  console.log("API request cache cleared")
}

/**
 * Force refresh schema discovery
 */
export async function refreshSchema(): Promise<void> {
  await discoverStrapiSchema(true)
  clearCache()
  console.log("Schema refreshed and cache cleared")
}
