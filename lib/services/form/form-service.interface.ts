/**
 * Form validation result
 */
export interface ValidationResult {
  valid: boolean
  errors: Record<string, string>
}

/**
 * Interface for form service
 */
export interface FormService {
  /**
   * Validate form data against a schema
   */
  validate<T>(data: T, schema: any): ValidationResult

  /**
   * Submit form data to an endpoint
   */
  submit<T, R>(endpoint: string, data: T): Promise<R>
}

/**
 * Service token for DI container
 */
export const FORM_SERVICE_TOKEN = "FormService"
