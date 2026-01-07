import { logDetailedError } from "./error-utils"

/**
 * Safely import a module and handle any import errors
 * @param importFn - Function that performs the dynamic import
 * @param fallback - Fallback value to return if import fails
 * @param context - Additional context for error logging
 */
export async function safeImport<T>(
  importFn: () => Promise<T>,
  fallback: T,
  context: Record<string, any> = {},
): Promise<T> {
  try {
    return await importFn()
  } catch (error) {
    logDetailedError("Module import failed", error, {
      ...context,
      type: "import_error",
    })

    console.warn(`Import failed: ${context.moduleName || "Unknown module"}. Using fallback instead.`)

    return fallback
  }
}

/**
 * Check if a module exports a specific function or value
 * @param module - The imported module
 * @param exportName - The name of the export to check
 * @param fallbackFn - Optional fallback function to use if export is missing
 */
export function ensureExport<T>(module: any, exportName: string, fallbackFn?: () => T): T | undefined {
  if (module && typeof module[exportName] !== "undefined") {
    return module[exportName]
  }

  console.warn(`Missing export: ${exportName}. ${fallbackFn ? "Using fallback instead." : ""}`)

  return fallbackFn ? fallbackFn() : undefined
}

/**
 * Create a proxy handler that catches missing property access
 * and provides fallbacks or warnings
 */
export function createMissingExportHandler(moduleName: string, fallbacks: Record<string, any> = {}) {
  return {
    get(target: any, prop: string) {
      // If the property exists on the target, return it
      if (prop in target) {
        return target[prop]
      }

      // If we have a fallback for this property, return it
      if (prop in fallbacks) {
        console.warn(`Using fallback for missing export: ${moduleName}.${prop}`)
        return fallbacks[prop]
      }

      // Log the missing export
      console.warn(`Attempted to access missing export: ${moduleName}.${prop}`)

      // Return a function that logs when called
      return (...args: any[]) => {
        console.error(`Called missing function: ${moduleName}.${prop}`, { args })
        return undefined
      }
    },
  }
}

/**
 * Create a safe module with fallbacks for missing exports
 * @param module - The original module
 * @param moduleName - The name of the module (for logging)
 * @param fallbacks - Fallback values for missing exports
 */
export function createSafeModule<T extends object>(module: T, moduleName: string, fallbacks: Partial<T> = {}): T {
  return new Proxy(module, createMissingExportHandler(moduleName, fallbacks)) as T
}
