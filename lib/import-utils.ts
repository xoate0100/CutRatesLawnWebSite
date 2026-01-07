/**
 * Safely imports a module and handles any import errors
 * @param importFn - The import function to execute
 * @param fallback - Fallback value to return if import fails
 * @returns The imported module or fallback value
 */
export async function safeImport<T>(importFn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await importFn()
  } catch (error) {
    console.error("Import error:", error)
    return fallback
  }
}

/**
 * Safely requires a module and handles any require errors
 * @param requirePath - The path to the module to require
 * @param fallback - Fallback value to return if require fails
 * @returns The required module or fallback value
 */
export function safeRequire<T>(requirePath: string, fallback: T): T {
  try {
    // Using dynamic import to avoid issues with ESM
    const module = require(requirePath)
    return module as T
  } catch (error) {
    console.error(`Error requiring module ${requirePath}:`, error)
    return fallback
  }
}

/**
 * Checks if a module exists and can be imported
 * @param modulePath - The path to the module to check
 * @returns True if the module exists and can be imported, false otherwise
 */
export async function moduleExists(modulePath: string): Promise<boolean> {
  try {
    await import(modulePath)
    return true
  } catch (error) {
    return false
  }
}

/**
 * Safely gets a property from an object, handling undefined and null values
 * @param obj - The object to get the property from
 * @param path - The path to the property, using dot notation
 * @param fallback - Fallback value to return if the property doesn't exist
 * @returns The property value or fallback value
 */
export function safeGet<T>(obj: any, path: string, fallback: T): T {
  if (!obj) return fallback

  const keys = path.split(".")
  let result = obj

  for (const key of keys) {
    if (result === undefined || result === null) {
      return fallback
    }
    result = result[key]
  }

  return result === undefined || result === null ? fallback : (result as T)
}
