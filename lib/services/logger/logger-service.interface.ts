/**
 * Log levels
 */
export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

/**
 * Interface for logger service
 */
export interface LoggerService {
  /**
   * Log a debug message
   */
  debug(message: string, ...args: any[]): void

  /**
   * Log an info message
   */
  info(message: string, ...args: any[]): void

  /**
   * Log a warning message
   */
  warn(message: string, ...args: any[]): void

  /**
   * Log an error message
   */
  error(message: string, ...args: any[]): void

  /**
   * Set the minimum log level
   */
  setLevel(level: LogLevel): void
}

/**
 * Service token for DI container
 */
export const LOGGER_SERVICE_TOKEN = "LoggerService"
