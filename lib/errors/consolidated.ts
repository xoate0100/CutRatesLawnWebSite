/**
 * Consolidated error module that includes all error-related functionality
 * This can be used as an alternative to the individual modules to avoid import issues
 */

// Error Severity
export enum ErrorSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

// Error Interface
export interface AppError {
  message: string
  code: string
  severity: ErrorSeverity
  metadata?: Record<string, any>
  originalError?: unknown
  statusCode: number
}

// Base Error Class
export class BaseError extends Error implements AppError {
  code: string
  severity: ErrorSeverity
  metadata?: Record<string, any>
  originalError?: unknown
  statusCode: number

  constructor(
    message: string,
    code: string,
    severity: ErrorSeverity,
    statusCode: number,
    metadata?: Record<string, any>,
    originalError?: unknown,
  ) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.severity = severity
    this.statusCode = statusCode
    this.metadata = metadata
    this.originalError = originalError

    // Ensures proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

// Specific Error Classes
export class ApiError extends BaseError {
  constructor(
    message: string,
    code = "API_ERROR",
    severity = ErrorSeverity.MEDIUM,
    statusCode = 500,
    metadata?: Record<string, any>,
    originalError?: unknown,
  ) {
    super(message, code, severity, statusCode, metadata, originalError)
  }
}

export class ValidationError extends BaseError {
  constructor(
    message: string,
    code = "VALIDATION_ERROR",
    severity = ErrorSeverity.LOW,
    statusCode = 400,
    metadata?: Record<string, any>,
    originalError?: unknown,
  ) {
    super(message, code, severity, statusCode, metadata, originalError)
  }
}

export class AuthError extends BaseError {
  constructor(
    message: string,
    code = "AUTH_ERROR",
    severity = ErrorSeverity.MEDIUM,
    statusCode = 401,
    metadata?: Record<string, any>,
    originalError?: unknown,
  ) {
    super(message, code, severity, statusCode, metadata, originalError)
  }
}

export class NotFoundError extends BaseError {
  constructor(
    message: string,
    code = "NOT_FOUND_ERROR",
    severity = ErrorSeverity.LOW,
    statusCode = 404,
    metadata?: Record<string, any>,
    originalError?: unknown,
  ) {
    super(message, code, severity, statusCode, metadata, originalError)
  }
}

export class ExternalServiceError extends BaseError {
  constructor(
    message: string,
    code = "EXTERNAL_SERVICE_ERROR",
    severity = ErrorSeverity.HIGH,
    statusCode = 502,
    metadata?: Record<string, any>,
    originalError?: unknown,
  ) {
    super(message, code, severity, statusCode, metadata, originalError)
  }
}

export class ConfigurationError extends BaseError {
  constructor(
    message: string,
    code = "CONFIGURATION_ERROR",
    severity = ErrorSeverity.HIGH,
    statusCode = 500,
    metadata?: Record<string, any>,
    originalError?: unknown,
  ) {
    super(message, code, severity, statusCode, metadata, originalError)
  }
}

// Type Guards
export function isAppError(error: unknown): error is AppError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "severity" in error &&
    "statusCode" in error &&
    "message" in error
  )
}

// Error Factory
export const ErrorFactory = {
  createApiError(message: string, statusCode = 500, metadata?: Record<string, any>, originalError?: unknown): ApiError {
    return new ApiError(message, "API_ERROR", ErrorSeverity.MEDIUM, statusCode, metadata, originalError)
  },

  createValidationError(message: string, metadata?: Record<string, any>, originalError?: unknown): ValidationError {
    return new ValidationError(message, "VALIDATION_ERROR", ErrorSeverity.LOW, 400, metadata, originalError)
  },

  createAuthError(
    message = "Authentication required",
    metadata?: Record<string, any>,
    originalError?: unknown,
  ): AuthError {
    return new AuthError(message, "AUTH_ERROR", ErrorSeverity.MEDIUM, 401, metadata, originalError)
  },

  createNotFoundError(
    message = "Resource not found",
    metadata?: Record<string, any>,
    originalError?: unknown,
  ): NotFoundError {
    return new NotFoundError(message, "NOT_FOUND_ERROR", ErrorSeverity.LOW, 404, metadata, originalError)
  },

  createExternalServiceError(message: string, service?: string, originalError?: unknown): ExternalServiceError {
    return new ExternalServiceError(
      message,
      "EXTERNAL_SERVICE_ERROR",
      ErrorSeverity.HIGH,
      502,
      { service },
      originalError,
    )
  },

  createConfigurationError(
    message: string,
    metadata?: Record<string, any>,
    originalError?: unknown,
  ): ConfigurationError {
    return new ConfigurationError(message, "CONFIGURATION_ERROR", ErrorSeverity.HIGH, 500, metadata, originalError)
  },

  fromUnknown(error: unknown, defaultMessage = "An unknown error occurred"): AppError {
    if (isAppError(error)) {
      return error
    }

    if (error instanceof BaseError) {
      return error
    }

    if (error instanceof Error) {
      return new BaseError(error.message, "UNKNOWN_ERROR", ErrorSeverity.MEDIUM, 500, {}, error)
    }

    if (typeof error === "string") {
      return new BaseError(error, "STRING_ERROR", ErrorSeverity.LOW, 500)
    }

    return new BaseError(defaultMessage, "UNKNOWN_ERROR", ErrorSeverity.MEDIUM, 500, {}, error)
  },
}

// Error Formatting
export function formatError(error: unknown, metadata: Record<string, any> = {}): AppError {
  if (isAppError(error)) {
    return {
      ...error,
      metadata: { ...error.metadata, ...metadata },
    }
  }

  const appError = ErrorFactory.fromUnknown(error)

  return {
    ...appError,
    metadata: { ...appError.metadata, ...metadata },
  }
}

// User-Friendly Messages
export function getUserFriendlyErrorMessage(error: unknown): string {
  const errorObj = formatError(error)

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

// Error Reporting
export function shouldReportErrorToUser(error: unknown): boolean {
  const errorObj = formatError(error)
  return [ErrorSeverity.MEDIUM, ErrorSeverity.HIGH, ErrorSeverity.CRITICAL].includes(errorObj.severity)
}

// Status Code Extraction
export function getErrorStatusCode(error: unknown): number {
  const errorObj = formatError(error)
  return errorObj.statusCode || 500
}

// Error Logging
export function logDetailedError(error: unknown, metadata: Record<string, any> = {}): void {
  const errorObj = formatError(error, metadata)

  switch (errorObj.severity) {
    case ErrorSeverity.CRITICAL:
    case ErrorSeverity.HIGH:
      console.error("[ERROR]", JSON.stringify(errorObj, null, 2))
      break
    case ErrorSeverity.MEDIUM:
      console.warn("[WARNING]", JSON.stringify(errorObj, null, 2))
      break
    case ErrorSeverity.LOW:
    default:
      console.info("[INFO]", JSON.stringify(errorObj, null, 2))
      break
  }

  if (process.env.NODE_ENV === "production") {
    // Example: sendToErrorTrackingService(errorObj);
  }
}

export function logError(error: unknown, context?: string): void {
  const errorObj = formatError(error)
  const contextPrefix = context ? `[${context}] ` : ""

  console.error(`${contextPrefix}Error: ${errorObj.message}`)

  if (errorObj.originalError instanceof Error && errorObj.originalError.stack) {
    console.error(errorObj.originalError.stack)
  }
}
