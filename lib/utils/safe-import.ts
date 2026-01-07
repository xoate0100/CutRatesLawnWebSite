/**
 * Safely imports a module with error handling
 * This is useful for dynamic imports that might fail
 */
export async function safeImport<T>(
  importFn: () => Promise<T>,
  fallback: T,
  errorHandler?: (error: unknown) => void,
): Promise<T> {
  try {
    return await importFn()
  } catch (error) {
    if (errorHandler) {
      errorHandler(error)
    } else {
      console.error("Error importing module:", error)
    }
    return fallback
  }
}

/**
 * Creates a safe import function for a specific module
 */
export function createSafeImporter<T>(fallback: T, errorHandler?: (error: unknown) => void) {
  return (importFn: () => Promise<T>) => safeImport(importFn, fallback, errorHandler)
}
