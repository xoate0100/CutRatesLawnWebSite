/**
 * Utility to help debug Strapi schema issues
 */
export async function debugStrapiSchema(endpoint: string) {
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  try {
    const API_URL = process.env.STRAPI_API_URL || "https://api.cutrateslawn.com"
    const API_TOKEN = process.env.STRAPI_API_TOKEN

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (API_TOKEN) {
      headers["Authorization"] = `Bearer ${API_TOKEN}`
    }

    // First, try to get the content type schema
    const res = await fetch(`${API_URL}/api/${endpoint}?populate=*`, {
      headers,
      next: { revalidate: 0 }, // Don't cache this request
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch schema: ${res.status}`)
    }

    const data = await res.json()

    // Extract and log the top-level field names
    const fieldNames = data.data?.attributes ? Object.keys(data.data.attributes) : []

    console.log(`[SCHEMA DEBUG] Available fields for ${endpoint}:`, fieldNames)

    return {
      fieldNames,
      fullData: data,
    }
  } catch (error) {
    console.error("[SCHEMA DEBUG] Error:", error)
    return null
  }
}
