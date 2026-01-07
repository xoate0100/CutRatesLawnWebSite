import {
  type AppError,
  BaseError,
  ApiError,
  ValidationError,
  AuthError,
  NotFoundError,
  ExternalServiceError,
  ConfigurationError,
  ErrorSeverity,
  isAppError,
} from "@/lib/errors/types"

/**
 * Error factory for creating application errors
 */
export const ErrorFactory = {
  /**
   * Creates an API error
   */
  createApiError(message: string, statusCode = 500, metadata?: Record<string, any>, originalError?: unknown): ApiError {
    return new ApiError(message, "API_ERROR", ErrorSeverity.MEDIUM, statusCode, metadata, originalError)
  },

  /**
   * Creates a validation error
   */
  createValidationError(message: string, metadata?: Record<string, any>, originalError?: unknown): ValidationError {
    return new ValidationError(message, "VALIDATION_ERROR", ErrorSeverity.LOW, 400, metadata, originalError)
  },

  /**
   * Creates an authentication error
   */
  createAuthError(
    message = "Authentication required",
    metadata?: Record<string, any>,
    originalError?: unknown,
  ): AuthError {
    return new AuthError(message, "AUTH_ERROR", ErrorSeverity.MEDIUM, 401, metadata, originalError)
  },

  /**
   * Creates a not found error
   */
  createNotFoundError(
    message = "Resource not found",
    metadata?: Record<string, any>,
    originalError?: unknown,
  ): NotFoundError {
    return new NotFoundError(message, "NOT_FOUND_ERROR", ErrorSeverity.LOW, 404, metadata, originalError)
  },

  /**
   * Creates an external service error
   */
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

  /**
   * Creates a configuration error
   */
  createConfigurationError(
    message: string,
    metadata?: Record<string, any>,
    originalError?: unknown,
  ): ConfigurationError {
    return new ConfigurationError(message, "CONFIGURATION_ERROR", ErrorSeverity.HIGH, 500, metadata, originalError)
  },

  /**
   * Creates a generic error from an unknown error
   */
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
