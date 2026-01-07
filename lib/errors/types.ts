/**
 * Enum for error severity levels
 */
export enum ErrorSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

/**
 * Base error interface for application errors
 */
export interface AppError {
  message: string
  code: string
  severity: ErrorSeverity
  metadata?: Record<string, any>
  originalError?: unknown
  statusCode: number
}

/**
 * Base error class that all application errors extend
 */
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

/**
 * Error for API-related issues
 */
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

/**
 * Error for validation issues
 */
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

/**
 * Error for authentication issues
 */
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

/**
 * Error for resources that cannot be found
 */
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

/**
 * Error for external service failures
 */
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

/**
 * Error for configuration issues
 */
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

/**
 * Type guard to check if an object is an AppError
 */
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
