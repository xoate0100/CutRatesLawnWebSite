"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

interface ApiDiagnosticsResult {
  status: "success" | "partial" | "failure"
  apiUrl: string
  tokenValid: boolean
  version?: string
  endpoints: Record<string, boolean>
  errors: Record<string, string>
  recommendations: string[]
}

export function ApiTroubleshooter() {
  const [loading, setLoading] = useState(false)
  const [diagnostics, setDiagnostics] = useState<ApiDiagnosticsResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const runDiagnostics = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/health")

      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (data.status === "error") {
        throw new Error(data.error || "Unknown error")
      }

      setDiagnostics(data.diagnostics)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Run diagnostics on mount
    runDiagnostics()
  }, [])

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          API Troubleshooter
          {diagnostics && (
            <Badge
              variant={
                diagnostics.status === "success"
                  ? "default"
                  : diagnostics.status === "partial"
                    ? "outline"
                    : "destructive"
              }
            >
              {diagnostics.status}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>Diagnose and troubleshoot API connection issues</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading && (
          <div className="flex items-center justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Running diagnostics...</span>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {diagnostics && !loading && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">API URL</h3>
                <p className="text-sm">{diagnostics.apiUrl}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">API Version</h3>
                <p className="text-sm">{diagnostics.version || "Unknown"}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Token Status</h3>
                <div className="flex items-center">
                  {diagnostics.tokenValid ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className="text-sm">{diagnostics.tokenValid ? "Valid" : "Invalid"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Endpoint Status</h3>
              <div className="space-y-1">
                {Object.entries(diagnostics.endpoints).map(([endpoint, success]) => (
                  <div key={endpoint} className="flex items-center">
                    {success ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500 mr-1 flex-shrink-0" />
                    )}
                    <code className="text-xs bg-muted p-1 rounded">{endpoint}</code>
                  </div>
                ))}
              </div>
            </div>

            {Object.keys(diagnostics.errors).length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Errors</h3>
                <div className="space-y-1">
                  {Object.entries(diagnostics.errors).map(([key, message]) => (
                    <div key={key} className="text-sm">
                      <span className="font-medium">{key}:</span> {message}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {diagnostics.recommendations.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Recommendations</h3>
                <div className="space-y-1">
                  {diagnostics.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mr-1 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>

      <CardFooter>
        <Button onClick={runDiagnostics} disabled={loading} className="w-full">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Running Diagnostics..." : "Run Diagnostics Again"}
        </Button>
      </CardFooter>
    </Card>
  )
}
