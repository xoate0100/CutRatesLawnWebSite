"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function SimpleApiTestPage() {
  const [results, setResults] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const testEndpoints = ["/api/simple", "/api/test", "/api/html"]

  const testEndpoint = async (url: string) => {
    setLoading((prev) => ({ ...prev, [url]: true }))
    setErrors((prev) => ({ ...prev, [url]: "" }))

    try {
      const response = await fetch(url)
      const text = await response.text()

      setResults((prev) => ({
        ...prev,
        [url]: `Status: ${response.status}, Body: ${text.substring(0, 100)}${text.length > 100 ? "..." : ""}`,
      }))
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        [url]: err instanceof Error ? err.message : "Unknown error",
      }))
    } finally {
      setLoading((prev) => ({ ...prev, [url]: false }))
    }
  }

  const testAll = () => {
    testEndpoints.forEach((endpoint) => testEndpoint(endpoint))
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Simple API Tests</h1>

      <Button onClick={testAll} className="mb-6">
        Test All Endpoints
      </Button>

      <div className="space-y-6">
        {testEndpoints.map((endpoint) => (
          <div key={endpoint} className="border rounded p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-medium">{endpoint}</h2>
              <Button onClick={() => testEndpoint(endpoint)} disabled={loading[endpoint]} size="sm">
                {loading[endpoint] ? "Testing..." : "Test"}
              </Button>
            </div>

            {errors[endpoint] && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-2">
                <p className="font-medium">Error:</p>
                <p>{errors[endpoint]}</p>
              </div>
            )}

            {results[endpoint] && (
              <div className="bg-gray-50 p-3 rounded border">
                <pre className="whitespace-pre-wrap text-sm">{results[endpoint]}</pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
