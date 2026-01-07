"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function ApiTestPage() {
  const [debugData, setDebugData] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDebugData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/google-reviews-debug")

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }

      const text = await response.text()
      setDebugData(text)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
      console.error("Error fetching debug data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDebugData()
  }, [])

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Google Places API Test</h1>

      <Button onClick={fetchDebugData} disabled={loading} className="mb-6">
        {loading ? "Loading..." : "Refresh Data"}
      </Button>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {debugData && (
        <div className="bg-gray-50 p-4 rounded border">
          <pre className="whitespace-pre-wrap">{debugData}</pre>
        </div>
      )}
    </div>
  )
}
