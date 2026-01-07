"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// Import native Button component
import { Button } from "@/components/ui/button-native"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertTriangle, XCircle, RefreshCw } from "lucide-react"
import { getContentTypeSchema } from "@/lib/schema-validator"

interface HealthCheckResult {
  contentType: string
  status: "success" | "warning" | "error"
  message: string
  details?: string[]
}

export default function SchemaHealthCheck() {
  const [results, setResults] = useState<HealthCheckResult[]>([])
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const contentTypes = ["homepage", "services", "bundles", "posts", "faqs", "testimonials", "service-areas"]

  async function runHealthCheck() {
    setLoading(true)
    setProgress(0)
    setResults([])

    const newResults: HealthCheckResult[] = []

    for (let i = 0; i < contentTypes.length; i++) {
      const contentType = contentTypes[i]
      setProgress(Math.round((i / contentTypes.length) * 100))

      try {
        const schema = await getContentTypeSchema(contentType, true)

        if (!schema) {
          newResults.push({
            contentType,
            status: "error",
            message: "Could not fetch schema",
          })
          continue
        }

        // Check for required fields
        const missingRequiredFields = []
        for (const [fieldName, field] of Object.entries(schema.fields)) {
          if ((field as any).required && !(field as any).defaultValue) {
            // This is a required field without a default value
            // Check if it's used in the frontend
            missingRequiredFields.push(fieldName)
          }
        }

        if (missingRequiredFields.length > 0) {
          newResults.push({
            contentType,
            status: "warning",
            message: "Required fields without defaults",
            details: missingRequiredFields,
          })
        } else {
          newResults.push({
            contentType,
            status: "success",
            message: "Schema is valid",
          })
        }
      } catch (error) {
        newResults.push({
          contentType,
          status: "error",
          message: `Error checking schema: ${error.message}`,
        })
      }
    }

    setResults(newResults)
    setProgress(100)
    setLoading(false)
    setLastChecked(new Date())
  }

  useEffect(() => {
    runHealthCheck()
  }, [])

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Schema Health Check</CardTitle>
            <CardDescription>Validates content type schemas against frontend requirements</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={runHealthCheck} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Checking schemas...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.contentType} className="border rounded-md p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    {result.status === "success" && <CheckCircle className="h-5 w-5 text-green-500 mr-2" />}
                    {result.status === "warning" && <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />}
                    {result.status === "error" && <XCircle className="h-5 w-5 text-red-500 mr-2" />}
                    <div>
                      <h3 className="font-medium capitalize">{result.contentType}</h3>
                      <p className="text-sm text-gray-500">{result.message}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      result.status === "success"
                        ? "bg-green-100 text-green-800"
                        : result.status === "warning"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {result.status}
                  </span>
                </div>

                {result.details && result.details.length > 0 && (
                  <div className="mt-2 pl-7">
                    <p className="text-sm font-medium">Details:</p>
                    <ul className="text-sm text-gray-600 list-disc pl-5">
                      {result.details.map((detail, index) => (
                        <li key={index}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="text-sm text-gray-500">
        {lastChecked && <div>Last checked: {lastChecked.toLocaleString()}</div>}
      </CardFooter>
    </Card>
  )
}
