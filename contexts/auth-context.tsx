"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { UserType } from "@/lib/types"
import {
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser,
  type LoginCredentials,
  type RegisterData,
  type AuthResponse,
} from "@/lib/auth"

interface AuthContextType {
  user: UserType | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<AuthResponse>
  register: (data: RegisterData) => Promise<AuthResponse>
  logout: () => Promise<boolean>
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (err) {
        console.error("Error checking auth status:", err)
        setError(err instanceof Error ? err.message : "Authentication error")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await loginUser(credentials)

      if (response.user) {
        setUser(response.user)
      } else if (response.error) {
        setError(response.error)
      }

      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed"
      setError(errorMessage)
      return { user: null, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterData): Promise<AuthResponse> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await registerUser(data)

      if (response.user) {
        setUser(response.user)
      } else if (response.error) {
        setError(response.error)
      }

      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Registration failed"
      setError(errorMessage)
      return { user: null, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<boolean> => {
    setIsLoading(true)

    try {
      const success = await logoutUser()

      if (success) {
        setUser(null)
      }

      return success
    } catch (err) {
      console.error("Logout error:", err)
      setError(err instanceof Error ? err.message : "Logout failed")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
