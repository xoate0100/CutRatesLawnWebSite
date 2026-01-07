import type { PostType, ApiCollectionResponse, AuthorType, CategoryType, TagType } from "./types"
import { handleApiError } from "./error-handling"

// Base API URL from environment variable
const API_URL = process.env.STRAPI_API_URL || "https://api.cutrateslawn.com"
const API_TOKEN = process.env.STRAPI_API_TOKEN || ""

// Helper function to make API requests
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
      ...options.headers,
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    return handleApiError(error, `Error fetching from ${endpoint}`)
  }
}

// Get all blog posts with pagination
export async function getAllPosts(
  pageSize = 10,
  page = 1,
  category?: string,
  tag?: string,
  author?: string,
): Promise<ApiCollectionResponse<PostType>> {
  try {
    let endpoint = `/api/posts?populate=coverImage,author.avatar,categories&pagination[pageSize]=${pageSize}&pagination[page]=${page}`

    if (category) {
      endpoint += `&filters[categories][slug][$eq]=${category}`
    }

    if (tag) {
      endpoint += `&filters[tags][slug][$eq]=${tag}`
    }

    if (author) {
      endpoint += `&filters[author][slug][$eq]=${author}`
    }

    const data = await fetchAPI(endpoint)
    return data
  } catch (error) {
    console.error("Error getting all posts:", error)
    throw error
  }
}

// Get featured blog posts
export async function getFeaturedPosts(limit = 3): Promise<PostType[]> {
  try {
    const data = await fetchAPI(
      `/api/posts?populate=coverImage,author.avatar,categories&filters[featured][$eq]=true&pagination[limit]=${limit}`,
    )
    return data.data || []
  } catch (error) {
    console.error("Error getting featured posts:", error)
    return []
  }
}

// Get recent blog posts
export async function getRecentPosts(limit = 5): Promise<PostType[]> {
  try {
    const data = await fetchAPI(
      `/api/posts?populate=coverImage,author.avatar,categories&sort=publishedAt:desc&pagination[limit]=${limit}`,
    )
    return data.data || []
  } catch (error) {
    console.error("Error getting recent posts:", error)
    return []
  }
}

// Get blog post by slug
export async function getPostBySlug(slug: string): Promise<PostType | null> {
  try {
    const data = await fetchAPI(
      `/api/posts?filters[slug][$eq]=${slug}&populate=coverImage,author.avatar,categories,relatedPosts.coverImage,tags`,
    )
    if (data?.data?.length) {
      return data.data[0]
    }
    return null
  } catch (error) {
    console.error(`Error getting post by slug ${slug}:`, error)
    throw error
  }
}

// Get related posts
export async function getRelatedPosts(postId: string, limit = 3): Promise<PostType[]> {
  try {
    const data = await fetchAPI(
      `/api/posts/${postId}/related?populate=coverImage,author.avatar,categories&pagination[limit]=${limit}`,
    )
    return data.data || []
  } catch (error) {
    console.error(`Error getting related posts for post ${postId}:`, error)
    return []
  }
}

// Get all blog categories
export async function getBlogCategories(): Promise<CategoryType[]> {
  try {
    const data = await fetchAPI("/api/blog-categories?sort=name:asc")
    return data.data || []
  } catch (error) {
    console.error("Error getting blog categories:", error)
    return []
  }
}

// Get all blog tags
export async function getBlogTags(): Promise<TagType[]> {
  try {
    const data = await fetchAPI("/api/blog-tags?sort=name:asc")
    return data.data || []
  } catch (error) {
    console.error("Error getting blog tags:", error)
    return []
  }
}

// Get all blog authors
export async function getBlogAuthors(): Promise<AuthorType[]> {
  try {
    const data = await fetchAPI("/api/authors?populate=avatar")
    return data.data || []
  } catch (error) {
    console.error("Error getting blog authors:", error)
    return []
  }
}

// Get posts by category
export async function getPostsByCategory(
  categorySlug: string,
  pageSize = 10,
  page = 1,
): Promise<ApiCollectionResponse<PostType>> {
  try {
    const endpoint = `/api/posts?filters[categories][slug][$eq]=${categorySlug}&populate=coverImage,author.avatar,categories&pagination[pageSize]=${pageSize}&pagination[page]=${page}`
    const data = await fetchAPI(endpoint)
    return data
  } catch (error) {
    console.error(`Error getting posts by category ${categorySlug}:`, error)
    throw error
  }
}

// Get posts by tag
export async function getPostsByTag(
  tagSlug: string,
  pageSize = 10,
  page = 1,
): Promise<ApiCollectionResponse<PostType>> {
  try {
    const endpoint = `/api/posts?filters[tags][slug][$eq]=${tagSlug}&populate=coverImage,author.avatar,categories&pagination[pageSize]=${pageSize}&pagination[page]=${page}`
    const data = await fetchAPI(endpoint)
    return data
  } catch (error) {
    console.error(`Error getting posts by tag ${tagSlug}:`, error)
    throw error
  }
}

// Get posts by author
export async function getPostsByAuthor(
  authorSlug: string,
  pageSize = 10,
  page = 1,
): Promise<ApiCollectionResponse<PostType>> {
  try {
    const endpoint = `/api/posts?filters[author][slug][$eq]=${authorSlug}&populate=coverImage,author.avatar,categories&pagination[pageSize]=${pageSize}&pagination[page]=${page}`
    const data = await fetchAPI(endpoint)
    return data
  } catch (error) {
    console.error(`Error getting posts by author ${authorSlug}:`, error)
    throw error
  }
}

// Search blog posts
export async function searchBlogPosts(query: string): Promise<PostType[]> {
  try {
    const endpoint = `/api/posts?filters[$or][0][title][$containsi]=${query}&filters[$or][1][content][$containsi]=${query}&populate=coverImage,author.avatar,categories`
    const data = await fetchAPI(endpoint)
    return data.data || []
  } catch (error) {
    console.error(`Error searching blog posts for "${query}":`, error)
    return []
  }
}

// Get post view count (for analytics)
export async function getPostViewCount(slug: string): Promise<number> {
  try {
    // For Phase 3 preparation, we'll simulate the API call
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Mock view count
    return Math.floor(Math.random() * 1000) + 100
  } catch (error) {
    console.error(`Error getting view count for post ${slug}:`, error)
    return 0
  }
}

// Increment post view count
export async function incrementPostViewCount(slug: string): Promise<boolean> {
  try {
    // For Phase 3 preparation, we'll simulate the API call
    await new Promise((resolve) => setTimeout(resolve, 300))

    return true
  } catch (error) {
    console.error(`Error incrementing view count for post ${slug}:`, error)
    return false
  }
}
