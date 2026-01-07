import {
  type AppError,
  ApiError,
  ValidationError,
  AuthError,
  NotFoundError,
  ExternalServiceError,
  ConfigurationError,
  ErrorSeverity,
} from "./app-errors"

/**
 * Logs a detailed error with consistent formatting
 */
export function logDetailedError(error: unknown, metadata: Record<string, any> = {}): void {
  const errorObj = formatError(error, metadata)

  // Log to console with appropriate level based on severity
  switch (errorObj.severity) {
    case ErrorSeverity.CRITICAL:
    case ErrorSeverity.HIGH:
      console.error("[ERROR]", errorObj)
      break
    case ErrorSeverity.MEDIUM:
      console.warn("[WARNING]", errorObj)
      break
    case ErrorSeverity.LOW:
    default:
      console.info("[INFO]", errorObj)
      break
  }

  // In production, you might want to send this to an error tracking service
  if (process.env.NODE_ENV === "production") {
    // Example: sendToErrorTrackingService(errorObj);
  }
}

/**
 * Formats an error into a consistent structure
 */
export function formatError(error: unknown, metadata: Record<string, any> = {}): AppError {
  if (
    error instanceof ApiError ||
    error instanceof ValidationError ||
    error instanceof AuthError ||
    error instanceof NotFoundError ||
    error instanceof ExternalServiceError ||
    error instanceof ConfigurationError
  ) {
    return {
      ...error,
      metadata: { ...error.metadata, ...metadata },
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: "UNKNOWN_ERROR",
      severity: ErrorSeverity.MEDIUM,
      metadata,
      originalError: error,
    }
  }

  if (typeof error === "string") {
    return {
      message: error,
      code: "STRING_ERROR",
      severity: ErrorSeverity.LOW,
      metadata,
    }
  }

  return {
    message: "An unknown error occurred",
    code: "UNKNOWN_ERROR",
    severity: ErrorSeverity.MEDIUM,
    metadata,
    originalError: error,
  }
}

/**
 * Creates a user-friendly error message
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  const errorObj = formatError(error)

  // Return a user-friendly message based on the error
  switch (errorObj.code) {
    case "NETWORK_ERROR":
      return "Unable to connect to the server. Please check your internet connection and try again."
    case "API_ERROR":
      return "There was a problem with our service. Please try again later."
    case "VALIDATION_ERROR":
      return "Please check your input and try again."
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
  return [ErrorSeverity.MEDIUM, ErrorSeverity.HIGH, ErrorSeverity.CRITICAL].includes(errorObj.severity as ErrorSeverity)
}

// Re-export the types for convenience
export {
  AppError,
  ApiError,
  ValidationError,
  AuthError,
  NotFoundError,
  ExternalServiceError,
  ConfigurationError,
  ErrorSeverity,
} from "./app-errors"
