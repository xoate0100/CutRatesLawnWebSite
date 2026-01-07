"use client"

import { useEffect, useState } from "react"
import { ENV, isDevelopment } from "@/lib/utils/env"

export function EnvSetup() {
  const [isVisible, setIsVisible] = useState(false)
  const [envVars, setEnvVars] = useState<Record<string, string>>({
    [ENV.STRAPI_API_URL]: "",
    [ENV.STRAPI_API_TOKEN]: "",
  })

  useEffect(() => {
    // Only show in development
    if (!isDevelopment()) return

    // Check if environment variables are set
    const missingVars = Object.keys(envVars).filter((key) => {
      // For client-side, we can only check NEXT_PUBLIC_ vars
      if (typeof window !== "undefined" && !key.startsWith("NEXT_PUBLIC_")) {
        return false
      }

      // @ts-ignore - Window might have env variables injected
      return !process.env[key] && !window.__ENV__?.[key]
    })

    // Show the setup component if any variables are missing
    setIsVisible(missingVars.length > 0)
  }, [])

  const handleChange = (key: string, value: string) => {
    setEnvVars((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    // In development, we can store in localStorage for convenience
    Object.entries(envVars).forEach(([key, value]) => {
      if (value) {
        localStorage.setItem(`env:${key}`, value)
      }
    })

    // Inject into window for client-side access
    if (typeof window !== "undefined") {
      // @ts-ignore - Adding custom property to window
      window.__ENV__ = window.__ENV__ || {}

      Object.entries(envVars).forEach(([key, value]) => {
        if (value) {
          // @ts-ignore - Adding to custom window property
          window.__ENV__[key] = value
        }
      })
    }

    // Hide the setup component
    setIsVisible(false)

    // Reload the page to apply changes
    window.location.reload()
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Development Environment Setup</h2>
        <p className="mb-4 text-gray-600">
          Some environment variables are missing. You can set them here for development purposes. These will be stored
          in your browser's localStorage and won't persist server-side.
        </p>

        <div className="space-y-4">
          {Object.entries(envVars).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{key}</label>
              <input
                type="text"
                value={value}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={`Enter ${key}`}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setIsVisible(false)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Skip (Use Mock Data)
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save & Reload
          </button>
        </div>
      </div>
    </div>
  )
}
