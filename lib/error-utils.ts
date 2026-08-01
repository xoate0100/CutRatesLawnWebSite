import {
  BaseError,
  ErrorSeverity,
  formatError,
  getUserFriendlyErrorMessage,
  logDetailedError,
  shouldReportErrorToUser,
  type AppError,
} from "@/lib/errors/consolidated"

// Re-export consolidated error helpers
export {
  BaseError,
  ErrorSeverity,
  formatError,
  getUserFriendlyErrorMessage,
  logDetailedError,
  shouldReportErrorToUser,
}
export type { AppError }

export function handleApiError(error: unknown, context?: Record<string, any>) {
  const appError =
    error instanceof BaseError
      ? error
      : new BaseError(String(error), "UNKNOWN_ERROR", ErrorSeverity.HIGH, 500, context, error)

  logDetailedError(appError.message, error as Error, context)

  return {
    error: appError,
    message: getUserFriendlyErrorMessage(appError),
    shouldReport: shouldReportErrorToUser(appError),
  }
}
