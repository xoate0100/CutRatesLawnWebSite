import { isValidGoogleApiKeyFormat, isValidGooglePlaceIdFormat } from "@/lib/utils/api-key-validator"

export const dynamic = "force-dynamic"


export async function GET(request: Request) {
  try {
    // Get API key and place ID from environment variables
    const apiKey = process.env.GOOGLE_PLACES_API_KEY
    const placeId = process.env.GOOGLE_PLACE_ID

    // Validate API key and place ID
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "Configuration error",
          message: "Google Places API key is not set in environment variables",
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 500,
        },
      )
    }

    if (!isValidGoogleApiKeyFormat(apiKey)) {
      return new Response(
        JSON.stringify({
          error: "Configuration error",
          message: "Google Places API key format is invalid",
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 500,
        },
      )
    }

    if (!placeId) {
      return new Response(
        JSON.stringify({
          error: "Configuration error",
          message: "Google Place ID is not set in environment variables",
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 500,
        },
      )
    }

    if (!isValidGooglePlaceIdFormat(placeId)) {
      return new Response(
        JSON.stringify({
          error: "Configuration error",
          message: "Google Place ID format is invalid",
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 500,
        },
      )
    }

    // Make request to Google Places API
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews&key=${apiKey}`

    const response = await fetch(detailsUrl)

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: "API error",
          message: `Google Places API responded with status: ${response.status}`,
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: response.status,
        },
      )
    }

    const data = await response.json()

    // Check if the API returned an error
    if (data.status !== "OK") {
      return new Response(
        JSON.stringify({
          error: "Google API error",
          message: `Status: ${data.status} - ${data.error_message || "Unknown error"}`,
          details: data,
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 400,
        },
      )
    }

    // Format the response
    const formattedResponse = {
      businessName: data.result?.name || "Unknown Business",
      overallRating: data.result?.rating || 0,
      totalReviews: data.result?.user_ratings_total || 0,
      reviews:
        data.result?.reviews?.map((review: any) => ({
          author: {
            name: review.author_name,
            photoUrl: review.profile_photo_url,
            profileUrl: review.author_url,
          },
          rating: review.rating,
          text: review.text,
          time: review.time,
          source: "google",
        })) || [],
    }

    return new Response(JSON.stringify(formattedResponse), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error: any) {
    console.error("Error in Google Reviews API route:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    const details = error instanceof Error ? error.stack : JSON.stringify(error)

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        headers: { "Content-Type": "application/json" },
        details: details,
        status: 500,
      },
    )
  }
}
