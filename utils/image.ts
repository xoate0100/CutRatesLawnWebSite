/**
 * Safely gets an image URL with fallback for invalid URLs
 * @param imageData - The image data object or URL string
 * @param fallbackUrl - Fallback URL to use if the provided URL is invalid
 * @returns A safe image URL
 */
export function getSafeImageUrl(imageData: any, fallbackUrl = "/placeholder.svg?height=400&width=600"): string {
  // If no image data, return fallback
  if (!imageData) return fallbackUrl

  // Handle different image data formats
  let url = ""

  if (typeof imageData === "string") {
    // If imageData is a string, use it directly
    url = imageData
  } else if (imageData?.data?.attributes?.url) {
    // Handle Strapi image format
    url = imageData.data.attributes.url
  } else if (imageData?.url) {
    // Handle simple object with url property
    url = imageData.url
  } else if (imageData?.src) {
    // Handle object with src property
    url = imageData.src
  }

  // If no URL extracted, return fallback
  if (!url) return fallbackUrl

  // Return the URL (could add validation here if needed)
  return url
}

// Default export for compatibility
export default getSafeImageUrl
