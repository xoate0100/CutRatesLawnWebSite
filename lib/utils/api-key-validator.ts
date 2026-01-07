"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Function to validate Google API key format
export function isValidGoogleApiKeyFormat(apiKey: string): boolean {
  // Basic check for API key format (e.g., AIza...)
  return /^AIza[A-Za-z0-9_-]{35}$/.test(apiKey)
}

// Function to validate Google Place ID format
export function isValidGooglePlaceIdFormat(placeId: string): boolean {
  // Google Place IDs are base64 encoded strings
  // This regex checks for a minimum length and valid characters
  return /^[A-Za-z0-9_-]{20,}$/.test(placeId)
}

export default function DebugPage() {
  const [diagnosticData, setDiagnosticData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runDiagnostics = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api-debug")

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }

      const data = await response.json()
      setDiagnosticData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">API Diagnostics</h1>

      <div className="mb-6">
        <Button onClick={runDiagnostics} disabled={loading}>
          {loading ? "Running Diagnostics..." : "Run API Diagnostics"}
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      {diagnosticData && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
              <CardDescription>Checking if your API keys are properly set</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div className="grid grid-cols-3 gap-4">
                  <dt className="font-semibold">API Key Exists:</dt>
                  <dd className="col-span-2">{diagnosticData.diagnostics.apiKeyExists ? "✅ Yes" : "❌ No"}</dd>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <dt className="font-semibold">API Key Length:</dt>
                  <dd className="col-span-2">{diagnosticData.diagnostics.apiKeyLength} characters</dd>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <dt className="font-semibold">API Key Preview:</dt>
                  <dd className="col-span-2">{diagnosticData.diagnostics.apiKeyFirstFive}</dd>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <dt className="font-semibold">Place ID Exists:</dt>
                  <dd className="col-span-2">{diagnosticData.diagnostics.placeIdExists ? "✅ Yes" : "❌ No"}</dd>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <dt className="font-semibold">Place ID Value:</dt>
                  <dd className="col-span-2">{diagnosticData.diagnostics.placeIdValue}</dd>
                </div>
              </dl>
            </CardContent>
            <CardFooter>{/* You can add a footer here if needed */}</CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
