"use client"

import { createContext, useContext, type ReactNode } from "react"

// Define the shape of our application context
type AppContextType = {
  logger: {
    error: (message: string, error?: any) => void
    warn: (message: string, data?: any) => void
    info: (message: string, data?: any) => void
  }
  // Add other services as needed
}

// Create a default context value
const defaultContext: AppContextType = {
  logger: {
    error: (message, error) => console.error(message, error),
    warn: (message, data) => console.warn(message, data),
    info: (message, data) => console.info(message, data),
  },
}

// Create the context
const AppContext = createContext<AppContextType>(defaultContext)

// Create a provider component
export function AppProvider({ children }: { children: ReactNode }) {
  // We're using the default context for simplicity
  // In a real app, you would initialize services here
  return <AppContext.Provider value={defaultContext}>{children}</AppContext.Provider>
}

// Create a hook to use the context
export function useAppContext() {
  return useContext(AppContext)
}

// Create specific hooks for each service
export function useLogger() {
  const { logger } = useAppContext()
  return logger
}
