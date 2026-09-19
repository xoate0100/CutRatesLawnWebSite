import { NextResponse } from "next/server"

/** Production: 404. Dev-only diagnostic stub — no secrets. */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse(null, { status: 404 })
  }

  return NextResponse.json({
    ok: true,
    nodeEnv: process.env.NODE_ENV,
    apiKeyExists: Boolean(process.env.GOOGLE_PLACES_API_KEY),
    placeIdExists: Boolean(process.env.GOOGLE_PLACE_ID),
    timestamp: new Date().toISOString(),
    tip: "Use authenticated observability for production debugging.",
  })
}
