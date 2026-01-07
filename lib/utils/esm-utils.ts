/**
 * Utilities for handling ESM-specific issues
 */

/**
 * Converts a relative path to an absolute path using the base URL
 * This is useful for ESM imports that require absolute paths
 */
export function toAbsolutePath(relativePath: string, baseUrl = "/"): string {
  // Remove leading ./ if present
  const cleanPath = relativePath.startsWith("./") ? relativePath.substring(2) : relativePath

  // Ensure baseUrl ends with a slash
  const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`

  // Combine the paths
  return `${normalizedBaseUrl}${cleanPath}`
}

/**
 * Safely resolves a module specifier in an ESM context
 * This is a wrapper around import() that handles common ESM resolution errors
 */
export async function safeResolveModule<T>(specifier: string, fallback: T, baseUrl?: string): Promise<T> {
  try {
    // If it's a relative path and we have a baseUrl, convert to absolute
    const resolvedSpecifier = specifier.startsWith("./") && baseUrl ? toAbsolutePath(specifier, baseUrl) : specifier

    // Dynamic import with the resolved specifier
    return (await import(resolvedSpecifier)) as T
  } catch (error) {
    console.error(`Failed to resolve module: ${specifier}`, error)
    return fallback
  }
}

/**
 * Creates a module resolver function for a specific base URL
 */
export function createModuleResolver<T>(baseUrl: string, fallback: T) {
  return (specifier: string) => safeResolveModule(specifier, fallback, baseUrl)
}
