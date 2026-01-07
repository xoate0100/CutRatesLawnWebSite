"use client"

import { useState } from "react"
import { ErrorFactory, logDetailedError } from "@/lib/errors"

export function ExampleErrorHandling() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleApiError = async () => {
    try {
      // Simulate an API error
      throw ErrorFactory.createApiError("Failed to fetch data from API", 500)
    } catch (error) {
      logDetailedError(error, { component: "ExampleErrorHandling" })
      setErrorMessage("There was a problem with our service. Please try again later.")
    }
  }

  const handleValidationError = () => {
    try {
      // Simulate a validation error
      throw ErrorFactory.createValidationError("Invalid email format", { field: "email" })
    } catch (error) {
      logDetailedError(error, { component: "ExampleErrorHandling" })
      setErrorMessage("Please check your input and try again.")
    }
  }

  const handleUnknownError = () => {
    try {
      // Simulate an unknown error
      throw new Error("Something unexpected happened")
    } catch (error) {
      logDetailedError(error, { component: "ExampleErrorHandling" })
      setErrorMessage("Something went wrong. Please try again later.")
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Error Handling Examples</h2>

      <div className="flex space-x-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleApiError}>
          Trigger API Error
        </button>

        <button
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          onClick={handleValidationError}
        >
          Trigger Validation Error
        </button>

        <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={handleUnknownError}>
          Trigger Unknown Error
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{errorMessage}</p>
          <button className="mt-2 text-sm text-red-600 hover:text-red-800" onClick={() => setErrorMessage(null)}>
            Dismiss
          </button>
        </div>
      )}
    </div>
  )
}
