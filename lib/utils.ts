import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names into a single string using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date string or Date object into a human-readable format
 * @param date - Date string or Date object to format
 * @param options - Intl.DateTimeFormatOptions to customize the format
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date | undefined | null,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
): string {
  if (!date) return "N/A"

  const dateObj = typeof date === "string" ? new Date(date) : date

  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return "Invalid date"
  }

  return new Intl.DateTimeFormat("en-US", options).format(dateObj)
}

/**
 * Formats a date string or Date object into a relative time format (e.g., "2 days ago")
 * @param date - Date string or Date object to format
 * @returns Formatted relative time string
 */
export function formatRelativeTime(date: string | Date | undefined | null): string {
  if (!date) return "N/A"

  const dateObj = typeof date === "string" ? new Date(date) : date

  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return "Invalid date"
  }

  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths !== 1 ? "s" : ""} ago`
  }

  const diffInYears = Math.floor(diffInMonths / 12)
  return `${diffInYears} year${diffInYears !== 1 ? "s" : ""} ago`
}

/**
 * Returns a safe image URL, providing a fallback if the original URL is invalid
 * @param url - The original image URL
 * @param fallback - Optional fallback URL to use if the original is invalid
 * @param strapiBaseUrl - Optional Strapi base URL to prepend to relative URLs
 * @returns A safe image URL
 */
export function getSafeImageUrl(
  url: string | undefined | null,
  fallback = "/placeholder.svg?height=400&width=600",
  strapiBaseUrl?: string,
): string {
  // If URL is missing, return fallback
  if (!url) return fallback

  // If URL is already absolute (starts with http:// or https://), return it
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url
  }

  // If URL is a data URL, return it
  if (url.startsWith("data:")) {
    return url
  }

  // If URL is relative and we have a Strapi base URL, prepend it
  if (strapiBaseUrl) {
    // Remove trailing slash from base URL if present
    const baseUrl = strapiBaseUrl.endsWith("/") ? strapiBaseUrl.slice(0, -1) : strapiBaseUrl

    // Add leading slash to URL if missing
    const normalizedUrl = url.startsWith("/") ? url : `/${url}`

    return `${baseUrl}${normalizedUrl}`
  }

  // If we get here, it's a relative URL without a base URL, so use the fallback
  return fallback
}

/**
 * Truncates a string to a specified length and adds an ellipsis if needed
 * @param str - The string to truncate
 * @param length - The maximum length of the string
 * @returns The truncated string
 */
export function truncateString(str: string, length = 100): string {
  if (!str) return ""
  if (str.length <= length) return str
  return str.slice(0, length) + "..."
}
