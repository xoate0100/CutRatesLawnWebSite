"use client"

import { useState, useEffect } from "react"
import { cmsService } from "@/lib/services/cms-service"
import { Button } from "@/components/ui/button"

interface HomePageData {
  title: string
  subtitle: string
  content: string
}

export function CMSExample() {
  const [data, setData] = useState<HomePageData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      // This would be a real API endpoint in your CMS
      const response = await cmsService.fetch<HomePageData>("home-page")
      setData(response.data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Fetch data on mount
    fetchData()
  }, [])

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-lg font-semibold mb-4">CMS Data</h2>

      {loading && <p>Loading...</p>}

      {error && (
        <div className="bg-red-50 p-4 rounded-md mb-4">
          <p className="text-red-600">{error.message}</p>
          <Button onClick={fetchData} className="mt-2">
            Retry
          </Button>
        </div>
      )}

      {data && (
        <div>
          <h3 className="font-medium">{data.title}</h3>
          <p className="text-gray-600">{data.subtitle}</p>
          <div className="mt-2">{data.content}</div>
        </div>
      )}

      {!loading && !error && !data && (
        <div>
          <p>No data available</p>
          <Button onClick={fetchData} className="mt-2">
            Load Data
          </Button>
        </div>
      )}
    </div>
  )
}
