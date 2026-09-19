"use client"

import { createContext, useContext, type ReactNode } from "react"
import { logoutUser } from "@/lib/auth"

interface AuthContextType {
  user: null
  isLoading: boolean
  isAuthenticated: boolean
  login: () => Promise<{ user: null; error: string }>
  register: () => Promise<{ user: null; error: string }>
  logout: () => Promise<boolean>
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const portalMessage =
  "Customer accounts are managed in the FieldPortals customer portal — not on this website."

/**
 * Stub provider after mock auth removal.
 * Keeps useAuth() callers from crashing; login/register always fail closed.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const value: AuthContextType = {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    login: async () => ({ user: null, error: portalMessage }),
    register: async () => ({ user: null, error: portalMessage }),
    logout: () => logoutUser(),
    error: null,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
