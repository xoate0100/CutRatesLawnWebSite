import { logDetailedError } from "./error-utils"
import { getStrapiURL } from "./api"
import { fetchAPI } from "./api"

/**
 * Interface for content type fields
 */
interface ContentTypeField {
  name: string
  type: string
  required: boolean
  unique: boolean
  repeatable?: boolean
  component?: string
  relation?: string
}

/**
 * Interface for content type schema
 */
interface ContentTypeSchema {
  uid: string
  displayName: string
  fields: ContentTypeField[]
}

// Schema cache
// let schemaCache: SchemaCache = {
//   timestamp: 0,
//   endpoints: {},
//   contentTypes: {},
//   isValid: false,
// }

/**
 * Cache for content type schemas
 */
let schemaCache: Record<string, ContentTypeSchema> = {}
let lastFetchTime = 0
const CACHE_TTL = 3600000 // 1 hour in milliseconds

// Cache expiration time (5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000

// Schema cache interface
interface SchemaCache {
  timestamp: number
  endpoints: Record<string, string>
  contentTypes: Record<string, any>
  isValid: boolean
}

// Types for schema discovery
// export interface ContentTypeField {
//   name: string
//   type: string
//   required: boolean
//   multiple?: boolean
//   relation?: string
//   target?: string
// }

export interface ContentTypeInfo {
  uid: string
  apiID: string
  displayName: string
  pluralName: string
  endpoint: string
  fields: ContentTypeField[]
  lastChecked: number
}

export interface SchemaDiscoveryResult {
  contentTypes: Record<string, string>
  endpoints: Record<string, string>
  success: boolean
  timestamp: number
}

// Common content type names and their possible variations
const CONTENT_TYPE_VARIATIONS: Record<string, string[]> = {
  services: ["service", "services", "lawn-service", "lawn-services"],
  bundles: ["bundle", "bundles", "service-bundle", "service-bundles", "package", "packages"],
  testimonials: ["testimonial", "testimonials", "review", "reviews", "customer-testimonial", "customer-testimonials"],
  blogs: ["blog", "blogs", "article", "articles", "post", "posts"],
  faqs: ["faq", "faqs", "question", "questions"],
  team: ["team", "team-member", "team-members", "staff", "staff-member", "staff-members"],
  gallery: ["gallery", "galleries", "image", "images", "photo", "photos"],
}

// Field mapping for common content types
const FIELD_MAPPINGS: Record<string, Record<string, string[]>> = {
  services: {
    title: ["title", "name", "serviceName", "service_name"],
    slug: ["slug", "url", "path"],
    description: ["description", "content", "body", "serviceDescription", "service_description"],
    shortDescription: ["shortDescription", "excerpt", "summary", "short_description"],
    price: ["price", "cost", "servicePrice", "service_price"],
    priceUnit: ["priceUnit", "unit", "per", "price_unit"],
    coverImage: ["coverImage", "image", "featuredImage", "thumbnail", "cover_image"],
    icon: ["icon", "serviceIcon", "service_icon"],
  },
  bundles: {
    title: ["title", "name", "bundleName", "bundle_name"],
    slug: ["slug", "url", "path"],
    description: ["description", "content", "body", "bundleDescription", "bundle_description"],
    shortDescription: ["shortDescription", "excerpt", "summary", "short_description"],
    price: ["price", "cost", "bundlePrice", "bundle_price"],
    priceUnit: ["priceUnit", "unit", "per", "price_unit"],
    coverImage: ["coverImage", "image", "featuredImage", "thumbnail", "cover_image"],
    services: ["services", "includedServices", "included_services"],
  },
  testimonials: {
    name: ["name", "customerName", "author", "customer_name"],
    text: ["text", "content", "testimonial", "review", "body"],
    rating: ["rating", "stars", "score"],
    service: ["service", "relatedService", "related_service"],
    image: ["image", "photo", "avatar", "customerImage", "customer_image"],
    location: ["location", "city", "area", "customerLocation", "customer_location"],
  },
}

// Cache for discovered schema
// let schemaCache: SchemaDiscoveryResult | null = null
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour
const discoveryInProgress = false
const discoveryPromise: Promise<SchemaDiscoveryResult> | null = null

// Default endpoints to use as fallback
const DEFAULT_ENDPOINTS: Record<string, string> = {
  services: "/api/services",
  bundles: "/api/bundles",
  testimonials: "/api/testimonials",
  blogs: "/api/blogs",
  faqs: "/api/faqs",
  team: "/api/team-members",
  gallery: "/api/galleries",
}

/**
 * Fetches content type schemas from the Strapi API
 * @returns Object mapping content type UIDs to their schemas
 */
export async function fetchContentTypeSchemas(): Promise<Record<string, ContentTypeSchema>> {
  try {
    // Check if cache is still valid
    const now = Date.now()
    if (Object.keys(schemaCache).length > 0 && now - lastFetchTime < CACHE_TTL) {
      return schemaCache
    }

    // Fetch content types from Strapi
    const response = await fetchAPI("/api/content-type-builder/content-types")

    // Process the response
    const schemas: Record<string, ContentTypeSchema> = {}

    for (const contentType of response.data) {
      const { uid, schema } = contentType

      // Skip internal content types
      if (uid.startsWith("admin::") || uid.startsWith("plugin::")) {
        continue
      }

      // Extract fields
      const fields: ContentTypeField[] = Object.entries(schema.attributes).map(([name, attribute]: [string, any]) => ({
        name,
        type: attribute.type,
        required: !!attribute.required,
        unique: !!attribute.unique,
        repeatable: attribute.repeatable,
        component: attribute.component,
        relation: attribute.target,
      }))

      // Add to schemas
      schemas[uid] = {
        uid,
        displayName: schema.displayName,
        fields,
      }
    }

    // Update cache
    schemaCache = schemas
    lastFetchTime = now

    return schemas
  } catch (error) {
    console.error("Error fetching content type schemas:", error)
    return {}
  }
}

/**
 * Gets the schema for a specific content type
 * @param contentType - The content type to get the schema for
 * @returns The content type schema
 */
export async function getContentTypeSchema(contentType: string): Promise<ContentTypeSchema | null> {
  const schemas = await fetchContentTypeSchemas()
  const fullUid = contentType.includes("::") ? contentType : `api::${contentType}.${contentType}`
  return schemas[fullUid] || null
}

/**
 * Gets the API endpoint for a content type
 * @param contentType - The content type
 * @returns The API endpoint
 */
export function getContentTypeEndpoint(contentType: string): string {
  // Handle special cases
  if (contentType === "company-info") {
    return "company-info"
  }

  // Pluralize regular content types
  return `${contentType}s`
}

/**
 * Discovers the Strapi schema
 * @returns The discovered schema
 */
export async function discoverStrapiSchema(): Promise<SchemaCache> {
  try {
    // Fetch the content types from Strapi
    const response = await fetch(getStrapiURL("/api/content-type-builder/content-types"), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN || ""}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch schema: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Process the content types
    const endpoints: Record<string, string> = {}
    const contentTypes: Record<string, any> = {}

    data.data.forEach((contentType: any) => {
      const apiID = contentType.apiID
      const uid = contentType.uid

      // Extract the endpoint from the UID
      const endpoint = `/api/${apiID}`

      // Store the endpoint and content type
      endpoints[apiID] = endpoint
      contentTypes[apiID] = contentType
    })

    // Update the cache
    // schemaCache = {
    //   timestamp: Date.now(),
    //   endpoints,
    //   contentTypes,
    //   isValid: true,
    // }

    // return schemaCache
    return {
      timestamp: Date.now(),
      endpoints,
      contentTypes,
      isValid: true,
    }
  } catch (error) {
    // Log the error
    logDetailedError("Failed to discover schema", error as Error, {})

    // Return the current cache
    // return schemaCache
    return {
      timestamp: Date.now(),
      endpoints: {},
      contentTypes: {},
      isValid: false,
    }
  }
}

/**
 * Discovers endpoints by directly testing common variations
 * This is our most robust discovery method when APIs aren't available
 * Optimized for performance with parallel requests and early termination
 */
async function discoverEndpointsByTesting(defaultResult: SchemaDiscoveryResult): Promise<SchemaDiscoveryResult> {
  const discoveredEndpoints: Record<string, string> = {}
  const contentTypes: Record<string, ContentTypeInfo> = {}
  const foundEndpoints: string[] = []

  console.log("Starting direct endpoint discovery (optimized)...")

  // Test all default endpoints in parallel first
  const defaultTests = Object.entries(defaultResult.endpoints).map(async ([commonType, endpoint]) => {
    try {
      console.log(`Testing default endpoint for ${commonType}: ${endpoint}`)
      const response = await fetch(getStrapiURL(`${endpoint}?pagination[pageSize]=1`), {
        // Add a timeout to prevent long-running requests
        signal: AbortSignal.timeout(3000),
      })

      if (response.ok) {
        console.log(`✅ Default endpoint works for ${commonType}: ${endpoint}`)
        discoveredEndpoints[commonType] = endpoint
        foundEndpoints.push(endpoint)

        // Try to extract field information
        try {
          const data = await response.json()
          if (data.data && data.data.length > 0) {
            extractFieldsFromResponse(data, commonType, endpoint, contentTypes)
          }
        } catch (e) {
          console.warn(`Could not extract fields from ${endpoint}:`, e)
        }

        return true
      } else {
        console.log(`❌ Default endpoint failed for ${commonType}: ${endpoint} (${response.status})`)
        return false
      }
    } catch (e) {
      console.warn(`Error testing default endpoint for ${commonType}:`, e)
      return false
    }
  })

  // Wait for all default tests to complete
  const defaultResults = await Promise.all(defaultTests)

  // For any types where the default endpoint didn't work, try variations
  const variationTests = Object.entries(CONTENT_TYPE_VARIATIONS)
    .filter((_, index) => !defaultResults[index])
    .map(async ([commonType, variations]) => {
      // Skip if we already found an endpoint for this type
      if (discoveredEndpoints[commonType]) return

      // Create an array of all possible endpoints to test
      const endpointsToTest = variations
        .flatMap((variation) => [`/api/${variation}s`, `/api/${variation}`])
        .filter((endpoint) => !foundEndpoints.includes(endpoint))

      // Test all endpoints in parallel with a race condition
      // We only need the first successful one
      try {
        const results = await Promise.allSettled(
          endpointsToTest.map(async (endpoint) => {
            try {
              console.log(`Testing endpoint: ${endpoint}`)
              const response = await fetch(getStrapiURL(`${endpoint}?pagination[pageSize]=1`), {
                // Add a timeout to prevent long-running requests
                signal: AbortSignal.timeout(2000),
              })

              if (response.ok) {
                return { endpoint, response }
              }
              return null
            } catch (e) {
              return null
            }
          }),
        )

        // Find the first successful result
        for (const result of results) {
          if (result.status === "fulfilled" && result.value) {
            const { endpoint, response } = result.value
            console.log(`✅ Found working endpoint for ${commonType}: ${endpoint}`)
            discoveredEndpoints[commonType] = endpoint
            foundEndpoints.push(endpoint)

            // Try to extract field information
            try {
              const data = await response.json()
              if (data.data && data.data.length > 0) {
                extractFieldsFromResponse(data, commonType, endpoint, contentTypes)
              }
            } catch (e) {
              console.warn(`Could not extract fields from ${endpoint}:`, e)
            }

            break
          }
        }
      } catch (e) {
        console.warn(`Error testing variations for ${commonType}:`, e)
      }
    })

  // Wait for all variation tests to complete
  await Promise.all(variationTests)

  // Merge with defaults for any missing endpoints
  const mergedEndpoints = { ...DEFAULT_ENDPOINTS }

  // Only override with discovered endpoints that actually worked
  Object.entries(discoveredEndpoints).forEach(([key, value]) => {
    mergedEndpoints[key] = value
  })

  console.log("Endpoint discovery completed. Found endpoints:", mergedEndpoints)

  return {
    contentTypes,
    endpoints: mergedEndpoints,
    success: foundEndpoints.length > 0,
    timestamp: Date.now(),
  }
}

/**
 * Helper function to extract fields from API response
 */
function extractFieldsFromResponse(
  data: any,
  commonType: string,
  endpoint: string,
  contentTypes: Record<string, ContentTypeInfo>,
) {
  if (!data.data || !data.data[0] || !data.data[0].attributes) {
    return
  }

  const attributes = data.data[0].attributes || {}
  const fields: ContentTypeField[] = Object.keys(attributes).map((key) => ({
    name: key,
    type: typeof attributes[key] === "object" ? "relation" : typeof attributes[key],
    required: false,
  }))

  const apiID = endpoint.split("/").pop()?.replace("s", "") || commonType

  contentTypes[apiID] = {
    uid: `api::${apiID}.${apiID}`,
    apiID,
    displayName: apiID,
    pluralName: `${apiID}s`,
    endpoint,
    fields,
    lastChecked: Date.now(),
  }

  console.log(`Extracted ${fields.length} fields from ${endpoint}`)
}

/**
 * Gets the endpoint for a content type
 * @param type The content type
 * @returns The endpoint
 */
export async function getEndpoint(type: string): Promise<string> {
  // Check if the cache is valid
  // if (!schemaCache.isValid || Date.now() - schemaCache.timestamp > CACHE_EXPIRATION) {
  //   await discoverStrapiSchema()
  // }

  // // Check if the endpoint exists in the cache
  // if (type in schemaCache.endpoints) {
  //   return schemaCache.endpoints[type]
  // }

  // // Try to find a matching endpoint
  // const matchingKey = Object.keys(schemaCache.endpoints).find(
  //   (key) => key.toLowerCase().includes(type.toLowerCase()) || type.toLowerCase().includes(key.toLowerCase()),
  // )

  // if (matchingKey) {
  //   return schemaCache.endpoints[matchingKey]
  // }

  // // If no endpoint is found, use a default endpoint
  // return `/api/${type}`
  const contentTypeEndpoint = getContentTypeEndpoint(type)
  return `/api/${contentTypeEndpoint}`
}

/**
 * Gets the content type for a type
 * @param type The type
 * @returns The content type
 */
export async function getContentType(type: string): Promise<any> {
  // Check if the cache is valid
  // if (!schemaCache.isValid || Date.now() - schemaCache.timestamp > CACHE_EXPIRATION) {
  //   await discoverStrapiSchema()
  // }

  // // Check if the content type exists in the cache
  // if (type in schemaCache.contentTypes) {
  //   return schemaCache.contentTypes[type]
  // }

  // // Try to find a matching content type
  // const matchingKey = Object.keys(schemaCache.contentTypes).find(
  //   (key) => key.toLowerCase().includes(type.toLowerCase()) || type.toLowerCase().includes(key.toLowerCase()),
  // )

  // if (matchingKey) {
  //   return schemaCache.contentTypes[matchingKey]
  // }

  // // If no content type is found, return null
  // return null
  const contentTypeSchema = await getContentTypeSchema(type)
  return contentTypeSchema
}

/**
 * Maps a frontend field name to the corresponding backend field
 * based on known variations
 */
export function mapFieldName(contentType: string, frontendField: string): string {
  const fieldMap = FIELD_MAPPINGS[contentType]
  if (!fieldMap) return frontendField

  // Check if this frontend field has known variations
  for (const [standardField, variations] of Object.entries(fieldMap)) {
    if (standardField === frontendField || variations.includes(frontendField)) {
      // If we have schema info, try to find the actual field name in the backend
      // if (schemaCache?.contentTypes[contentType]) {
      //   const fields = schemaCache.contentTypes[contentType].fields

      //   // First check for exact match with standard field
      //   if (fields.some((f) => f.name === standardField)) {
      //     return standardField
      //   }

      //   // Then check variations
      //   for (const variation of variations) {
      //     if (fields.some((f) => f.name === variation)) {
      //       return variation
      //     }
      //   }
      // }

      // If no schema info or no match found, return the standard field
      return standardField
    }
  }

  // No mapping found, return original
  return frontendField
}

/**
 * Transforms data from backend format to frontend expected format
 */
export function transformData(contentType: string, data: any): any {
  if (!data) return data

  // If it's an array, transform each item
  if (Array.isArray(data)) {
    return data.map((item) => transformData(contentType, item))
  }

  // If it's an object with attributes, transform the attributes
  if (data.attributes) {
    const transformed = { ...data }

    // Get field mappings for this content type
    const fieldMap = FIELD_MAPPINGS[contentType]
    if (!fieldMap) return data

    // For each standard field, check if we need to map from a different field
    for (const [standardField, variations] of Object.entries(fieldMap)) {
      // Skip if the standard field already exists
      if (data.attributes[standardField] !== undefined) continue

      // Check variations to see if any exist in the data
      for (const variation of variations) {
        if (data.attributes[variation] !== undefined) {
          transformed.attributes[standardField] = data.attributes[variation]
          break
        }
      }
    }

    return transformed
  }

  return data
}

/**
 * Enhances schema discovery with additional functionality
 * @param contentType - The content type to enhance
 * @returns Enhanced schema information
 */
export async function enhanceSchemaDiscovery(contentType: string): Promise<any> {
  try {
    // Get the schema
    const schema = await getContentTypeSchema(contentType)

    if (!schema) {
      return { error: `Schema not found for content type: ${contentType}` }
    }

    // Get a sample entry
    const endpoint = getContentTypeEndpoint(contentType)
    const sampleData = await fetchAPI(`/api/${endpoint}?pagination[pageSize]=1`)

    // Combine schema and sample data
    return {
      schema,
      endpoint,
      sampleData: sampleData.data[0] || null,
      fields: schema.fields.map((field) => ({
        ...field,
        example: sampleData.data[0]?.attributes?.[field.name] || null,
      })),
    }
  } catch (error) {
    console.error(`Error enhancing schema for ${contentType}:`, error)
    return { error: (error as Error).message }
  }
}

/**
 * Initializes schema discovery and sets up listeners for schema changes
 * This is designed to be performance-friendly
 */
export function initializeSchemaDiscovery(): void {
  // Load from localStorage first if available
  // if (typeof window !== "undefined") {
  //   try {
  //     const cached = localStorage.getItem("strapi-schema-cache")
  //     if (cached) {
  //       schemaCache = JSON.parse(cached)
  //       console.log("Loaded schema from localStorage")
  //     }
  //   } catch (e) {
  //     console.warn("Failed to load schema from localStorage:", e)
  //   }
  // }

  // // If we don't have a cache, use default endpoints
  // if (!schemaCache) {
  //   schemaCache = {
  //     contentTypes: {},
  //     endpoints: { ...DEFAULT_ENDPOINTS },
  //     isValid: false,
  //     timestamp: Date.now(),
  //   }
  // }

  // // Check if we need to refresh the cache
  // const needsRefresh = !schemaCache.isValid || Date.now() - schemaCache.timestamp > CACHE_DURATION

  // // Only run discovery if needed and after a delay to not impact page load
  // if (needsRefresh) {
  //   // Use setTimeout to delay discovery until after page load
  //   setTimeout(() => {
  //     discoverStrapiSchema().then((schema) => {
  //       console.log("Schema discovery completed in background")
  //     })
  //   }, 2000) // 2 second delay
  // }

  // // Set up periodic refresh in development mode
  // if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  //   // Use a longer interval to reduce performance impact
  //   const interval = setInterval(
  //     () => {
  //       // Only refresh if the page has been idle
  //       if (document.visibilityState === "visible" && !discoveryInProgress) {
  //         discoverStrapiSchema().then((schema) => {
  //           console.log("Schema refreshed periodically")
  //         })
  //       }
  //     },
  //     15 * 60 * 1000,
  //   ) // Refresh every 15 minutes in dev mode

  //   // Clean up interval on page unload
  //   window.addEventListener("beforeunload", () => {
  //     clearInterval(interval)
  //   })
  // }
  fetchContentTypeSchemas()
}

/**
 * Forces a schema refresh
 * @returns The refreshed schema
 */
export async function forceSchemaRefresh(): Promise<SchemaCache> {
  return await discoverStrapiSchema()
}

/**
 * Refreshes the schema cache
 * @returns True if refresh was successful, false otherwise
 */
export async function refreshSchemaCache(): Promise<boolean> {
  try {
    schemaCache = {}
    lastFetchTime = 0
    await fetchContentTypeSchemas()
    return true
  } catch (error) {
    console.error("Error refreshing schema cache:", error)
    return false
  }
}

/**
 * Validates the schema
 * @param schema The schema to validate
 * @returns Whether the schema is valid
 */
export function validateSchema(schema: SchemaCache): boolean {
  return schema.isValid && Object.keys(schema.endpoints).length > 0
}

/**
 * Gets the current schema
 * @returns The current schema
 */
export function getSchema(): SchemaCache {
  return {
    timestamp: 0,
    endpoints: {},
    contentTypes: {},
    isValid: false,
  }
}

/**
 * Gets the endpoint for a type (alias for getEndpoint)
 * @param type The type
 * @returns The endpoint
 */
export async function getEndpointForType(type: string): Promise<string> {
  return await getEndpoint(type)
}

/**
 * Enhances schema discovery with additional functionality
 * This function is used to add custom logic to the schema discovery process
 * @param options Options for enhancing schema discovery
 * @returns The enhanced schema
 */
// export function enhanceSchemaDiscovery(options: { forceRefresh?: boolean } = {}): SchemaCache {
//   // If force refresh is requested, trigger a schema refresh
//   if (options.forceRefresh) {
//     discoverStrapiSchema().then((schema) => {
//       console.log("Schema refreshed via enhancement")
//     })
//   }

//   // Return the current schema
//   return schemaCache
// }
