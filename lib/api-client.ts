// Fix the import paths to use relative paths instead of path aliases
import { getStrapiURL } from "./api"
import { logDetailedError } from "./error-utils"
import { validateApiRequest, getValidatedEndpoint } from "./schema-validator"
import { handleError, ErrorSeverity } from "./error-handling"
import { validateEnvironment, getEnvVar } from "./env-check"
import { getFallbackData } from "./fallback-data"
import type { ApiError } from "./types"
import { getEndpoint } from "./schema-discovery"
import { fetchAPI as originalFetchAPI } from "./api"
import { handleApiError } from "./error-utils"

// Validate environment on module load
const env = validateEnvironment()

if (!env.isValid && process.env.NODE_ENV === "development") {
  // Only log in development mode for debugging
}

// Base API URL from environment
const API_URL = getEnvVar("STRAPI_API_URL", "http://localhost:1337")

// API token from environment
const API_TOKEN = getEnvVar("STRAPI_API_TOKEN", "")

/**
 * Get full API URL for a path
 */
export function getApiUrl(path = ""): string {
  return `${API_URL}${path}`
}

/**
 * Generic API fetch function with error handling
 */
export async function fetchApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = getApiUrl(path)

  // Set up headers with authentication
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  }

  if (API_TOKEN) {
    headers["Authorization"] = `Bearer ${API_TOKEN}`
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    // Handle non-OK responses
    if (!response.ok) {
      // Try to parse error response
      let errorData: ApiError

      try {
        errorData = await response.json()
      } catch {
        errorData = {
          status: response.status,
          name: response.statusText,
          message: `API request failed with status ${response.status}`,
        }
      }

      throw errorData
    }

    // Parse and return successful response
    return (await response.json()) as T
  } catch (error) {
    // Use our error handling system
    throw error
  }
}

/**
 * Safe API fetch with fallback
 */
export async function safeFetchApi<T>(
  path: string,
  options: RequestInit = {},
  fallback: T,
  errorContext: Record<string, any> = {},
): Promise<T> {
  try {
    return await fetchApi<T>(path, options)
  } catch (error) {
    return (await handleError<T>(error, `API request to ${path} failed`, {
      severity: ErrorSeverity.MEDIUM,
      fallback,
      context: {
        path,
        options,
        ...errorContext,
      },
    })) as T
  }
}

/**
 * Get all services with fallback
 */
export async function getAllServices() {
  return await safeFetchApi("/api/services", {}, { data: [getFallbackData().services] }, { function: "getAllServices" })
}

/**
 * Get service by slug with fallback
 */
export async function getServiceBySlug(slug: string) {
  return await safeFetchApi(
    `/api/services?filters[slug][$eq]=${slug}`,
    {},
    { data: [getFallbackData().services] },
    { function: "getServiceBySlug", slug },
  )
}

/**
 * Get all bundles with fallback
 */
export async function getAllBundles() {
  return await safeFetchApi("/api/bundles", {}, { data: [getFallbackData().bundles] }, { function: "getAllBundles" })
}

/**
 * Get bundle by slug with fallback
 */
export async function getBundleBySlug(slug: string) {
  return await safeFetchApi(
    `/api/bundles?filters[slug][$eq]=${slug}`,
    {},
    { data: [getFallbackData().bundles] },
    { function: "getBundleBySlug", slug },
  )
}

/**
 * Get all testimonials with fallback
 */
export async function getAllTestimonials() {
  return await safeFetchApi(
    "/api/testimonials",
    {},
    { data: [getFallbackData().testimonials] },
    { function: "getAllTestimonials" },
  )
}

/**
 * Submit contact form
 */
export async function submitContactForm(data: any) {
  return await safeFetchApi(
    "/api/contact",
    {
      method: "POST",
      body: JSON.stringify({ data }),
    },
    { success: false, message: "Failed to submit contact form" },
    { function: "submitContactForm" },
  )
}

/**
 * Submit quote request
 */
export async function submitQuoteRequest(data: any) {
  return await safeFetchApi(
    "/api/quotes",
    {
      method: "POST",
      body: JSON.stringify({ data }),
    },
    { success: false, message: "Failed to submit quote request" },
    { function: "submitQuoteRequest" },
  )
}

/**
 * Search content
 */
export async function searchContent(query: string) {
  return await safeFetchApi(
    `/api/search?query=${encodeURIComponent(query)}`,
    {},
    { data: [] },
    { function: "searchContent", query },
  )
}

/**
 * Get all bundles with schema discovery and fallback
 */
export async function getAllBundlesWithDiscovery() {
  // Use mock data that matches the expected structure from the API
  const fallbackBundles = getFallbackData().bundles

  try {
    // Get the correct endpoint from schema discovery
    const endpoint = await getEndpoint("bundles")
    return await fetchApi(`${endpoint}?populate=*`, {})
  } catch (error) {
    // Log with a more helpful message
    return fallbackBundles
  }
}

/**
 * Get all testimonials with schema discovery and fallback
 */
export async function getAllTestimonialsWithDiscovery() {
  try {
    // Get the correct endpoint from schema discovery
    const endpoint = await getEndpoint("testimonials")
    return await fetchApi(`${endpoint}?populate=*`, {})
  } catch (error) {
    return { data: getFallbackData().testimonials.data }
  }
}

/**
 * Fetches data from the Strapi API with proper error handling and schema validation
 * @param endpoint The API endpoint to fetch from
 * @param options Optional fetch options
 * @returns The fetched data
 */
export async function fetchAPI(endpoint: string, options = {}) {
  try {
    // Validate the endpoint against our known schema
    const { endpoint: validatedEndpoint, params } = validateApiRequest(endpoint, {})

    // Construct the URL with validated endpoint
    const url = getStrapiURL(validatedEndpoint)

    // Add query parameters if needed
    const queryParams = new URLSearchParams(params).toString()
    const fullUrl = queryParams ? `${url}?${queryParams}` : url

    // Log the request in development
    if (process.env.NODE_ENV === "development") {
      console.log(`🔄 API Request: ${fullUrl}`)
    }

    // Fetch with timeout and proper error handling
    const response = await fetch(fullUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN || ""}`,
      },
      ...options,
      // Add a timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000),
    })

    // Check for HTTP errors
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${await response.text()}`)
    }

    // Parse the response
    const data = await response.json()

    // Log the response in development
    if (process.env.NODE_ENV === "development") {
      console.log(`✅ API Response for ${endpoint}:`, data)
    }

    return data
  } catch (error) {
    // Log the error with details
    logDetailedError(`API request to ${endpoint} failed:`, error)

    // Rethrow with more context
    throw new Error(`Failed to fetch from ${endpoint}: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Fetches services from the Strapi API
 * @returns The services data
 */
export async function getServicesStrapi() {
  try {
    // Use the validated endpoint for services
    const endpoint = getValidatedEndpoint("services")

    // Fetch with proper parameters
    const data = await fetchAPI(`${endpoint}?populate=*`)
    return data
  } catch (error) {
    logDetailedError("Error fetching services:", error)
    throw error
  }
}

/**
 * Fetches bundles from the Strapi API
 * @returns The bundles data
 */
export async function getBundlesStrapi() {
  try {
    // Use the validated endpoint for bundles
    const endpoint = getValidatedEndpoint("bundles")

    // Fetch with proper parameters
    const data = await fetchAPI(`${endpoint}?populate=*`)
    return data
  } catch (error) {
    logDetailedError("Error fetching bundles:", error)
    throw error
  }
}

/**
 * Fetches testimonials from the Strapi API
 * @returns The testimonials data
 */
export async function getTestimonialsStrapi() {
  try {
    // Use the validated endpoint for testimonials
    const endpoint = getValidatedEndpoint("testimonials")

    // Fetch with proper parameters
    const data = await fetchAPI(`${endpoint}?populate=*`)
    return data
  } catch (error) {
    logDetailedError("Error fetching testimonials:", error)
    throw error
  }
}

/**
 * Fetches global data from the Strapi API
 * @returns The global data
 */
export async function getGlobalData() {
  try {
    // Use the validated endpoint for global
    const endpoint = getValidatedEndpoint("global")

    // Fetch with proper parameters
    const data = await fetchAPI(`${endpoint}?populate=*`)
    return data
  } catch (error) {
    logDetailedError("Error fetching global data:", error)
    throw error
  }
}

/**
 * Fetches homepage data from the Strapi API
 * @returns The homepage data
 */
export async function getHomepageData() {
  try {
    // Use the validated endpoint for homepage
    const endpoint = getValidatedEndpoint("homepage")

    // Fetch with proper parameters
    const data = await fetchAPI(`${endpoint}?populate=deep`)
    return data
  } catch (error) {
    logDetailedError("Error fetching homepage data:", error)
    throw error
  }
}

/**
 * Fetches a service by slug from the Strapi API
 * @param slug The service slug
 * @returns The service data
 */
export async function getServiceBySlugStrapi(slug: string) {
  try {
    // Use the validated endpoint for services
    const endpoint = getValidatedEndpoint("services")

    // Fetch with proper parameters
    const data = await fetchAPI(`${endpoint}?filters[slug][$eq]=${slug}&populate=*`)

    if (!data.data || data.data.length === 0) {
      throw new Error(`Service with slug ${slug} not found`)
    }

    return data.data[0]
  } catch (error) {
    logDetailedError(`Error fetching service with slug ${slug}:`, error)
    throw error
  }
}

/**
 * Fetches a bundle by slug from the Strapi API
 * @param slug The bundle slug
 * @returns The bundle data
 */
export async function getBundleBySlugStrapi(slug: string) {
  try {
    // Use the validated endpoint for bundles
    const endpoint = getValidatedEndpoint("bundles")

    // Fetch with proper parameters
    const data = await fetchAPI(`${endpoint}?filters[slug][$eq]=${slug}&populate=*`)

    if (!data.data || data.data.length === 0) {
      throw new Error(`Bundle with slug ${slug} not found`)
    }

    return data.data[0]
  } catch (error) {
    logDetailedError(`Error fetching bundle with slug ${slug}:`, error)
    throw error
  }
}

/**
 * Submits contact form data to the Strapi API
 * @param formData The contact form data
 * @returns The submission response
 */
export async function submitContactFormStrapi(formData: any) {
  try {
    // Use the validated endpoint for contact
    const endpoint = getValidatedEndpoint("contact")

    // Submit the form data
    const data = await fetchAPI(endpoint, {
      method: "POST",
      body: JSON.stringify({ data: formData }),
    })

    return data
  } catch (error) {
    logDetailedError("Error submitting contact form:", error)
    throw error
  }
}

// Export all functions for use in other modules;

/**
 * Fetches services from the API
 * @returns Array of services
 */
export async function getServices() {
  try {
    const data = await originalFetchAPI("/api/services?populate=*")
    return data.data
  } catch (error) {
    return handleApiError(error, "services", "getServices")
  }
}

/**
 * Fetches a single service by ID
 * @param id - The service ID
 * @returns The service data
 */
export async function getServiceById(id: string | number) {
  try {
    const data = await originalFetchAPI(`/api/services/${id}?populate=*`)
    return data.data
  } catch (error) {
    return handleApiError(error, "service", `getServiceById(${id})`)
  }
}

/**
 * Fetches bundles from the API
 * @returns Array of bundles
 */
export async function getBundles() {
  try {
    const data = await originalFetchAPI("/api/bundles?populate=services")
    return data.data
  } catch (error) {
    return handleApiError(error, "bundles", "getBundles")
  }
}

/**
 * Fetches a single bundle by ID
 * @param id - The bundle ID
 * @returns The bundle data
 */
export async function getBundleById(id: string | number) {
  try {
    const data = await originalFetchAPI(`/api/bundles/${id}?populate=services`)
    return data.data
  } catch (error) {
    return handleApiError(error, "bundle", `getBundleById(${id})`)
  }
}

/**
 * Fetches testimonials from the API
 * @returns Array of testimonials
 */
export async function getTestimonialsNew() {
  try {
    const data = await originalFetchAPI("/api/testimonials")
    return data.data
  } catch (error) {
    return handleApiError(error, "testimonials", "getTestimonials")
  }
}

/**
 * Fetches company information from the API
 * @returns Company information
 */
export async function getCompanyInfo() {
  try {
    const data = await originalFetchAPI("/api/company-info")
    return data.data
  } catch (error) {
    return handleApiError(error, "company-info", "getCompanyInfo")
  }
}

/**
 * Searches content across multiple content types
 * @param query - The search query
 * @param contentTypes - Array of content types to search
 * @returns Search results grouped by content type
 */
export async function searchContentNew(query: string, contentTypes: string[] = ["services", "bundles"]) {
  try {
    const searchPromises = contentTypes.map((contentType) =>
      originalFetchAPI(`/api/${contentType}?filters[title][$containsi]=${encodeURIComponent(query)}`),
    )

    const results = await Promise.all(searchPromises)

    return contentTypes.reduce(
      (acc, contentType, index) => {
        acc[contentType] = results[index].data
        return acc
      },
      {} as Record<string, any[]>,
    )
  } catch (error) {
    console.error("Search error:", error)
    return contentTypes.reduce(
      (acc, contentType) => {
        acc[contentType] = []
        return acc
      },
      {} as Record<string, any[]>,
    )
  }
}

/**
 * Submits a contact form to the API
 * @param formData - The form data to submit
 * @returns The API response
 */
export async function submitContactFormNew(formData: any) {
  try {
    const response = await originalFetchAPI("/api/contact-submissions", {
      method: "POST",
      body: JSON.stringify({ data: formData }),
    })
    return { success: true, data: response.data }
  } catch (error) {
    console.error("Contact form submission error:", error)
    return { success: false, error: (error as Error).message }
  }
}
