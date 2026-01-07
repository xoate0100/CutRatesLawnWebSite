import {
  AppError,
  ErrorSeverity,
  formatError,
  getUserFriendlyErrorMessage,
  logDetailedError,
  shouldReportErrorToUser,
} from "@/lib/errors/consolidated"

// Re-export everything from the consolidated error module
export { AppError, ErrorSeverity, formatError, getUserFriendlyErrorMessage, logDetailedError, shouldReportErrorToUser }

export function handleApiError(error: unknown, context?: Record<string, any>) {
  const appError = error instanceof AppError ? error : new AppError(String(error), ErrorSeverity.ERROR, context)

  logDetailedError(appError.message, error as Error, context)

  return {
    error: appError,
    message: getUserFriendlyErrorMessage(appError),
    shouldReport: shouldReportErrorToUser(appError),
  }
}
