// Import from relative paths instead of path aliases
import { getStrapiURL } from "./api"
import { logDetailedError } from "./error-utils"

// Schema information from full_documentation.json
const knownEndpoints = {
  services: "/api/services",
  bundles: "/api/bundles",
  testimonials: "/api/testimonials",
  global: "/api/global",
  homepage: "/api/homepage",
  contact: "/api/contact",
  quotes: "/api/quotes",
  search: "/api/search",
}

// Field mappings for different content types
const fieldMappings = {
  services: {
    title: "title",
    description: "description",
    shortDescription: "shortDescription",
    price: "price",
    priceUnit: "priceUnit",
    slug: "slug",
    image: "image",
  },
  bundles: {
    title: "title",
    description: "description",
    shortDescription: "shortDescription",
    price: "price",
    priceUnit: "priceUnit",
    slug: "slug",
    services: "services",
  },
  testimonials: {
    name: "name",
    text: "text",
    rating: "rating",
    location: "location",
    service: "service",
  },
}

/**
 * Validates an API request against the known schema
 * @param endpoint The API endpoint to validate
 * @param params The query parameters
 * @returns The validated endpoint and parameters
 */
export function validateApiRequest(endpoint: string, params: Record<string, any> = {}) {
  // Extract the base endpoint without query parameters
  const baseEndpoint = endpoint.split("?")[0]

  // Check if the endpoint is known
  const contentType = Object.keys(knownEndpoints).find(
    (type) => baseEndpoint.includes(type) || baseEndpoint.includes(knownEndpoints[type as keyof typeof knownEndpoints]),
  )

  if (!contentType) {
    logDetailedError(`Unknown endpoint: ${endpoint}`, new Error("Schema validation failed"), {
      endpoint,
      knownEndpoints,
    })

    // Return the original endpoint if we can't validate it
    return { endpoint, params }
  }

  // Get the correct endpoint
  const validatedEndpoint = knownEndpoints[contentType as keyof typeof knownEndpoints]

  // Validate and transform parameters if needed
  const validatedParams = { ...params }

  // Return the validated endpoint and parameters
  return { endpoint: validatedEndpoint, params: validatedParams }
}

/**
 * Gets the validated endpoint for a content type
 * @param contentType The content type
 * @returns The validated endpoint
 */
export function getValidatedEndpoint(contentType: string): string {
  if (contentType in knownEndpoints) {
    return knownEndpoints[contentType as keyof typeof knownEndpoints]
  }

  // Try to find a matching endpoint
  const matchingKey = Object.keys(knownEndpoints).find(
    (key) =>
      key.toLowerCase().includes(contentType.toLowerCase()) || contentType.toLowerCase().includes(key.toLowerCase()),
  )

  if (matchingKey) {
    return knownEndpoints[matchingKey as keyof typeof knownEndpoints]
  }

  throw new Error(`No endpoint found for content type: ${contentType}`)
}

/**
 * Validates an API URL
 * @param url The URL to validate
 * @returns The validated URL
 */
export function validateApiUrl(url: string): string {
  try {
    // Check if the URL is valid
    new URL(url)
    return url
  } catch (error) {
    // If the URL is not valid, try to fix it
    if (!url.startsWith("http")) {
      // Try to prepend the API URL
      return getStrapiURL(url)
    }

    // If we can't fix it, log an error and return the original URL
    logDetailedError(`Invalid API URL: ${url}`, error as Error, { url })
    return url
  }
}

/**
 * Validates a field name for a content type
 * @param contentType The content type
 * @param fieldName The field name
 * @returns The validated field name
 */
export function validateFieldName(contentType: string, fieldName: string): string {
  if (contentType in fieldMappings) {
    const mapping = fieldMappings[contentType as keyof typeof fieldMappings]

    if (fieldName in mapping) {
      return mapping[fieldName as keyof typeof mapping]
    }
  }

  // Return the original field name if we can't validate it
  return fieldName
}

/**
 * Validates a filter for a content type
 * @param contentType The content type
 * @param filter The filter
 * @returns The validated filter
 */
export function validateFilter(contentType: string, filter: Record<string, any>): Record<string, any> {
  const validatedFilter: Record<string, any> = {}

  for (const [key, value] of Object.entries(filter)) {
    const validatedKey = validateFieldName(contentType, key)
    validatedFilter[validatedKey] = value
  }

  return validatedFilter
}

/**
 * Validates a sort for a content type
 * @param contentType The content type
 * @param sort The sort
 * @returns The validated sort
 */
export function validateSort(contentType: string, sort: string[]): string[] {
  return sort.map((item) => {
    const [field, direction] = item.split(":")
    const validatedField = validateFieldName(contentType, field)
    return `${validatedField}:${direction || "asc"}`
  })
}

/**
 * Validates a populate for a content type
 * @param contentType The content type
 * @param populate The populate
 * @returns The validated populate
 */
export function validatePopulate(contentType: string, populate: string[]): string[] {
  return populate.map((field) => validateFieldName(contentType, field))
}

/**
 * Validates a query for a content type
 * @param contentType The content type
 * @param query The query
 * @returns The validated query
 */
export function validateQuery(contentType: string, query: Record<string, any>): Record<string, any> {
  const validatedQuery: Record<string, any> = { ...query }

  if (query.filters) {
    validatedQuery.filters = validateFilter(contentType, query.filters)
  }

  if (query.sort) {
    validatedQuery.sort = validateSort(contentType, query.sort)
  }

  if (query.populate) {
    validatedQuery.populate = validatePopulate(contentType, query.populate)
  }

  return validatedQuery
}

/**
 * Validates data for a content type
 * @param contentType The content type
 * @param data The data
 * @returns The validated data
 */
export function validateData(contentType: string, data: Record<string, any>): Record<string, any> {
  const validatedData: Record<string, any> = {}

  for (const [key, value] of Object.entries(data)) {
    const validatedKey = validateFieldName(contentType, key)
    validatedData[validatedKey] = value
  }

  return validatedData
}

/**
 * Validates a response for a content type
 * @param contentType The content type
 * @param response The response
 * @returns The validated response
 */
export function validateResponse(contentType: string, response: any): any {
  if (!response) {
    return response
  }

  if (Array.isArray(response)) {
    return response.map((item) => validateResponse(contentType, item))
  }

  if (typeof response === "object") {
    if (response.data) {
      return {
        ...response,
        data: validateResponse(contentType, response.data),
      }
    }

    if (response.attributes) {
      return {
        ...response,
        attributes: validateData(contentType, response.attributes),
      }
    }

    const validatedResponse: Record<string, any> = {}

    for (const [key, value] of Object.entries(response)) {
      validatedResponse[key] = validateResponse(contentType, value)
    }

    return validatedResponse
  }

  return response
}

export function validate(data: any, schema: any) {
  return validateData("generic", data)
}

export function enhanceSchemaDiscovery(endpoint: string) {
  return getValidatedEndpoint(endpoint)
}

export function getContentTypeSchema(contentType: string) {
  return {
    endpoint: getValidatedEndpoint(contentType),
    fields: fieldMappings[contentType as keyof typeof fieldMappings] || {},
  }
}

export function getFieldNamesFromSchema(contentType: string) {
  const schema = fieldMappings[contentType as keyof typeof fieldMappings]
  return schema ? Object.keys(schema) : []
}
