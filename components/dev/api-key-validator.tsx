"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { isValidGoogleApiKeyFormat, isValidGooglePlaceIdFormat } from "@/lib/utils/api-key-validator"

export default function ApiKeyValidator() {
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

                <div className=
