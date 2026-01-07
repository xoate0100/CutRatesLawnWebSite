import type { FormService, ValidationResult } from "./form-service.interface"
import type { ApiService } from "../api/api-service.interface"
import { ErrorFactory } from "@/lib/errors/factory"

/**
 * Implementation of the form service
 */
export class FormServiceImpl implements FormService {
  private apiService: ApiService

  constructor(apiService: ApiService) {
    this.apiService = apiService
  }

  /**
   * Validate form data against a schema
   * This is a simple implementation - in a real app, you'd use a validation library
   */
  validate<T>(data: T, schema: Record<string, (value: any) => boolean | string>): ValidationResult {
    const errors: Record<string, string> = {}
    let valid = true

    // Check each field against its validator
    Object.entries(schema).forEach(([field, validator]) => {
      const value = data[field as keyof T]
      const result = validator(value)

      if (result !== true) {
        valid = false
        errors[field] = typeof result === "string" ? result : `Invalid value for ${field}`
      }
    })

    return { valid, errors }
  }

  /**
   * Submit form data to an endpoint
   */
  async submit<T, R>(endpoint: string, data: T): Promise<R> {
    try {
      return await this.apiService.post<T, R>(endpoint, data)
    } catch (error) {
      throw ErrorFactory.createApiError(
        `Form submission failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        400,
        { endpoint },
        error,
      )
    }
  }
}
