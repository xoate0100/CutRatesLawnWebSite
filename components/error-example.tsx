"use client"

import { useState } from "react"
import { ErrorFactory, logDetailedError, getUserFriendlyErrorMessage } from "@/lib/errors/consolidated"

export function ErrorExample() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleApiErrorClick = () => {
    try {
      // Simulate an API error
      throw ErrorFactory.createApiError("Failed to fetch data from API", 500)
    } catch (error) {
      // Log the detailed error (would go to console and monitoring in production)
      logDetailedError(error, { component: "ErrorExample", action: "handleApiErrorClick" })

      // Show a user-friendly message
      setErrorMessage(getUserFriendlyErrorMessage(error))
    }
  }

  const handleValidationErrorClick = () => {
    try {
      // Simulate a validation error
      throw ErrorFactory.createValidationError("Invalid email format")
    } catch (error) {
      // Log the detailed error
      logDetailedError(error, { component: "ErrorExample", action: "handleValidationErrorClick" })

      // Show a user-friendly message
      setErrorMessage(getUserFriendlyErrorMessage(error))
    }
  }

  const handleUnknownErrorClick = () => {
    try {
      // Simulate an unknown error
      throw new Error("Something unexpected happened")
    } catch (error) {
      // Log the detailed error
      logDetailedError(error, { component: "ErrorExample", action: "handleUnknownErrorClick" })

      // Show a user-friendly message
      setErrorMessage(getUserFriendlyErrorMessage(error))
    }
  }

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Error Handling Example</h2>

      <div className="flex flex-col gap-2 mb-4">
        <button onClick={handleApiErrorClick} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Simulate API Error
        </button>

        <button
          onClick={handleValidationErrorClick}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Simulate Validation Error
        </button>

        <button
          onClick={handleUnknownErrorClick}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Simulate Unknown Error
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-100 border border-red-300 rounded-lg">
          <p className="text-red-700">{errorMessage}</p>
          <button
            onClick={() => setErrorMessage(null)}
            className="mt-2 px-2 py-1 text-sm bg-red-200 text-red-700 rounded hover:bg-red-300"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  )
}
