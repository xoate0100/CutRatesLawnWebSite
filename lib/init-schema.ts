import { enhanceSchemaDiscovery } from "./schema-validator"
import { initializeSchemaDiscovery } from "./schema-discovery"

/**
 * Initializes the schema validation and discovery
 * This should be called during app initialization
 */
export function initializeSchema() {
  // Initialize schema discovery
  initializeSchemaDiscovery()

  // Enhance with validated schema
  if (typeof window !== "undefined") {
    // Use setTimeout to delay enhancement until after initial render
    setTimeout(() => {
      enhanceSchemaDiscovery()
    }, 1000)
  }
}

// Auto-initialize in development mode
if (process.env.NODE_ENV === "development") {
  initializeSchema()
}
