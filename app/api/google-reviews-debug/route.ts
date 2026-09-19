import { NextResponse } from "next/server"

/** Production: 404. Dev: boolean flags only — never key material or place IDs. */
export function GET() {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse(null, { status: 404 })
  }

  return NextResponse.json({
    apiKeyExists: Boolean(process.env.GOOGLE_PLACES_API_KEY),
    placeIdExists: Boolean(process.env.GOOGLE_PLACE_ID),
    timestamp: new Date().toISOString(),
  })
}
