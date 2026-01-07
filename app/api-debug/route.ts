export async function GET() {
  try {
    // Check if environment variables are set
    const apiKey = process.env.GOOGLE_PLACES_API_KEY
    const placeId = process.env.GOOGLE_PLACE_ID

    // Create a diagnostic object
    const diagnostics = {
      apiKeyExists: !!apiKey,
      apiKeyLength: apiKey ? apiKey.length : 0,
      apiKeyFirstFive: apiKey ? `${apiKey.substring(0, 5)}...` : "N/A",
      placeIdExists: !!placeId,
      placeIdValue: placeId || "N/A",
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    }

    // Make a simple test request to the Places API
    let apiTestResult = { success: false, message: "Test not run", status: null, data: null }

    if (apiKey && placeId) {
      const testUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name&key=${apiKey}`

      const response = await fetch(testUrl)
      const data = await response.json()

      apiTestResult = {
        success: response.ok && data.status === "OK",
        message:
          data.status === "OK"
            ? "API test successful"
            : `API error: ${data.status} - ${data.error_message || "Unknown error"}`,
        status: data.status,
        data: data.status === "OK" ? { name: data.result?.name } : null,
      }
    }

    return new Response(
      JSON.stringify(
        {
          diagnostics,
          apiTestResult,
          helpfulTips: [
            "Make sure the API key is correctly set in your environment variables",
            "Verify the API key has Places API enabled in Google Cloud Console",
            "Check if the API key has any restrictions (HTTP referrers, IP addresses, etc.)",
            "Ensure your Google Cloud billing is set up correctly",
            "Try creating a new API key with no restrictions for testing",
          ],
        },
        null,
        2,
      ),
      {
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify(
        {
          error: "Diagnostic error",
          message: error instanceof Error ? error.message : "Unknown error",
        },
        null,
        2,
      ),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      },
    )
  }
}
