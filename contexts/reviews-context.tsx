"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { ReviewsData } from "@/lib/services/reviews/reviews-service.interface"
import { reviewsConfig } from "@/lib/config/reviews-config"

interface ReviewsContextType {
  googleReviews: ReviewsData | null
  yelpReviews: ReviewsData | null
  facebookReviews: ReviewsData | null
  loadingGoogle: boolean
  loadingYelp: boolean
  loadingFacebook: boolean
  errorGoogle: string | null
  errorYelp: string | null
  errorFacebook: string | null
  refreshReviews: (source?: "google" | "yelp" | "facebook") => Promise<void>
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined)

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [googleReviews, setGoogleReviews] = useState<ReviewsData | null>(null)
  const [yelpReviews, setYelpReviews] = useState<ReviewsData | null>(null)
  const [facebookReviews, setFacebookReviews] = useState<ReviewsData | null>(null)

  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const [loadingYelp, setLoadingYelp] = useState(false)
  const [loadingFacebook, setLoadingFacebook] = useState(false)

  const [errorGoogle, setErrorGoogle] = useState<string | null>(null)
  const [errorYelp, setErrorYelp] = useState<string | null>(null)
  const [errorFacebook, setErrorFacebook] = useState<string | null>(null)

  const fetchReviews = async (source: "google" | "yelp" | "facebook") => {
    if (source !== "google") return // Only fetch google reviews for now

    const config = reviewsConfig[source]
    const setLoading = source === "google" ? setLoadingGoogle : source === "yelp" ? setLoadingYelp : setLoadingFacebook
    const setError = source === "google" ? setErrorGoogle : source === "yelp" ? setErrorYelp : setErrorFacebook
    const setReviews = source === "google" ? setGoogleReviews : source === "yelp" ? setYelpReviews : setFacebookReviews

    try {
      setLoading(true)
      setError(null)

      const queryParams = new URLSearchParams({
        minRating: config.defaultMinRating.toString(),
        maxRating: config.defaultMaxRating.toString(),
        limit: config.defaultLimit.toString(),
      })

      const response = await fetch(`/api/reviews/${source}?${queryParams}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch ${source} reviews: ${response.status}`)
      }

      const data: ReviewsData = await response.json()
      setReviews(data)
    } catch (err) {
      console.error(`Error fetching ${source} reviews:`, err)
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  const refreshReviews = async (source?: "google" | "yelp" | "facebook") => {
    if (!source || source === "google") {
      await fetchReviews("google")
    }
    // if (!source || source === "yelp") {
    //   await fetchReviews("yelp")
    // }
    // if (!source || source === "facebook") {
    //   await fetchReviews("facebook")
    // }
  }

  useEffect(() => {
    refreshReviews()
  }, [])

  return (
    <ReviewsContext.Provider
      value={{
        googleReviews,
        yelpReviews: null,
        facebookReviews: null,
        loadingGoogle,
        loadingYelp: false,
        loadingFacebook: false,
        errorGoogle,
        errorYelp: null,
        errorFacebook: null,
        refreshReviews,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  )
}

export function useReviewsContext() {
  const context = useContext(ReviewsContext)
  if (context === undefined) {
    throw new Error("useReviewsContext must be used within a ReviewsProvider")
  }
  return context
}
