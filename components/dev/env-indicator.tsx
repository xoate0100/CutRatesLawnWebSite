"use client"

import { useState, useEffect } from "react"
import { isDevelopment } from "@/lib/utils/env"

export function EnvIndicator() {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [envVars, setEnvVars] = useState<Record<string, string>>({})

  useEffect(() => {
    // Only show in development
    if (!isDevelopment()) return

    setIsVisible(true)

    // Get environment variables
    const vars: Record<string, string> = {}

    // Get from process.env (server-side)
    if (typeof process !== "undefined" && process.env) {
      Object.entries(process.env).forEach(([key, value]) => {
        if (key.startsWith("NEXT_") || key.startsWith("STRAPI_")) {
          vars[key] = value || ""
        }
      })
    }

    // Get from window.__ENV__ (client-side)
    if (typeof window !== "undefined" && window.__ENV__) {
      Object.entries(window.__ENV__).forEach(([key, value]) => {
        vars[key] = value as string
      })
    }

    setEnvVars(vars)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`bg-yellow-100 border border-yellow-400 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${
          isExpanded ? "max-h-96 w-80" : "max-h-10 w-auto"
        }`}
      >
        <div
          className="px-4 py-2 bg-yellow-200 flex justify-between items-center cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="font-medium text-yellow-800">Development Environment</span>
          <span className="text-yellow-800">{isExpanded ? "▼" : "▲"}</span>
        </div>

        {isExpanded && (
          <div className="p-4 overflow-auto max-h-80">
            <h3 className="font-medium mb-2">Environment Variables:</h3>
            <div className="space-y-1">
              {Object.keys(envVars).length > 0 ? (
                Object.entries(envVars).map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <span className="font-mono text-gray-700">{key}:</span>{" "}
                    <span className="font-mono text-gray-900">
                      {key.includes("TOKEN") || key.includes("KEY")
                        ? value
                          ? "********"
                          : "<not set>"
                        : value || "<not set>"}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No environment variables found</p>
              )}
            </div>

            <div className="mt-4 pt-2 border-t border-yellow-200">
              <button
                onClick={() => {
                  localStorage.clear()
                  window.location.reload()
                }}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Clear Stored Variables
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
