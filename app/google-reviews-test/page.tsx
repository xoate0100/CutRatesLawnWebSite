"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function GoogleReviewsTestPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchReviews = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/google-reviews")

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }

      const jsonData = await response.json()
      setData(jsonData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Google Reviews API Test</h1>

      <div className="mb-6">
        <Button onClick={fetchReviews} disabled={loading}>
          {loading ? "Loading..." : "Refresh Data"}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {data && (
        <div>
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            <p className="font-medium">API Call Successful!</p>
            {data.message && <p className="mt-2">{data.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="border rounded p-4">
              <h2 className="font-medium mb-2">Business Details</h2>
              <p>
                <strong>Name:</strong> {data.businessName}
              </p>
              <p>
                <strong>Rating:</strong> {data.overallRating}
              </p>
              <p>
                <strong>Total Reviews:</strong> {data.totalReviews}
              </p>
            </div>

            <div className="border rounded p-4">
              <h2 className="font-medium mb-2">Reviews Count</h2>
              <p>{data.reviews?.length || 0} reviews returned</p>
              <p className="text-sm text-gray-500 mt-2">
                {data.reviews?.length ? "Using live data" : "Using fallback data"}
              </p>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-4">Reviews</h2>

          <div className="space-y-4">
            {data.reviews?.slice(0, 3).map((review: any, index: number) => (
              <div key={index} className="border rounded p-4">
                <div className="flex justify-between mb-2">
                  <p className="font-medium">{review.author_name}</p>
                  <p className="text-yellow-500">{"★".repeat(review.rating)}</p>
                </div>
                <p className="text-gray-700">{review.text}</p>
                <p className="text-sm text-gray-500 mt-2">{review.relative_time_description}</p>
              </div>
            ))}

            {data.reviews?.length > 3 && (
              <p className="text-center text-gray-500">{data.reviews.length - 3} more reviews not shown</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
