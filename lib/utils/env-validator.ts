import { ErrorFactory } from "@/lib/errors/factory"

/**
 * Validates that required environment variables are present
 */
export function validateEnvironmentVariables(requiredVars: string[]): void {
  const missingVars = requiredVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    throw ErrorFactory.createConfigurationError(`Missing required environment variables: ${missingVars.join(", ")}`, {
      missingVars,
    })
  }
}

/**
 * Gets an environment variable with validation
 */
export function getRequiredEnv(name: string): string {
  const value = process.env[name]

  if (!value) {
    throw ErrorFactory.createConfigurationError(`Missing required environment variable: ${name}`)
  }

  return value
}

/**
 * Gets an environment variable with a default value
 */
export function getEnv(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue
}
