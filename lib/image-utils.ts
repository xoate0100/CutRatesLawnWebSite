import { getStrapiURL } from "./api"

/**
 * Image format options
 */
export type ImageFormat = "thumbnail" | "small" | "medium" | "large" | "original"

/**
 * Image size configuration
 */
export interface ImageSize {
  width: number
  height: number
}

/**
 * Default image sizes
 */
export const IMAGE_SIZES: Record<ImageFormat, ImageSize> = {
  thumbnail: { width: 100, height: 100 },
  small: { width: 300, height: 200 },
  medium: { width: 600, height: 400 },
  large: { width: 1200, height: 800 },
  original: { width: 0, height: 0 }, // Original size
}

/**
 * Image sizes for responsive images
 */
export enum OldImageSize {
  THUMBNAIL = "thumbnail",
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
  ORIGINAL = "original",
}

/**
 * Image format options
 */
export enum OldImageFormat {
  WEBP = "webp",
  JPEG = "jpeg",
  PNG = "png",
  AVIF = "avif",
}

/**
 * Interface for image transformation options
 */
export interface ImageTransformOptions {
  width?: number
  height?: number
  format?: ImageFormat
  quality?: number
  fit?: "cover" | "contain" | "fill"
}

/**
 * Gets the URL for a Strapi image with the specified size
 * @param imageData - The image data from Strapi
 * @param size - The desired image size
 * @param fallback - Optional fallback URL
 * @returns The URL for the image with the specified size
 */
export function getStrapiImageUrl(
  imageData: any,
  size: ImageFormat = "medium",
  fallback = "/placeholder.svg?height=400&width=600",
): string {
  if (!imageData) return fallback

  // Handle case where imageData is just a string URL
  if (typeof imageData === "string") {
    return getSafeImageUrl(imageData, fallback)
  }

  // Handle case where imageData is a Strapi media object
  if (imageData.data && imageData.data.attributes) {
    const { formats, url } = imageData.data.attributes

    // If the requested size exists, use it
    if (formats && formats[size] && formats[size].url) {
      return getSafeImageUrl(formats[size].url, fallback)
    }

    // Otherwise, fall back to the original URL
    if (url) {
      return getSafeImageUrl(url, fallback)
    }
  }

  // Handle case where imageData is a direct attributes object
  if (imageData.formats && imageData.url) {
    // If the requested size exists, use it
    if (imageData.formats[size] && imageData.formats[size].url) {
      return getSafeImageUrl(imageData.formats[size].url, fallback)
    }

    // Otherwise, fall back to the original URL
    return getSafeImageUrl(imageData.url, fallback)
  }

  // If we can't find a suitable URL, return the fallback
  return fallback
}

/**
 * Gets a safe image URL, handling both relative and absolute URLs
 * @param url The image URL
 * @returns A safe image URL or a placeholder
 */
export function getSafeImageUrl(
  url: string | undefined | null,
  fallback = "/placeholder.svg?height=400&width=600",
): string {
  console.log("getSafeImageUrl called with:", url)

  if (!url) {
    console.log("No URL provided, returning placeholder")
    return "/placeholder.svg?height=600&width=800"
  }

  // If the URL is already absolute, return it
  if (url.startsWith("http://") || url.startsWith("https://")) {
    console.log("Absolute URL detected, returning as is")
    return url
  }

  // If it's a relative URL, prepend the Strapi URL
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || process.env.STRAPI_API_URL || "http://localhost:1337"
  console.log(`Relative URL detected, prepending base URL: ${baseUrl}`)
  return `${baseUrl}${url}`
}

/**
 * Image size options for responsive images
 */
export enum ResponsiveImageSize {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
}

/**
 * Gets the appropriate image URL for the given size
 * @param image The image object from Strapi
 * @param size The desired size
 * @returns The URL for the image at the specified size
 */
export function getResponsiveImageUrl(image: any, size: ResponsiveImageSize = ResponsiveImageSize.MEDIUM): string {
  if (!image || !image.data || !image.data.attributes) {
    return "/placeholder.svg?height=600&width=800"
  }

  const { formats } = image.data.attributes

  if (!formats) {
    return getSafeImageUrl(image.data.attributes.url)
  }

  switch (size) {
    case ResponsiveImageSize.SMALL:
      return getSafeImageUrl(formats.thumbnail?.url || formats.small?.url || image.data.attributes.url)
    case ResponsiveImageSize.MEDIUM:
      return getSafeImageUrl(formats.small?.url || formats.medium?.url || image.data.attributes.url)
    case ResponsiveImageSize.LARGE:
      return getSafeImageUrl(formats.medium?.url || formats.large?.url || image.data.attributes.url)
    default:
      return getSafeImageUrl(image.data.attributes.url)
  }
}

/**
 * Gets responsive image sources for different screen sizes
 * @param image - The image object from Strapi
 * @param fallback - Fallback URL if image is not available
 * @returns Object with srcSet and sizes for responsive images
 */
export function getResponsiveImageSources(
  image: any,
  fallback = "/placeholder.svg?height=400&width=600",
): { src: string; srcSet: string; sizes: string } {
  // Check if image exists
  if (!image || !image.data || !image.data.attributes) {
    return {
      src: fallback,
      srcSet: "",
      sizes: "",
    }
  }

  const { attributes } = image.data

  // If formats don't exist, return the original URL
  if (!attributes.formats) {
    const src = attributes.url.startsWith("http") ? attributes.url : getStrapiURL(attributes.url)

    return {
      src,
      srcSet: "",
      sizes: "",
    }
  }

  // Build srcSet from available formats
  const srcSetParts: string[] = []
  const formats: ImageFormat[] = ["thumbnail", "small", "medium", "large"]

  for (const format of formats) {
    if (attributes.formats[format]) {
      const url = attributes.formats[format].url
      const width = attributes.formats[format].width
      const fullUrl = url.startsWith("http") ? url : getStrapiURL(url)
      srcSetParts.push(`${fullUrl} ${width}w`)
    }
  }

  // Add original image to srcSet
  const originalUrl = attributes.url.startsWith("http") ? attributes.url : getStrapiURL(attributes.url)
  srcSetParts.push(`${originalUrl} ${attributes.width}w`)

  // Build sizes attribute
  const sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"

  return {
    src: originalUrl,
    srcSet: srcSetParts.join(", "),
    sizes,
  }
}

/**
 * Generates a placeholder image URL with the specified dimensions
 * @param width - The width of the placeholder image
 * @param height - The height of the placeholder image
 * @param text - Optional text to display on the placeholder
 * @returns A placeholder image URL
 */
export function getPlaceholderImageUrl(width = 600, height = 400, text = "Image"): string {
  return `/placeholder.svg?height=${height}&width=${width}&text=${encodeURIComponent(text)}`
}

/**
 * Creates a placeholder image URL
 * @param width - The width of the placeholder
 * @param height - The height of the placeholder
 * @param text - Optional text to display on the placeholder
 * @returns The placeholder URL
 */
export function createPlaceholder(width = 600, height = 400, text = ""): string {
  const encodedText = encodeURIComponent(text)
  return `/placeholder.svg?width=${width}&height=${height}${text ? `&text=${encodedText}` : ""}`
}

/**
 * Optimizes an image URL for a specific size
 * @param url - The original image URL
 * @param width - The desired width
 * @param height - The desired height
 * @returns The optimized image URL
 */
export function optimizeImageUrl(url: string, width: number, height: number): string {
  // If it's already a placeholder, update the dimensions
  if (url.includes("/placeholder.svg")) {
    const urlObj = new URL(url, "http://example.com")
    urlObj.searchParams.set("width", width.toString())
    urlObj.searchParams.set("height", height.toString())
    return urlObj.pathname + urlObj.search
  }

  // For Strapi images, we can use the query parameters for optimization
  if (url.includes("/uploads/")) {
    return `${url}?width=${width}&height=${height}`
  }

  // For other images, return the original URL
  return url
}

/**
 * Checks if an image URL is valid
 * @param url - The image URL to check
 * @returns A promise that resolves to true if the image is valid, false otherwise
 */
export async function isImageUrlValid(url: string): Promise<boolean> {
  if (!url) return false

  try {
    const response = await fetch(url, { method: "HEAD" })
    const contentType = response.headers.get("content-type")
    return response.ok && contentType ? contentType.startsWith("image/") : false
  } catch (error) {
    console.error("Error checking image URL:", error)
    return false
  }
}

/**
 * Preloads an image to ensure it's in the browser cache
 * @param url - The image URL to preload
 * @returns A promise that resolves when the image is loaded
 */
export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = url
  })
}
