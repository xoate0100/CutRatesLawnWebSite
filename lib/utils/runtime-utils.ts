/**
 * Check if code is running on the server
 */
export function isServer(): boolean {
  return typeof window === "undefined"
}

/**
 * Check if code is running on the client
 */
export function isClient(): boolean {
  return !isServer()
}

/**
 * Execute a function only on the server
 */
export function runOnServer<T>(serverFn: () => T, clientFallback?: () => T): T | undefined {
  if (isServer()) {
    return serverFn()
  }

  return clientFallback ? clientFallback() : undefined
}

/**
 * Execute a function only on the client
 */
export function runOnClient<T>(clientFn: () => T, serverFallback?: () => T): T | undefined {
  if (isClient()) {
    return clientFn()
  }

  return serverFallback ? serverFallback() : undefined
}
