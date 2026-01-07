export function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  const placeId = process.env.GOOGLE_PLACE_ID

  const debugInfo = {
    apiKeyExists: !!apiKey,
    apiKeyLength: apiKey ? apiKey.length : 0,
    placeIdExists: !!placeId,
    placeIdValue: placeId || "Not set",
    timestamp: new Date().toISOString(),
  }

  return new Response(JSON.stringify(debugInfo, null, 2), {
    headers: { "Content-Type": "application/json" },
  })
}
