"use client"

// Make sure we're importing from the correct paths
import type React from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, AlertTriangle, Info } from "lucide-react"

export type FallbackType = "loading" | "error" | "empty"

interface FallbackUIProps {
  type: FallbackType
  title?: string
  message?: string
  error?: unknown
  onRetry?: () => void
  children?: React.ReactNode
}

export function FallbackUI({ type, title, message, error, onRetry, children }: FallbackUIProps) {
  // Default messages based on type
  const defaultTitle = {
    loading: "Loading...",
    error: "Something went wrong",
    empty: "No data available",
  }

  const defaultMessage = {
    loading: "Please wait while we load the data.",
    error: "We encountered an error while loading the data. Please try again.",
    empty: "There is no data available for this request.",
  }

  // Icon based on type
  const Icon = {
    loading: Loader2,
    error: AlertTriangle,
    empty: Info,
  }[type]

  // Icon color based on type
  const iconColor = {
    loading: "text-blue-500",
    error: "text-red-500",
    empty: "text-gray-500",
  }[type]

  return (
    <Card className="w-full max-w-md mx-auto my-4">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon className={`mr-2 h-5 w-5 ${iconColor} ${type === "loading" ? "animate-spin" : ""}`} />
          {title || defaultTitle[type]}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{message || defaultMessage[type]}</p>

        {type === "error" && error && process.env.NODE_ENV !== "production" && (
          <div className="bg-gray-100 p-3 rounded text-xs font-mono overflow-auto max-h-40">
            {error instanceof Error ? error.message : String(error)}
          </div>
        )}

        {children}
      </CardContent>

      {type === "error" && onRetry && (
        <CardFooter>
          <Button onClick={onRetry} className="w-full">
            Try again
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

/**
 * Loading fallback component
 */
export function LoadingFallback({ message }: { message?: string }) {
  return <FallbackUI type="loading" message={message} />
}

/**
 * Error fallback component
 */
export function ErrorFallback({
  error,
  onRetry,
  message,
}: {
  error: unknown
  onRetry?: () => void
  message?: string
}) {
  return <FallbackUI type="error" error={error} onRetry={onRetry} message={message} />
}

/**
 * Empty state fallback component
 */
export function EmptyFallback({ message }: { message?: string }) {
  return <FallbackUI type="empty" message={message} />
}
