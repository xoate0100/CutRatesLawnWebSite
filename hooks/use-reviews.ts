"use client"

import { useState, useEffect } from "react"
import type { ReviewsData } from "@/lib/services/reviews/reviews-service.interface"

interface UseReviewsOptions {
  source: "google" | "yelp" | "facebook"
  minRating?: number
  maxRating?: number
  limit?: number
}

interface UseReviewsResult {
  data: ReviewsData | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useReviews({
  source = "google",
  minRating = 4,
  maxRating = 5,
  limit = 10,
}: UseReviewsOptions): UseReviewsResult {
  const [data, setData] = useState<ReviewsData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReviews = async () => {
    try {
      setLoading(true)
      setError(null)

      const queryParams = new URLSearchParams({
        minRating: minRating.toString(),
        maxRating: maxRating.toString(),
        limit: limit.toString(),
      })

      const response = await fetch(`/api/reviews/${source}?${queryParams}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch reviews: ${response.status}`)
      }

      const reviewsData: ReviewsData = await response.json()
      setData(reviewsData)
    } catch (err) {
      console.error(`Error fetching ${source} reviews:`, err)
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [source, minRating, maxRating, limit])

  return {
    data,
    loading,
    error,
    refetch: fetchReviews,
  }
}
