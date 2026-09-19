import { fallbackReviews } from "@/lib/fallback-reviews"
import { fiveStarOnly, GOOGLE_RATING, GOOGLE_REVIEW_COUNT } from "@/lib/google-reviews"
import { isValidGoogleApiKeyFormat, isValidGooglePlaceIdFormat } from "@/lib/utils/api-key-validator"

export const dynamic = "force-dynamic"

type GooglePlaceReview = {
  author_name: string
  rating: number
  text?: string
  profile_photo_url?: string
  author_url?: string
  time?: number
  relative_time_description?: string
}

function fallbackPayload() {
  return {
    businessName: fallbackReviews.businessName,
    overallRating: GOOGLE_RATING,
    totalReviews: GOOGLE_REVIEW_COUNT,
    reviews: fallbackReviews.reviews
      .filter((r) => r.rating >= 5)
      .map((review) => ({
        author: {
          name: review.author_name,
          photoUrl: review.profile_photo_url,
          profileUrl: undefined,
        },
        rating: review.rating,
        text: review.text,
        time: review.time,
        relative_time_description: review.relative_time_description,
        source: "google",
      })),
    usingFallback: true,
  }
}

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  const placeId = process.env.GOOGLE_PLACE_ID

  if (!apiKey || !placeId || !isValidGoogleApiKeyFormat(apiKey) || !isValidGooglePlaceIdFormat(placeId)) {
    return Response.json(fallbackPayload())
  }

  try {
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews&key=${apiKey}`
    const response = await fetch(detailsUrl)
    if (!response.ok) {
      return Response.json(fallbackPayload())
    }

    const data = await response.json()
    if (data.status !== "OK") {
      return Response.json(fallbackPayload())
    }

    const reviews = fiveStarOnly<GooglePlaceReview>(data.result?.reviews || []).map((review) => ({
      author: {
        name: review.author_name,
        photoUrl: review.profile_photo_url,
        profileUrl: review.author_url,
      },
      rating: review.rating,
      text: review.text || "",
      time: review.time,
      relative_time_description: review.relative_time_description,
      source: "google",
    }))

    return Response.json({
      businessName: data.result?.name || fallbackReviews.businessName,
      overallRating: data.result?.rating || GOOGLE_RATING,
      totalReviews: data.result?.user_ratings_total || GOOGLE_REVIEW_COUNT,
      reviews: reviews.length ? reviews : fallbackPayload().reviews,
      usingFallback: reviews.length === 0,
    })
  } catch {
    return Response.json(fallbackPayload())
  }
}