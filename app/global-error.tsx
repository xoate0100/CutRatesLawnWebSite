"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

/**
 * Root layout error boundary — must define its own <html> and <body>.
 * Optional: wire Sentry (or similar) here when NEXT_PUBLIC_SENTRY_DSN is set.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Unhandled root error", error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen items-center justify-center bg-paper p-6">
          <div className="max-w-md text-center">
            <h1 className="font-display text-2xl font-bold text-forest">Something went wrong</h1>
            <p className="mt-3 text-sm text-sage">
              We hit an unexpected error. Try again, or call us if it keeps happening.
            </p>
            {error.digest ? (
              <p className="mt-2 text-xs text-sage/80">Ref: {error.digest}</p>
            ) : null}
            <Button type="button" className="mt-6" onClick={reset}>
              Try again
            </Button>
          </div>
        </div>
      </body>
    </html>
  )
}
