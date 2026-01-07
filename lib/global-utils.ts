// This file defines global utilities that are accessible throughout the application

// Define the getSafeImageUrl function
function getSafeImageUrl(imageData: any, fallbackUrl = "/placeholder.svg?height=400&width=600"): string {
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

// Make the function globally available
if (typeof window !== "undefined") {
  ;(window as any).getSafeImageUrl = getSafeImageUrl
}

export { getSafeImageUrl }
