import { type AppError, ErrorSeverity, isAppError } from "@/lib/errors/types"
import { ErrorFactory } from "@/lib/errors/factory"

/**
 * Formats an error into a consistent structure
 */
export function formatError(error: unknown, metadata: Record<string, any> = {}): AppError {
  // If it's already an AppError, just add the metadata
  if (isAppError(error)) {
    return {
      ...error,
      metadata: { ...error.metadata, ...metadata },
    }
  }

  // Otherwise, convert it to an AppError
  const appError = ErrorFactory.fromUnknown(error)

  // Add the metadata
  return {
    ...appError,
    metadata: { ...appError.metadata, ...metadata },
  }
}

/**
 * Creates a user-friendly error message
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  const errorObj = formatError(error)

  // Return a user-friendly message based on the error code
  switch (errorObj.code) {
    case "NETWORK_ERROR":
      return "Unable to connect to the server. Please check your internet connection and try again."
    case "API_ERROR":
      return "There was a problem with our service. Please try again later."
    case "VALIDATION_ERROR":
      return "Please check your input and try again."
    case "AUTH_ERROR":
      return "Please sign in to continue."
    case "NOT_FOUND_ERROR":
      return "The requested resource could not be found."
    case "EXTERNAL_SERVICE_ERROR":
      return "We're having trouble connecting to an external service. Please try again later."
    case "CONFIGURATION_ERROR":
      return "There's a configuration issue. Please contact support."
    default:
      return "Something went wrong. Please try again later."
  }
}

/**
 * Determines if an error should be reported to the user
 */
export function shouldReportErrorToUser(error: unknown): boolean {
  const errorObj = formatError(error)

  // Only report medium and higher severity errors to the user
  return [ErrorSeverity.MEDIUM, ErrorSeverity.HIGH, ErrorSeverity.CRITICAL].includes(errorObj.severity)
}

/**
 * Gets the appropriate HTTP status code for an error
 */
export function getErrorStatusCode(error: unknown): number {
  const errorObj = formatError(error)
  return errorObj.statusCode || 500
}
