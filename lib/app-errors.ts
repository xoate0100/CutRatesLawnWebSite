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
  statusCode?: number
}

/**
 * Error for API-related issues
 */
export class ApiError extends Error implements AppError {
  code: string
  severity: ErrorSeverity
  metadata?: Record<string, any>
  originalError?: unknown
  statusCode: number

  constructor(
    message: string,
    code = "API_ERROR",
    severity = ErrorSeverity.MEDIUM,
    statusCode = 500,
    metadata?: Record<string, any>,
    originalError?: unknown,
  ) {
    super(message)
    this.name = "ApiError"
    this.code = code
    this.severity = severity
    this.statusCode = statusCode
    this.metadata = metadata
    this.originalError = originalError
  }
}

/**
 * Error for validation issues
 */
export class ValidationError extends Error implements AppError {
  code: string
  severity: ErrorSeverity
  metadata?: Record<string, any>
  originalError?: unknown
  statusCode: number

  constructor(
    message: string,
    code = "VALIDATION_ERROR",
    severity = ErrorSeverity.LOW,
    statusCode = 400,
    metadata?: Record<string, any>,
  ) {
    super(message)
    this.name = "ValidationError"
    this.code = code
    this.severity = severity
    this.statusCode = statusCode
    this.metadata = metadata
  }
}

/**
 * Error for authentication issues
 */
export class AuthError extends Error implements AppError {
  code: string
  severity: ErrorSeverity
  metadata?: Record<string, any>
  originalError?: unknown
  statusCode: number

  constructor(
    message: string,
    code = "AUTH_ERROR",
    severity = ErrorSeverity.MEDIUM,
    statusCode = 401,
    metadata?: Record<string, any>,
  ) {
    super(message)
    this.name = "AuthError"
    this.code = code
    this.severity = severity
    this.statusCode = statusCode
    this.metadata = metadata
  }
}

/**
 * Error for resources that cannot be found
 */
export class NotFoundError extends Error implements AppError {
  code: string
  severity: ErrorSeverity
  metadata?: Record<string, any>
  originalError?: unknown
  statusCode: number

  constructor(
    message: string,
    code = "NOT_FOUND_ERROR",
    severity = ErrorSeverity.LOW,
    statusCode = 404,
    metadata?: Record<string, any>,
  ) {
    super(message)
    this.name = "NotFoundError"
    this.code = code
    this.severity = severity
    this.statusCode = statusCode
    this.metadata = metadata
  }
}

/**
 * Error for external service failures
 */
export class ExternalServiceError extends Error implements AppError {
  code: string
  severity: ErrorSeverity
  metadata?: Record<string, any>
  originalError?: unknown
  statusCode: number

  constructor(
    message: string,
    code = "EXTERNAL_SERVICE_ERROR",
    severity = ErrorSeverity.HIGH,
    statusCode = 502,
    metadata?: Record<string, any>,
    originalError?: unknown,
  ) {
    super(message)
    this.name = "ExternalServiceError"
    this.code = code
    this.severity = severity
    this.statusCode = statusCode
    this.metadata = metadata
    this.originalError = originalError
  }
}

/**
 * Error for configuration issues
 */
export class ConfigurationError extends Error implements AppError {
  code: string
  severity: ErrorSeverity
  metadata?: Record<string, any>
  originalError?: unknown
  statusCode: number

  constructor(
    message: string,
    code = "CONFIGURATION_ERROR",
    severity = ErrorSeverity.HIGH,
    statusCode = 500,
    metadata?: Record<string, any>,
  ) {
    super(message)
    this.name = "ConfigurationError"
    this.code = code
    this.severity = severity
    this.statusCode = statusCode
    this.metadata = metadata
  }
}
