"use client"

// Function to validate Google API key format
export function isValidGoogleApiKeyFormat(apiKey: string): boolean {
  // Basic check for API key format (e.g., AIza...)
  return /^AIza[A-Za-z0-9_-]{35}$/.test(apiKey)
}

// Function to validate Google Place ID format
export function isValidGooglePlaceIdFormat(placeId: string): boolean {
  // Google Place IDs are base64 encoded strings
  // This regex checks for a minimum length and valid characters
  return /^[A-Za-z0-9_-]{20,}$/.test(placeId)
}
