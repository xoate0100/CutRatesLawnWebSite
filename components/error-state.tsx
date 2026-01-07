"use client"

import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ErrorStateProps {
  message?: string
  retry?: () => void
  showContactLink?: boolean
  showHomeLink?: boolean
  error?: Error | null
}

export default function ErrorState({
  message = "Something went wrong. Please try again later.",
  retry,
  showContactLink = true,
  showHomeLink = true,
  error = null,
}: ErrorStateProps) {
  // Only show error details in development
  const isDev = process.env.NODE_ENV === "development"

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
      <h2 className="text-xl font-semibold mb-2 text-center">Error</h2>
      <p className="text-gray-600 mb-6 text-center max-w-md">{message}</p>

      <div className="flex flex-wrap gap-4 justify-center">
        {retry && (
          <Button onClick={retry} variant="outline">
            Try Again
          </Button>
        )}

        {showHomeLink && (
          <Link href="/">
            <Button variant="outline">Return Home</Button>
          </Link>
        )}

        {showContactLink && (
          <Link href="/contact">
            <Button>Contact Support</Button>
          </Link>
        )}
      </div>

      {isDev && error && (
        <div className="mt-8 p-4 bg-gray-100 rounded-md w-full max-w-2xl overflow-auto">
          <h3 className="text-sm font-mono font-bold mb-2">Developer Error Details:</h3>
          <pre className="text-xs font-mono whitespace-pre-wrap">
            {error.name}: {error.message}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        </div>
      )}
    </div>
  )
}
