"use client"

import type React from "react"

export function SimplifiedErrorBoundary({ children }: { children: React.ReactNode }) {
  console.log("SimplifiedErrorBoundary rendering")

  return (
    <>
      <div className="bg-orange-100 p-2 text-center">
        <p>SimplifiedErrorBoundary - If you see this, the ErrorBoundary is rendering</p>
      </div>
      {children}
    </>
  )
}
