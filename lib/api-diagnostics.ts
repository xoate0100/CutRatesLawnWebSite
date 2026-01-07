// API Diagnostics utility for troubleshooting API issues
import { getStrapiURL } from "./api"

// Test different API versions and parameters
export async function diagnoseApiEndpoint(endpoint: string): Promise<{
  success: boolean
  workingEndpoint?: string
  error?: string
  details?: any
}> {
  console.log(`Diagnosing API endpoint: ${endpoint}`)

  // Get API token from environment
  const API_TOKEN = process.env.STRAPI_API_TOKEN || ""

  // Common headers
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_TOKEN}`,
  }

  // Test variations of the endpoint
  const variations = [
    // Original endpoint
    endpoint,
    // Without populate parameters
    endpoint.split("?")[0],
    // With different populate syntax (v4)
    endpoint
      .replace("populate=", "populate[0]=")
      .replace(",", "&populate[1]="),
    // With fields parameter
    `${endpoint.split("?")[0]}?fields[0]=title&fields[1]=slug&fields[2]=description`,
    // With pagination
    `${endpoint.split("?")[0]}?pagination[page]=1&pagination[pageSize]=10`,
  ]

  // Try each variation
  for (const testEndpoint of variations) {
    try {
      console.log(`Testing endpoint variation: ${testEndpoint}`)

      const response = await fetch(getStrapiURL(testEndpoint), {
        method: "GET",
        headers,
      })

      if (response.ok) {
        console.log(`Found working endpoint: ${testEndpoint}`)
        return {
          success: true,
          workingEndpoint: testEndpoint,
        }
      } else {
        const errorData = await response.json().catch(() => null)
        console.error(`Endpoint ${testEndpoint} failed with status ${response.status}:`, errorData)
      }
    } catch (error) {
      console.error(`Error testing endpoint ${testEndpoint}:`, error)
    }
  }

  // If we get here, none of the variations worked
  return {
    success: false,
    error: "All endpoint variations failed",
  }
}

// Test API token validity
export async function checkApiTokenValidity(): Promise<{
  valid: boolean
  error?: string
  details?: any
}> {
  try {
    const API_TOKEN = process.env.STRAPI_API_TOKEN || ""

    if (!API_TOKEN) {
      return {
        valid: false,
        error: "API token is not set",
      }
    }

    // Try a simple endpoint that should work with any valid token
    const response = await fetch(getStrapiURL("/api"), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    })

    if (response.ok) {
      return { valid: true }
    } else {
      const errorData = await response.json().catch(() => null)
      return {
        valid: false,
        error: `API token validation failed with status ${response.status}`,
        details: errorData,
      }
    }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Unknown error checking API token",
    }
  }
}

// Check API version
export async function checkApiVersion(): Promise<{
  version?: string
  error?: string
}> {
  try {
    // Try to get API info
    const response = await fetch(getStrapiURL("/admin/information"), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN || ""}`,
      },
    })

    if (response.ok) {
      const data = await response.json()
      return {
        version: data.strapiVersion || "Unknown",
      }
    } else {
      // Try alternative endpoint for version info
      const altResponse = await fetch(getStrapiURL("/admin/init"), {
        method: "GET",
      })

      if (altResponse.ok) {
        const data = await altResponse.json()
        return {
          version: data.data?.strapiVersion || "Unknown",
        }
      }

      return {
        error: `Could not determine API version, status: ${response.status}`,
      }
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error checking API version",
    }
  }
}

// Run full API diagnostics
export async function runApiDiagnostics(): Promise<{
  status: "success" | "partial" | "failure"
  apiUrl: string
  tokenValid: boolean
  version?: string
  endpoints: Record<string, boolean>
  errors: Record<string, string>
  recommendations: string[]
}> {
  const apiUrl = process.env.STRAPI_API_URL || "https://api.cutrateslawn.com"
  const errors: Record<string, string> = {}
  const endpoints: Record<string, boolean> = {}
  const recommendations: string[] = []

  // Check token validity
  const tokenCheck = await checkApiTokenValidity()
  if (!tokenCheck.valid) {
    errors.token = tokenCheck.error || "Invalid API token"
    recommendations.push("Update the STRAPI_API_TOKEN environment variable with a valid token")
  }

  // Check API version
  const versionCheck = await checkApiVersion()
  if (versionCheck.error) {
    errors.version = versionCheck.error
  }

  // Test critical endpoints
  const endpointsToTest = [
    "/api/services",
    "/api/services?populate=coverImage,categories",
    "/api/bundles",
    "/api/testimonials",
  ]

  for (const endpoint of endpointsToTest) {
    const diagnosis = await diagnoseApiEndpoint(endpoint)
    endpoints[endpoint] = diagnosis.success

    if (!diagnosis.success) {
      errors[endpoint] = diagnosis.error || `Endpoint ${endpoint} failed`

      if (diagnosis.workingEndpoint) {
        recommendations.push(`Replace "${endpoint}" with "${diagnosis.workingEndpoint}"`)
      }
    }
  }

  // Determine overall status
  const status =
    Object.keys(errors).length === 0
      ? "success"
      : Object.keys(endpoints).some((e) => endpoints[e])
        ? "partial"
        : "failure"

  // Add general recommendations
  if (status !== "success") {
    recommendations.push("Check the Strapi API documentation for the correct endpoint structure")
    recommendations.push("Verify that the API URL is correct in the environment variables")

    if (Object.keys(errors).length > 0 && !errors.token) {
      recommendations.push("Check if the API schema has changed and update the client accordingly")
    }
  }

  return {
    status,
    apiUrl,
    tokenValid: tokenCheck.valid,
    version: versionCheck.version,
    endpoints,
    errors,
    recommendations,
  }
}
