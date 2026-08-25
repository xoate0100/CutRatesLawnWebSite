import type React from "react"
import { SimplifiedErrorBoundary } from "@/components/simplified-error-boundary"

/**
 * Nested debug layout only — do NOT import globals.css here.
 * A second globals import caused Next to attach the full Tailwind CSS
 * chunk to /test-layout only, leaving the root layout with fonts-only CSS.
 */
export default function TestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SimplifiedErrorBoundary>
      <div className="flex min-h-screen flex-col">
        <div className="bg-red-100 p-2 text-center text-sm">
          <p>Test Layout - If you see this, the test layout is rendering</p>
        </div>
        <div className="flex-grow">{children}</div>
        <div className="bg-red-100 p-2 text-center text-sm">
          <p>Test Layout Footer - If you see this, the test layout is rendering</p>
        </div>
      </div>
    </SimplifiedErrorBoundary>
  )
}
