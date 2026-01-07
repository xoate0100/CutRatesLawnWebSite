import { getSafeImageUrl } from "./utils"
import { logDetailedError } from "./error-utils"
import type { QuoteFormData } from "./types"
import { getEndpoint } from "./schema-discovery"
import qs from "qs"
import { ErrorSeverity } from "@/lib/error-types"

// Validate environment on module load
// Base API URL from environment
const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337"

// API token from environment
const API_TOKEN = process.env.STRAPI_API_TOKEN || ""

// Maximum number of retry attempts for API requests
const MAX_RETRY_ATTEMPTS = 3

/**
 * Core API utilities for interacting with Strapi
 */

/**
 * Get full Strapi URL from path
 * @param {string} path Path of the URL
 * @returns {string} Full Strapi URL
 */
export function getStrapiURL(path = "") {
  return `${process.env.STRAPI_API_URL || "http://localhost:1337"}${path}`
}

/**
 * Constructs a URL for the public Strapi API
 * @param path - The path to append to the Strapi URL
 * @returns The complete public Strapi URL
 */
export function getPublicStrapiURL(path = ""): string {
  // Get the public Strapi API URL from environment variables
  const publicStrapiUrl =
    process.env.NEXT_PUBLIC_STRAPI_API_URL || process.env.STRAPI_API_URL || "http://localhost:1337"

  // Normalize the path to ensure it starts with a slash
  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  // Remove trailing slash from base URL if present
  const normalizedBase = publicStrapiUrl.endsWith("/") ? publicStrapiUrl.slice(0, -1) : publicStrapiUrl

  // Return the complete URL
  return `${normalizedBase}${normalizedPath}`
}

/**
 * Helper to make GET requests to Strapi API endpoints
 * @param {string} path Path of the API route
 * @param {Object} urlParamsObject URL params object, will be stringified
 * @param {Object} options Options passed to fetch
 * @returns Parsed API call response
 */
export async function fetchAPI(path, urlParamsObject = {}, options = {}) {
  try {
    console.log(`Fetching API: ${path}`)

    // Merge default and user options
    const mergedOptions = {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    }

    // Build request URL
    const queryString = qs.stringify(urlParamsObject)
    const requestUrl = `${getStrapiURL(`/api${path}${queryString ? `?${queryString}` : ""}`)}`

    console.log(`Request URL: ${requestUrl}`)

    // Add auth header if token exists
    if (process.env.STRAPI_API_TOKEN) {
      mergedOptions.headers.Authorization = `Bearer ${process.env.STRAPI_API_TOKEN}`
    } else {
      console.warn("No STRAPI_API_TOKEN found")
    }

    // Trigger API call
    console.log("Sending fetch request...")
    const response = await fetch(requestUrl, mergedOptions)

    // Handle response
    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`)
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("API response received successfully")
    return data
  } catch (error) {
    console.error("Error in fetchAPI:", error)
    throw error
  }
}

/**
 * Fetches data from the Strapi API with pagination
 * @param path - The API path to fetch from
 * @param pageSize - The number of items per page
 * @param page - The page number to fetch
 * @param options - Additional fetch options
 * @returns The fetched data with pagination info
 */
export async function fetchAPIWithPagination(
  path: string,
  pageSize = 10,
  page = 1,
  options: RequestInit = {},
): Promise<any> {
  // Add pagination parameters to the path
  const paginatedPath = `${path}${path.includes("?") ? "&" : "?"}pagination[pageSize]=${pageSize}&pagination[page]=${page}`

  // Fetch the data
  return fetchAPI(paginatedPath, options)
}

/**
 * Fetches all pages of data from the Strapi API
 * @param path - The API path to fetch from
 * @param pageSize - The number of items per page
 * @param options - Additional fetch options
 * @returns All fetched data combined
 */
export async function fetchAllPages(path: string, pageSize = 100, options: RequestInit = {}): Promise<any[]> {
  // Fetch the first page to get pagination info
  const firstPageData = await fetchAPIWithPagination(path, pageSize, 1, options)

  // Extract pagination info
  const { pagination } = firstPageData.meta
  const { pageCount } = pagination

  // If there's only one page, return the data
  if (pageCount <= 1) {
    return firstPageData.data
  }

  // Otherwise, fetch all remaining pages
  const otherPagePromises = Array.from({ length: pageCount - 1 }, (_, i) =>
    fetchAPIWithPagination(path, pageSize, i + 2, options),
  )

  // Wait for all pages to be fetched
  const otherPagesData = await Promise.all(otherPagePromises)

  // Combine all data
  const allData = [...firstPageData.data, ...otherPagesData.flatMap((pageData) => pageData.data)]

  return allData
}

/**
 * Process image URL from the API
 * @param path Image path
 * @param fallback Fallback URL
 * @returns Full image URL
 */
export function getImageUrl(path = "", fallback = ""): string {
  if (!path) return fallback

  // If the path is already a full URL, return it
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path
  }

  // Otherwise, prepend the API URL
  return `${getStrapiURL()}${path.startsWith("/") ? "" : "/"}${path}`
}

/**
 * Get full API URL for a path
 * @param path API path
 * @returns Full API URL
 */
export function getApiUrl(path = ""): string {
  return getStrapiURL(path)
}

// Re-export getSafeImageUrl for convenience
export { getSafeImageUrl }

/**
 * Generic API fetch function with error handling and retry logic
 */
export async function fetchApi<T>(path: string, options: RequestInit = {}, retryCount = 0): Promise<T> {
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
      const errorMessage = `API request failed with status ${response.status}`

      // If we haven't reached max retries and it's a 5xx error (server error), retry
      if (retryCount < MAX_RETRY_ATTEMPTS && response.status >= 500) {
        // Exponential backoff: 1s, 2s, 4s, etc.
        const backoffTime = Math.pow(2, retryCount) * 1000
        console.warn(
          `Retrying API request to ${path} in ${backoffTime}ms (attempt ${retryCount + 1}/${MAX_RETRY_ATTEMPTS})`,
        )

        await new Promise((resolve) => setTimeout(resolve, backoffTime))
        return fetchApi<T>(path, options, retryCount + 1)
      }

      throw new Error(errorMessage)
    }

    // Parse and return successful response
    return (await response.json()) as T
  } catch (error) {
    logDetailedError(
      `API request to ${path} failed`,
      error,
      {
        path,
        retryCount,
        options: { ...options, headers: { ...headers, Authorization: API_TOKEN ? "Bearer [REDACTED]" : undefined } },
      },
      ErrorSeverity.ERROR,
    )
    throw error
  }
}

/**
 * Safe API fetch with fallback
 */
export async function safeFetchApi<T>(path: string, options: RequestInit = {}, fallback: T): Promise<T> {
  try {
    return await fetchApi<T>(path, options)
  } catch (error) {
    logDetailedError(
      `Using fallback for API request to ${path}`,
      error,
      {
        path,
        fallback,
      },
      ErrorSeverity.WARNING,
    )
    return fallback
  }
}

// Fetch data with smart endpoint discovery
export async function fetchDataForType(type: string, options = {}) {
  try {
    const endpoint = await getEndpoint(type)
    if (!endpoint) {
      console.warn(`No endpoint found for type: ${type}, using fallback data`)
      return getFallbackData(type)
    }

    const data = await fetchAPI(endpoint)
    return data
  } catch (error) {
    console.error(`Error fetching data for type ${type}:`, error)
    return getFallbackData(type)
  }
}

// Get fallback data for when API requests fail
function getFallbackData(type: string) {
  const fallbacks: Record<string, any> = {
    services: {
      data: [
        {
          id: 1,
          attributes: {
            title: "Lawn Mowing",
            slug: "lawn-mowing",
            description: "Regular lawn mowing service",
            shortDescription: "Keep your lawn looking neat",
            price: "25",
            priceUnit: "per visit",
          },
        },
        {
          id: 2,
          attributes: {
            title: "Hedge Trimming",
            slug: "hedge-trimming",
            description: "Professional hedge trimming",
            shortDescription: "Maintain your hedges",
            price: "40",
            priceUnit: "per hour",
          },
        },
      ],
    },
    bundles: {
      data: [
        {
          id: 1,
          attributes: {
            title: "Basic Bundle",
            slug: "basic-bundle",
            description: "Lawn mowing once a week",
            shortDescription: "Essential lawn care",
            price: "80",
            priceUnit: "per month",
          },
        },
        {
          id: 2,
          attributes: {
            title: "Premium Bundle",
            slug: "premium-bundle",
            description: "Complete lawn care package",
            shortDescription: "Full service lawn care",
            price: "150",
            priceUnit: "per month",
          },
        },
      ],
    },
    testimonials: {
      data: [
        {
          id: 1,
          attributes: {
            name: "John Doe",
            text: "Great service!",
            rating: 5,
            location: "Springfield",
          },
        },
        {
          id: 2,
          attributes: {
            name: "Jane Smith",
            text: "Very professional",
            rating: 4,
            location: "Shelbyville",
          },
        },
      ],
    },
  }

  return fallbacks[type] || { data: [] }
}

// Export all functions for use in other modules
export { fetchDataForType as fetchData, getFallbackData }

/**
 * Get all services with fallback
 */
export async function getAllServices() {
  return await safeFetchApi("/api/services?populate=*", {}, getFallbackData("services"))
}

/**
 * Get service by slug with fallback
 */
export async function getServiceBySlug(slug: string) {
  return await safeFetchApi(
    `/api/services?filters[slug][$eq]=${slug}&populate=*`,
    {},
    {
      data: getFallbackData("services").data.filter((service: any) => service.attributes.slug === slug),
    },
  )
}

// Update the getAllBundles function to use the correct endpoint
export async function getAllBundles() {
  try {
    // Use the endpoint from schema discovery
    const endpoint = await getEndpoint("bundles")
    return await fetchApi(`${endpoint}?populate=*`, {})
  } catch (error) {
    // Log with a more helpful message
    console.log("Bundles endpoint not found. This is expected if you haven't created the bundle collection type yet.")
    return getFallbackData("bundles")
  }
}

// Update the getBundleBySlug function to use the correct endpoint
export async function getBundleBySlug(slug: string) {
  try {
    // Use the endpoint from schema discovery
    const endpoint = await getEndpoint("bundles")
    return await fetchApi(`${endpoint}?filters[slug][$eq]=${slug}&populate=*`, {})
  } catch (error) {
    // Log and return fallback data
    logDetailedError(
      "Bundle endpoint failed, using fallback data",
      error,
      {
        slug,
      },
      ErrorSeverity.WARNING,
    )
    return {
      data: getFallbackData("bundles").data.filter((bundle: any) => bundle.attributes.slug === slug),
    }
  }
}

// Update the getAllTestimonials function to use the correct endpoint
export async function getAllTestimonials() {
  try {
    // Use the endpoint from schema discovery
    const endpoint = await getEndpoint("testimonials")
    return await fetchApi(`${endpoint}?populate=*`, {})
  } catch (error) {
    console.log(
      "Testimonials endpoint not found. This is expected if you haven't created the testimonial collection type yet.",
    )
    return getFallbackData("testimonials")
  }
}

// Update the getTestimonialsByService function to use the correct endpoint
export async function getTestimonialsByService(serviceId?: string, serviceSlug?: string) {
  try {
    // Use the endpoint from schema discovery
    const endpoint = await getEndpoint("testimonials")
    let queryPath = `${endpoint}?populate=*`

    // Add filter by service ID if provided
    if (serviceId) {
      queryPath += `&filters[service][id][$eq]=${serviceId}`
    }

    // Add filter by service slug if provided
    if (serviceSlug && !serviceId) {
      queryPath += `&filters[service][slug][$eq]=${serviceSlug}`
    }

    return await safeFetchApi(queryPath, {}, getFallbackData("testimonials"))
  } catch (error) {
    logDetailedError(
      `Error fetching testimonials by service`,
      error,
      {
        serviceId,
        serviceSlug,
      },
      ErrorSeverity.ERROR,
    )

    // Return fallback data
    return getFallbackData("testimonials")
  }
}

// Add these types if they don't exist in lib/types.ts
export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export interface ApiResponse {
  success: boolean
  message?: string
  data?: any
}

/**
 * Submit contact form data to the API
 */
export async function submitContactForm(formData: ContactFormData): Promise<ApiResponse> {
  try {
    // In a real implementation, this would be an API call
    console.log("Submitting contact form:", formData)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate successful response
    return {
      success: true,
      message: "Contact form submitted successfully",
    }
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

/**
 * Submit quote form data to the API
 */
export async function submitQuoteForm(formData: QuoteFormData): Promise<ApiResponse> {
  try {
    // In a real implementation, this would be an API call
    console.log("Submitting quote form:", formData)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate successful response
    return {
      success: true,
      message: "Quote request submitted successfully",
    }
  } catch (error) {
    console.error("Error submitting quote form:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

// Export all functions;
