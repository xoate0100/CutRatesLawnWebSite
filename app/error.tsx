"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Unhandled application error", error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-paper p-6">
      <div className="max-w-md text-center">
        <h2 className="font-display text-2xl font-bold text-forest">Something went wrong</h2>
        <p className="mt-3 text-sm text-sage">
          We&apos;re sorry — an unexpected error occurred. You can try again.
        </p>
        <Button type="button" className="mt-6" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  )
}
