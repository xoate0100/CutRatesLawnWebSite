import { ReviewsServiceFactory } from "@/lib/services/reviews/reviews-service-factory"

export const dynamic = "force-dynamic"


export async function GET(request: Request) {
  try {
    // Get query parameters
    const url = new URL(request.url)
    const minRating = Number.parseInt(url.searchParams.get("minRating") || "4")
    const maxRating = Number.parseInt(url.searchParams.get("maxRating") || "5")
    const limit = Number.parseInt(url.searchParams.get("limit") || "10")

    // Create service and get reviews
    const reviewsService = ReviewsServiceFactory.createGoogleReviewsService()
    const reviewsData = await reviewsService.getReviews({ minRating, maxRating, limit })

    // Return response
    return new Response(JSON.stringify(reviewsData), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error in Google Reviews API route:", error)

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      },
    )
  }
}
