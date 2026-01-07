import type { CMSService } from "./cms-service.interface"
import type { ApiService } from "../api/api-service.interface"
import type { CacheService } from "../cache/cache-service.interface"
import type { LoggerService } from "../logger/logger-service.interface"
import { getMockData, hasMockData } from "./mock-data"
import { isDevelopment } from "@/lib/utils/env"

export class StrapiCMSService implements CMSService {
  private readonly apiService: ApiService
  private readonly cacheService: CacheService
  private readonly loggerService: LoggerService
  private readonly apiToken: string
  private readonly useMockData: boolean

  constructor(
    apiService: ApiService,
    cacheService: CacheService,
    loggerService: LoggerService,
    apiToken: string,
    useMockData: boolean = isDevelopment(),
  ) {
    this.apiService = apiService
    this.cacheService = cacheService
    this.loggerService = loggerService
    this.apiToken = apiToken
    this.useMockData = useMockData

    // Log initialization
    this.loggerService.info("StrapiCMSService initialized", {
      useMockData,
      hasApiToken: !!apiToken,
    })
  }

  /**
   * Get data from the CMS
   */
  async getData<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    const cacheKey = `cms:${endpoint}:${JSON.stringify(params)}`

    // Try to get from cache first
    const cachedData = this.cacheService.get<T>(cacheKey)
    if (cachedData) {
      this.loggerService.debug("Returning cached CMS data", { endpoint, cacheKey })
      return cachedData
    }

    try {
      let data: T

      // Use mock data in development if available
      if (this.useMockData && hasMockData(endpoint)) {
        this.loggerService.debug("Using mock data for CMS request", { endpoint })
        data = await getMockData<T>(endpoint)
      } else {
        // Make the actual API request
        this.loggerService.debug("Fetching CMS data from API", { endpoint, params })

        const headers: Record<string, string> = {}
        if (this.apiToken) {
          headers["Authorization"] = `Bearer ${this.apiToken}`
        }

        data = await this.apiService.get<T>(endpoint, { params, headers })
      }

      // Cache the result
      this.cacheService.set(cacheKey, data, 60 * 5) // Cache for 5 minutes

      return data
    } catch (error) {
      this.loggerService.error("Error fetching CMS data", { endpoint, error })

      // In development, fall back to mock data even if not explicitly enabled
      if (isDevelopment() && hasMockData(endpoint) && !this.useMockData) {
        this.loggerService.warn("Falling back to mock data after API error", { endpoint })
        const mockData = await getMockData<T>(endpoint)
        return mockData
      }

      throw error
    }
  }

  /**
   * Clear the CMS cache
   */
  clearCache(endpoint?: string): void {
    if (endpoint) {
      const cachePattern = `cms:${endpoint}:`
      this.cacheService.deletePattern(cachePattern)
      this.loggerService.debug("Cleared CMS cache for endpoint", { endpoint })
    } else {
      this.cacheService.deletePattern("cms:")
      this.loggerService.debug("Cleared all CMS cache")
    }
  }
}
