"use client"

import { useReviews } from "@/hooks/use-reviews"
import { ReviewCard } from "./review-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink, AlertCircle, CheckCircle, Info } from "lucide-react"
import { TestimonialsList } from "../testimonials-list"
import { useState } from "react"

interface ReviewsListProps {
  source?: "google" | "yelp" | "facebook"
  initialLimit?: number
  showViewMore?: boolean
  businessUrl?: string
  showFallbackTestimonials?: boolean
  className?: string
}

export function ReviewsList({
  source = "google",
  initialLimit = 4,
  showViewMore = true,
  businessUrl = "https://maps.app.goo.gl/hzNhwvqRi3TMVGTE8",
  showFallbackTestimonials = true,
  className = "",
}: ReviewsListProps) {
  const [displayCount, setDisplayCount] = useState(initialLimit)

  const { data, loading, error } = useReviews({
    source,
    limit: 20, // Fetch more than we need initially to support "View More"
  })

  const handleViewMore = () => {
    setDisplayCount((prev) => prev + 4)
  }

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: initialLimit }).map((_, index) => (
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
      <div className={className}>
        <div className="p-6 bg-red-50 rounded-lg mb-8">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <h3 className="text-xl font-semibold text-red-700">Error Loading Reviews</h3>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-700">
            We're experiencing technical difficulties loading our reviews. Please see our customer testimonials below or
            visit our
            <a
              href={businessUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline mx-1"
            >
              {source.charAt(0).toUpperCase() + source.slice(1)} page
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

  if (!data || data.reviews.length === 0) {
    return (
      <div className={className}>
        <div className="p-6 bg-yellow-50 rounded-lg mb-8">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <h3 className="text-xl font-semibold text-yellow-700">No High-Rated Reviews Available</h3>
          </div>
          <p className="text-yellow-600 mb-4">We don't have any 4-5 star reviews to display at the moment.</p>
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

  // Get reviews to display based on current display count
  const displayedReviews = data.reviews.slice(0, displayCount)

  return (
    <div className={`space-y-6 ${className}`}>
      {data.message && (
        <div className="p-4 bg-blue-50 rounded-lg mb-4">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            <p className="text-blue-700">{data.message}</p>
          </div>
        </div>
      )}

      {data.usingFallback && (
        <div className="p-4 bg-yellow-50 rounded-lg mb-4">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-yellow-600" />
            <p className="text-yellow-700">
              Showing sample reviews. Live {source.charAt(0).toUpperCase() + source.slice(1)} reviews will be displayed
              when available.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`h-5 w-5 ${
                  i < Math.round(data.overallRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
          <span className="font-medium">{data.overallRating.toFixed(1)}</span>
          <span className="text-gray-500 text-sm">({data.totalReviews} reviews)</span>
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-sm text-gray-600">
            {data.usingFallback
              ? "Sample Reviews"
              : `Verified ${source.charAt(0).toUpperCase() + source.slice(1)} Reviews`}
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {displayedReviews.map((review, index) => (
          <ReviewCard key={index} review={review} businessName={data.businessName} />
        ))}
      </div>

      {showViewMore && displayCount < data.reviews.length && (
        <div className="flex justify-center mt-8">
          <Button onClick={handleViewMore} variant="outline">
            View More Reviews
          </Button>
        </div>
      )}

      <div className="flex justify-center mt-4">
        <Button variant="outline" className="flex items-center" onClick={() => window.open(businessUrl, "_blank")}>
          Leave a Review on {source.charAt(0).toUpperCase() + source.slice(1)} <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
