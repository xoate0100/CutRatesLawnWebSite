import { container } from "../di/container"
import { type ApiService, API_SERVICE_TOKEN } from "./api/api-service.interface"
import { ApiServiceImpl } from "./api/api-service.impl"
import { type CacheService, CACHE_SERVICE_TOKEN } from "./cache/cache-service.interface"
import { CacheServiceImpl } from "./cache/cache-service.impl"
import { type LoggerService, LOGGER_SERVICE_TOKEN, LogLevel } from "./logger/logger-service.interface"
import { LoggerServiceImpl } from "./logger/logger-service.impl"
import { type CMSService, CMS_SERVICE_TOKEN } from "./cms/cms-service.interface"
import { StrapiCMSService } from "./cms/strapi-cms-service.impl"
import { type FormService, FORM_SERVICE_TOKEN } from "./form/form-service.interface"
import { FormServiceImpl } from "./form/form-service.impl"
import { getStrapiApiUrl, getStrapiApiToken, isDevelopment, isProduction } from "@/lib/utils/env"

/**
 * Register all services in the DI container
 */
export function registerServices(): void {
  // Register API service
  if (!container.has(API_SERVICE_TOKEN)) {
    container.registerFactory<ApiService>(API_SERVICE_TOKEN, () => {
      const baseUrl = getStrapiApiUrl()
      return new ApiServiceImpl(baseUrl)
    })
  }

  // Register cache service
  if (!container.has(CACHE_SERVICE_TOKEN)) {
    container.registerFactory<CacheService>(CACHE_SERVICE_TOKEN, () => {
      return new CacheServiceImpl()
    })
  }

  // Register logger service
  if (!container.has(LOGGER_SERVICE_TOKEN)) {
    container.registerFactory<LoggerService>(LOGGER_SERVICE_TOKEN, () => {
      const logger = new LoggerServiceImpl()

      // Set log level based on environment
      if (isProduction()) {
        logger.setLevel(LogLevel.INFO)
      } else {
        logger.setLevel(LogLevel.DEBUG)
      }

      return logger
    })
  }

  // Register CMS service
  if (!container.has(CMS_SERVICE_TOKEN)) {
    container.registerFactory<CMSService>(CMS_SERVICE_TOKEN, () => {
      const apiService = container.get<ApiService>(API_SERVICE_TOKEN)
      const cacheService = container.get<CacheService>(CACHE_SERVICE_TOKEN)
      const loggerService = container.get<LoggerService>(LOGGER_SERVICE_TOKEN)
      const apiToken = getStrapiApiToken()

      // Use mock data in development if no API token is provided
      const useMockData = isDevelopment() && !apiToken

      return new StrapiCMSService(apiService, cacheService, loggerService, apiToken, useMockData)
    })
  }

  // Register form service
  if (!container.has(FORM_SERVICE_TOKEN)) {
    container.registerFactory<FormService>(FORM_SERVICE_TOKEN, () => {
      const apiService = container.get<ApiService>(API_SERVICE_TOKEN)
      return new FormServiceImpl(apiService)
    })
  }
}

/**
 * Initialize services
 */
export function initializeServices(): void {
  registerServices()
}
