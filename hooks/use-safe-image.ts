"use client"

import { useState, useEffect } from "react"

/**
 * Hook for safely handling image URLs with fallbacks
 * @param imageData - The image data (can be a string URL, an object with url/src, or a Strapi image object)
 * @param fallbackUrl - The fallback URL to use if the image is invalid
 * @returns An object with the safe image URL and loading state
 */
export function useSafeImage(imageData: any, fallbackUrl = "/placeholder.svg?height=400&width=600") {
  const [imageUrl, setImageUrl] = useState<string>(fallbackUrl)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [hasError, setHasError] = useState<boolean>(false)

  useEffect(() => {
    // Reset states when imageData changes
    setIsLoading(true)
    setHasError(false)

    // Extract URL from imageData
    let url = ""

    if (!imageData) {
      setImageUrl(fallbackUrl)
      setIsLoading(false)
      return
    }

    if (typeof imageData === "string") {
      url = imageData
    } else if (imageData?.data?.attributes?.url) {
      url = imageData.data.attributes.url
    } else if (imageData?.url) {
      url = imageData.url
    } else if (imageData?.src) {
      url = imageData.src
    }

    if (!url) {
      setImageUrl(fallbackUrl)
      setIsLoading(false)
      return
    }

    // Create an image object to test loading
    const img = new Image()

    img.onload = () => {
      setImageUrl(url)
      setIsLoading(false)
    }

    img.onerror = () => {
      setImageUrl(fallbackUrl)
      setIsLoading(false)
      setHasError(true)
    }

    img.src = url
  }, [imageData, fallbackUrl])

  return { imageUrl, isLoading, hasError }
}
