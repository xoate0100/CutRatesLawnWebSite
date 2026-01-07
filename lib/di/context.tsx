"use client"

import { createContext, useContext, type ReactNode } from "react"
import { container } from "./container"

// Create a context for the service container
const ServiceContext = createContext<typeof container | null>(null)

// Export the provider component
export function ServiceProvider({ children }: { children: ReactNode }) {
  return <ServiceContext.Provider value={container}>{children}</ServiceContext.Provider>
}

// Hook for consuming the context
export function useServices() {
  const context = useContext(ServiceContext)
  if (!context) {
    throw new Error("useServices must be used within a ServiceProvider")
  }
  return context
}

// Export a hook for getting a specific service
export function useService<T>(token: symbol): T {
  const services = useServices()
  return services.get<T>(token)
}
