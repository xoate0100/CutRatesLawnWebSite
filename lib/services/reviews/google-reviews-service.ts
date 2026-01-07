import { fallbackReviews } from "@/lib/fallback-reviews"
import type { ReviewsService, ReviewsServiceOptions, ReviewsData, Review } from "./reviews-service.interface"
import { logDetailedError } from "@/lib/error-utils"

export class GoogleReviewsService implements ReviewsService {
  private apiKey: string | undefined
  private placeId: string | undefined

  constructor() {
    this.apiKey = process.env.GOOGLE_PLACES_API_KEY
    this.placeId = process.env.GOOGLE_PLACE_ID
  }

  async getReviews(options: ReviewsServiceOptions = {}): Promise<ReviewsData> {
    const { minRating = 4, maxRating = 5 } = options

    // Check if environment variables are set
    if (!this.apiKey || !this.placeId) {
      return this.getFallbackData("API key or Place ID not configured")
    }

    try {
      // Fetch business details
      const businessDetails = await this.fetchBusinessDetails()

      // If business details fetch failed, return fallback data
      if (!businessDetails.success) {
        return this.getFallbackData(businessDetails.error)
      }

      // Fetch reviews
      const reviewsResult = await this.fetchReviews()

      // If reviews fetch failed, return business details with fallback reviews
      if (!reviewsResult.success) {
        return {
          businessName: businessDetails.data.name,
          overallRating: businessDetails.data.rating,
          totalReviews: businessDetails.data.totalReviews,
          reviews: this.transformReviews(fallbackReviews.reviews),
          usingFallback: true,
          message: `Using fallback reviews: ${reviewsResult.error}`,
        }
      }

      // Filter reviews by rating
      const filteredReviews = reviewsResult.data.filter(
        (review) => review.rating >= minRating && review.rating <= maxRating,
      )

      // Return successful response with real data
      return {
        businessName: businessDetails.data.name,
        overallRating: businessDetails.data.rating,
        totalReviews: businessDetails.data.totalReviews,
        reviews: this.transformReviews(filteredReviews),
        usingFallback: false,
      }
    } catch (error) {
      console.error("Error fetching from Google Places API:", error)
      return this.getFallbackData(error instanceof Error ? error.message : "Unknown error")
    }
  }

  private async fetchBusinessDetails(): Promise<{
    success: boolean
    data?: { name: string; rating: number; totalReviews: number }
    error?: string
  }> {
    try {
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${this.placeId}&fields=name,rating,user_ratings_total&key=${this.apiKey}`

      const response = await fetch(detailsUrl)

      if (!response.ok) {
        return {
          success: false,
          error: `API responded with status: ${response.status}`,
        }
      }

      const data = await response.json()

      if (data.status !== "OK") {
        return {
          success: false,
          error: `Google API error: ${data.status} - ${data.error_message || "Unknown error"}`,
        }
      }

      return {
        success: true,
        data: {
          name: data.result?.name || fallbackReviews.businessName,
          rating: data.result?.rating || fallbackReviews.overallRating,
          totalReviews: data.result?.user_ratings_total || fallbackReviews.totalReviews,
        },
      }
    } catch (error) {
      logDetailedError("Error fetching business details from Google Places API", error, {
        apiKey: this.apiKey,
        placeId: this.placeId,
      })
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  private async fetchReviews(): Promise<{
    success: boolean
    data?: any[]
    error?: string
  }> {
    try {
      const reviewsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${this.placeId}&fields=reviews&key=${this.apiKey}`

      const response = await fetch(reviewsUrl)

      if (!response.ok) {
        return {
          success: false,
          error: `API responded with status: ${response.status}`,
        }
      }

      const data = await response.json()

      if (data.status !== "OK") {
        return {
          success: false,
          error: `Google API error: ${data.status} - ${data.error_message || "Unknown error"}`,
        }
      }

      return {
        success: true,
        data: data.result?.reviews || [],
      }
    } catch (error) {
      logDetailedError("Error fetching reviews from Google Places API", error, {
        apiKey: this.apiKey,
        placeId: this.placeId,
      })
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  private transformReviews(googleReviews: any[]): Review[] {
    return googleReviews.map((review) => ({
      author: {
        name: review.author_name,
        photoUrl: review.profile_photo_url,
        profileUrl: review.author_url,
      },
      rating: review.rating,
      text: review.text,
      time: review.time,
      source: "google",
    }))
  }

  private getFallbackData(message?: string): ReviewsData {
    return {
      businessName: fallbackReviews.businessName,
      overallRating: fallbackReviews.overallRating,
      totalReviews: fallbackReviews.totalReviews,
      reviews: this.transformReviews(fallbackReviews.reviews),
      usingFallback: true,
      message: message ? `Using fallback data: ${message}` : undefined,
    }
  }
}
