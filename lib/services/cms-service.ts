import { getStrapiApiUrl, getStrapiApiToken, isDevelopment } from "@/lib/utils/env"
import { getMockData } from "./mock-data"

// Define the shape of a CMS response
export interface CMSResponse<T> {
  data: T
  meta?: any
}

// Simple CMS service
export const cmsService = {
  /**
   * Fetch data from the CMS
   */
  async fetch<T>(path: string): Promise<CMSResponse<T>> {
    const apiUrl = getStrapiApiUrl()
    const apiToken = getStrapiApiToken()

    // In development, return mock data if no token is available
    if (isDevelopment() && !apiToken) {
      console.warn("No API token available, using mock data")
      const mockResponse = getMockData<CMSResponse<T>>(path)

      if (mockResponse) {
        return mockResponse
      }

      // Return empty data if no mock is available
      return {
        data: {} as T,
        meta: { mock: true },
      }
    }

    try {
      const response = await fetch(`${apiUrl}/api/${path}`, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`CMS request failed: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("CMS fetch error:", error)
      throw error
    }
  },
}
