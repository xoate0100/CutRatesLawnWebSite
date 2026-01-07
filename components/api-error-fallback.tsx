"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

interface ApiErrorFallbackProps {
  error: Error
  onRetry?: () => void
}

export function ApiErrorFallback({ error, onRetry }: ApiErrorFallbackProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
      <div className="flex justify-center mb-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
      </div>
      <h3 className="text-lg font-medium text-red-800 mb-2">Unable to load content</h3>
      <p className="text-red-600 mb-4">
        {error.message || "There was an error loading the content. Please try again later."}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  )
}
