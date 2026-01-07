import type { UserType } from "./types"

// Auth-related types
export interface AuthResponse {
  user: UserType | null
  token?: string
  error?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface ResetPasswordData {
  email: string
}

export interface UpdatePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// Auth token management
const AUTH_TOKEN_KEY = "cut_rates_auth_token"

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function removeAuthToken(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

// Auth API functions
export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    // For Phase 3 preparation, we'll simulate the API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Mock successful login
    if (credentials.email === "user@example.com" && credentials.password === "password") {
      const user: UserType = {
        id: "1",
        email: credentials.email,
        firstName: "John",
        lastName: "Doe",
        role: "user",
        createdAt: new Date().toISOString(),
        properties: [
          {
            id: "1",
            address: "123 Main St",
            city: "Valley Center",
            state: "KS",
            zipCode: "67147",
            size: "0.25 acres",
            type: "residential",
          },
        ],
      }

      const token = "mock-jwt-token"
      setAuthToken(token)

      return {
        user,
        token,
      }
    }

    // Mock failed login
    return {
      user: null,
      error: "Invalid email or password",
    }
  } catch (error) {
    return handleAuthError(error, "Login failed")
  }
}

export async function registerUser(data: RegisterData): Promise<AuthResponse> {
  try {
    // For Phase 3 preparation, we'll simulate the API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock successful registration
    const user: UserType = {
      id: "2",
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: "user",
      createdAt: new Date().toISOString(),
    }

    const token = "mock-jwt-token"
    setAuthToken(token)

    return {
      user,
      token,
    }
  } catch (error) {
    return handleAuthError(error, "Registration failed")
  }
}

export async function getCurrentUser(): Promise<UserType | null> {
  try {
    const token = getAuthToken()
    if (!token) return null

    // For Phase 3 preparation, we'll simulate the API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock user data
    return {
      id: "1",
      email: "user@example.com",
      firstName: "John",
      lastName: "Doe",
      role: "user",
      createdAt: new Date().toISOString(),
      properties: [
        {
          id: "1",
          address: "123 Main St",
          city: "Valley Center",
          state: "KS",
          zipCode: "67147",
          size: "0.25 acres",
          type: "residential",
        },
      ],
    }
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function logoutUser(): Promise<boolean> {
  try {
    // For Phase 3 preparation, we'll simulate the API call
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Remove the token
    removeAuthToken()

    return true
  } catch (error) {
    console.error("Logout error:", error)
    return false
  }
}

export async function resetPassword(data: ResetPasswordData): Promise<{ success: boolean; message: string }> {
  try {
    // For Phase 3 preparation, we'll simulate the API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    return {
      success: true,
      message: "Password reset instructions have been sent to your email",
    }
  } catch (error) {
    console.error("Reset password error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred while resetting your password",
    }
  }
}

export async function updatePassword(data: UpdatePasswordData): Promise<{ success: boolean; message: string }> {
  try {
    // For Phase 3 preparation, we'll simulate the API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Validate passwords match
    if (data.newPassword !== data.confirmPassword) {
      return {
        success: false,
        message: "New password and confirmation do not match",
      }
    }

    return {
      success: true,
      message: "Password updated successfully",
    }
  } catch (error) {
    console.error("Update password error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred while updating your password",
    }
  }
}

// Helper function to handle auth errors
function handleAuthError(error: unknown, defaultMessage: string): AuthResponse {
  console.error(defaultMessage, error)
  return {
    user: null,
    error: error instanceof Error ? error.message : defaultMessage,
  }
}
