import { logDetailedError } from "./error-utils"

interface SchemaErrorEvent {
  timestamp: number
  contentType: string
  field: string
  error: string
  requestUrl: string
}

class SchemaMonitor {
  private static instance: SchemaMonitor
  private errors: SchemaErrorEvent[] = []
  private errorThreshold = 5
  private errorTimeWindow = 60 * 60 * 1000 // 1 hour

  private constructor() {
    // Private constructor for singleton
  }

  public static getInstance(): SchemaMonitor {
    if (!SchemaMonitor.instance) {
      SchemaMonitor.instance = new SchemaMonitor()
    }

    return SchemaMonitor.instance
  }

  /**
   * Record a schema-related error
   * @param {string} contentType The content type
   * @param {string} field The field that caused the error
   * @param {string} error The error message
   * @param {string} requestUrl The request URL
   */
  public recordError(contentType: string, field: string, error: string, requestUrl: string): void {
    this.errors.push({
      timestamp: Date.now(),
      contentType,
      field,
      error,
      requestUrl,
    })

    // Clean up old errors
    this.cleanupOldErrors()

    // Check if we need to alert
    this.checkErrorThreshold(contentType, field)
  }

  /**
   * Clean up errors older than the time window
   */
  private cleanupOldErrors(): void {
    const cutoff = Date.now() - this.errorTimeWindow
    this.errors = this.errors.filter((error) => error.timestamp >= cutoff)
  }

  /**
   * Check if errors for a content type and field exceed the threshold
   * @param {string} contentType The content type
   * @param {string} field The field
   */
  private checkErrorThreshold(contentType: string, field: string): void {
    const relevantErrors = this.errors.filter((error) => error.contentType === contentType && error.field === field)

    if (relevantErrors.length >= this.errorThreshold) {
      this.alertSchemaIssue(contentType, field, relevantErrors)
    }
  }

  /**
   * Alert about a schema issue
   * @param {string} contentType The content type
   * @param {string} field The field
   * @param {SchemaErrorEvent[]} errors The errors
   */
  private alertSchemaIssue(contentType: string, field: string, errors: SchemaErrorEvent[]): void {
    // In a real implementation, this would send an alert to a monitoring system
    console.error(`SCHEMA ALERT: Field "${field}" in content type "${contentType}" is causing repeated errors`)

    logDetailedError(
      "Schema Compatibility Issue Detected",
      new Error(`Field "${field}" in content type "${contentType}" is causing repeated errors`),
      {
        contentType,
        field,
        errorCount: errors.length,
        timeWindow: `${this.errorTimeWindow / (60 * 1000)} minutes`,
        sampleErrors: errors.slice(0, 3),
      },
    )
  }

  /**
   * Get error statistics
   * @returns {object} Error statistics
   */
  public getErrorStats(): object {
    const stats: Record<string, Record<string, number>> = {}

    for (const error of this.errors) {
      if (!stats[error.contentType]) {
        stats[error.contentType] = {}
      }

      if (!stats[error.contentType][error.field]) {
        stats[error.contentType][error.field] = 0
      }

      stats[error.contentType][error.field]++
    }

    return stats
  }
}

export const schemaMonitor = SchemaMonitor.getInstance()

/**
 * Parse schema error from Strapi error response
 * @param {object} errorDetails Error details from Strapi
 * @returns {object|null} Parsed schema error or null
 */
export function parseSchemaError(errorDetails: any): { contentType: string; field: string } | null {
  if (!errorDetails || !errorDetails.error) return null

  const { error } = errorDetails

  // Check for invalid key error
  if (error.message && error.message.includes("Invalid key") && error.details) {
    const { key, path } = error.details

    if (key && path) {
      return {
        contentType: path,
        field: key,
      }
    }
  }

  return null
}

/**
 * Monitor schema errors from API responses
 * @param {string} requestUrl The request URL
 * @param {object} errorDetails Error details from Strapi
 */
// export function monitorSchemaErrors(requestUrl: string, errorDetails: any): void {
//   const schemaError = parseSchemaError(errorDetails)

//   if (schemaError) {
//     schemaMonitor.recordError(schemaError.contentType, schemaError.field, errorDetails.error.message, requestUrl)
//   }
// }

// Schema monitoring utility for API responses
// This helps identify schema changes in the API that might break the application

interface SchemaError {
  endpoint: string
  error: any
  timestamp: string
}

const SCHEMA_ERRORS_KEY = "cut_rates_schema_errors"
const MAX_STORED_ERRORS = 10

export function monitorSchemaErrors(endpoint: string, error: any): void {
  if (!error) return

  try {
    // Only run in browser
    if (typeof window === "undefined") return

    // Get existing errors
    const storedErrorsJson = localStorage.getItem(SCHEMA_ERRORS_KEY)
    const storedErrors: SchemaError[] = storedErrorsJson ? JSON.parse(storedErrorsJson) : []

    // Add new error
    const newError: SchemaError = {
      endpoint,
      error,
      timestamp: new Date().toISOString(),
    }

    // Add to beginning of array and limit size
    const updatedErrors = [newError, ...storedErrors].slice(0, MAX_STORED_ERRORS)

    // Save back to storage
    localStorage.setItem(SCHEMA_ERRORS_KEY, JSON.stringify(updatedErrors))

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.warn("Schema error detected:", newError)
    }
  } catch (err) {
    // Fail silently - this is just a monitoring utility
    console.error("Error in schema monitoring:", err)
  }
}

export function getSchemaErrors(): SchemaError[] {
  try {
    // Only run in browser
    if (typeof window === "undefined") return []

    const storedErrorsJson = localStorage.getItem(SCHEMA_ERRORS_KEY)
    return storedErrorsJson ? JSON.parse(storedErrorsJson) : []
  } catch (err) {
    console.error("Error getting schema errors:", err)
    return []
  }
}

export function clearSchemaErrors(): void {
  try {
    // Only run in browser
    if (typeof window === "undefined") return

    localStorage.removeItem(SCHEMA_ERRORS_KEY)
  } catch (err) {
    console.error("Error clearing schema errors:", err)
  }
}
