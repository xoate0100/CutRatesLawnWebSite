import { formatError } from "@/lib/errors/formatter"
import { ErrorSeverity } from "@/lib/errors/types"

/**
 * Logs a detailed error with consistent formatting
 */
export function logDetailedError(error: unknown, metadata: Record<string, any> = {}): void {
  const errorObj = formatError(error, metadata)

  // Log to console with appropriate level based on severity
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

  // In production, you might want to send this to an error tracking service
  if (process.env.NODE_ENV === "production") {
    // Example: sendToErrorTrackingService(errorObj);
  }
}

/**
 * Logs an error with minimal details for non-critical errors
 */
export function logError(error: unknown, context?: string): void {
  const errorObj = formatError(error)
  const contextPrefix = context ? `[${context}] ` : ""

  console.error(`${contextPrefix}Error: ${errorObj.message}`)

  if (errorObj.originalError instanceof Error && errorObj.originalError.stack) {
    console.error(errorObj.originalError.stack)
  }
}
