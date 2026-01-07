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

// Additional utility functions can be added here if needed
