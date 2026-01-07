/**
 * Safely escapes text to prevent XSS and rendering issues
 */
export function safeText(text: string | null | undefined): string {
  if (text === null || text === undefined) return ""

  return String(text).replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&/g, "&amp;")
}

/**
 * Safely renders text that might contain special characters in JSX
 * by wrapping it in curly braces
 */
export function safeJSX(text: string | null | undefined): string {
  if (text === null || text === undefined) return ""
  return String(text)
}

/**
 * Safely formats a date string
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return ""

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ""

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch (error) {
    console.error("Error formatting date:", error)
    return ""
  }
}

/**
 * Gets a safe image URL with fallback
 */
export function getSafeImageUrl(
  url: string | null | undefined,
  fallback = "/placeholder.svg?height=400&width=600",
): string {
  if (!url) return fallback

  try {
    // Use a default API URL if environment variable is not available
    const apiBaseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || ""
    return url.startsWith("/") ? `${apiBaseUrl}${url}` : url
  } catch (error) {
    console.error("Error getting safe image URL:", error)
    return fallback
  }
}
