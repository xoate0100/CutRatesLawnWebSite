/**
 * Environment variable configuration
 */
interface EnvConfig {
  name: string
  required: boolean
  defaultValue?: string
  description: string
}

/**
 * Environment variable validation result
 */
interface EnvValidationResult {
  valid: boolean
  missing: string[]
  warnings: string[]
}

/**
 * Configuration for required and optional environment variables
 */
const ENV_CONFIG: EnvConfig[] = [
  {
    name: "STRAPI_API_URL",
    required: true,
    description: "URL of the Strapi API",
  },
  {
    name: "STRAPI_API_TOKEN",
    required: true,
    description: "Authentication token for the Strapi API",
  },
  {
    name: "NEXT_PUBLIC_STRAPI_API_URL",
    required: false,
    defaultValue: process.env.STRAPI_API_URL,
    description: "Public URL of the Strapi API (defaults to STRAPI_API_URL)",
  },
]

/**
 * Validates environment variables based on the configuration
 * @returns Validation result with status and missing variables
 */
export function validateEnv(): EnvValidationResult {
  const missing: string[] = []
  const warnings: string[] = []

  for (const config of ENV_CONFIG) {
    const value = process.env[config.name]

    if (!value) {
      if (config.required) {
        missing.push(config.name)
      } else if (config.defaultValue) {
        process.env[config.name] = config.defaultValue
        warnings.push(`${config.name} not set, using default value`)
      } else {
        warnings.push(`${config.name} not set (optional)`)
      }
    }
  }

  return {
    valid: missing.length === 0,
    missing,
    warnings,
  }
}

/**
 * Gets an environment variable with a fallback value
 * @param name - The name of the environment variable
 * @param fallback - Fallback value if the environment variable is not set
 * @returns The environment variable value or fallback
 */
export function getEnv(name: string, fallback = ""): string {
  return process.env[name] || fallback
}

/**
 * Checks if all required environment variables are set
 * @returns True if all required environment variables are set, false otherwise
 */
export function checkRequiredEnv(): boolean {
  const { valid, missing } = validateEnv()

  if (!valid) {
    console.error("Missing required environment variables:", missing.join(", "))
    return false
  }

  return true
}

/**
 * Initializes environment variables with default values
 */
export function initEnv(): void {
  const { warnings } = validateEnv()

  if (warnings.length > 0) {
    console.warn("Environment variable warnings:", warnings.join(", "))
  }
}
