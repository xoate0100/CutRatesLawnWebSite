"use client"

import { useEffect, useState } from "react"
import { GoogleReview } from "./google-review"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink, AlertCircle, CheckCircle, Info } from "lucide-react"
import { TestimonialsList } from "./testimonials-list"

interface GoogleReviewData {
  author_name: string
  author_url?: string
  profile_photo_url?: string
  rating: number
  relative_time_description: string
  text: string
  time: number
}

interface GoogleReviewsResponse {
  businessName: string
  overallRating: number
  totalReviews: number
  reviews: GoogleReviewData[]
  message?: string
}

interface GoogleReviewsListProps {
  limit?: number
  showViewMore?: boolean
  businessUrl?: string
  showFallbackTestimonials?: boolean
}

export function GoogleReviewsList({
  limit = 4,
  showViewMore = true,
  businessUrl = "https://maps.app.goo.gl/hzNhwvqRi3TMVGTE8",
  showFallbackTestimonials = true,
}: GoogleReviewsListProps) {
  const [reviews, setReviews] = useState<GoogleReviewData[]>([])
  const [businessName, setBusinessName] = useState<string>("")
  const [overallRating, setOverallRating] = useState<number>(0)
  const [totalReviews, setTotalReviews] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [displayCount, setDisplayCount] = useState(limit)
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/google-reviews")

        if (!response.ok) {
          throw new Error(`Failed to fetch reviews: ${response.status}`)
        }

        const data: GoogleReviewsResponse = await response.json()

        // Check if we're using fallback data
        if (data.message) {
          setMessage(data.message)
          setUsingFallback(true)
        } else {
          setUsingFallback(false)
        }
        // Filter to only show 4-5 star reviews
        ;+console.log("Raw reviews data from API:", data)
        const highRatedReviews = data.reviews.filter((review) => review.rating >= 4)

        setReviews(highRatedReviews || [])
        setBusinessName(data.businessName || "Cut Rates Lawn Care")
        setOverallRating(data.overallRating || 0)
        setTotalReviews(data.totalReviews || 0)
      } catch (err) {
        console.error("Error fetching Google reviews:", err)
        setError("Unable to load reviews at this time. Please check back later.")
        setUsingFallback(true)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  const handleViewMore = () => {
    setDisplayCount((prev) => prev + 4)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: limit }).map((_, index) => (
            <div key={index} className="h-64 bg-gray-50 rounded-lg">
              <Skeleton className="h-full w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <div className="p-6 bg-red-50 rounded-lg mb-8">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <h3 className="text-xl font-semibold text-red-700">Error Loading Google Reviews</h3>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-700">
            We're experiencing technical difficulties loading our Google reviews. Please see our customer testimonials
            below or visit our
            <a
              href={businessUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline mx-1"
            >
              Google Business page
            </a>
            directly.
          </p>
        </div>

        {showFallbackTestimonials && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Customer Testimonials</h3>
            <TestimonialsList />
          </div>
        )}
      </div>
    )
  }

  // Fallback to static data if no reviews are available
  const displayedReviews = reviews.length > 0 ? reviews.slice(0, displayCount) : []

  if (displayedReviews.length === 0) {
    return (
      <div>
        <div className="p-6 bg-yellow-50 rounded-lg mb-8">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <h3 className="text-xl font-semibold text-yellow-700">No High-Rated Reviews Available</h3>
          </div>
          <p className="text-yellow-600 mb-4">We don't have any 4-5 star Google reviews to display at the moment.</p>
          <Button variant="outline" className="mt-2" onClick={() => window.open(businessUrl, "_blank")}>
            Be the First to Review Us <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {showFallbackTestimonials && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Customer Testimonials</h3>
            <TestimonialsList />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className="p-4 bg-blue-50 rounded-lg mb-4">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            <p className="text-blue-700">{message}</p>
          </div>
        </div>
      )}

      {usingFallback && (
        <div className="p-4 bg-yellow-50 rounded-lg mb-4">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-yellow-600" />
            <p className="text-yellow-700">
              Showing sample reviews. Live Google reviews will be displayed when available.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.round(overallRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="font-medium">{overallRating.toFixed(1)}</span>
          <span className="text-gray-500 text-sm">({totalReviews} reviews)</span>
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-sm text-gray-600">{usingFallback ? "Sample Reviews" : "Verified Google Reviews"}</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {displayedReviews.map((review, index) => (
          <GoogleReview
            key={index}
            authorName={review.author_name}
            authorPhotoUrl={review.profile_photo_url || ""}
            rating={review.rating}
            text={review.text}
            time={review.time}
            profileUrl={review.author_url}
            businessName={businessName}
          />
        ))}
      </div>

      {showViewMore && displayCount < reviews.length && (
        <div className="flex justify-center mt-8">
          <Button onClick={handleViewMore} variant="outline">
            View More Reviews
          </Button>
        </div>
      )}

      <div className="flex justify-center mt-4">
        <Button variant="outline" className="flex items-center" onClick={() => window.open(businessUrl, "_blank")}>
          Leave a Review on Google <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function Star({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
