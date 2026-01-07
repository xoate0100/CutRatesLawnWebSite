"use client"

import { useState, useEffect, useCallback } from "react"
import type { PostType, CategoryType, TagType } from "@/lib/types"
import {
  getAllPosts,
  getPostBySlug,
  getFeaturedPosts,
  getRecentPosts,
  getBlogCategories,
  getBlogTags,
  searchBlogPosts,
  incrementPostViewCount,
} from "@/lib/blog-api"

// Hook for fetching blog posts with pagination
export function useBlogPosts(initialPage = 1, pageSize = 10, category?: string, tag?: string, author?: string) {
  const [posts, setPosts] = useState<PostType[]>([])
  const [pagination, setPagination] = useState({
    page: initialPage,
    pageSize,
    pageCount: 0,
    total: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = useCallback(
    async (page: number) => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await getAllPosts(pageSize, page, category, tag, author)
        setPosts(response.data)
        setPagination(
          response.meta.pagination || {
            page,
            pageSize,
            pageCount: 0,
            total: 0,
          },
        )
      } catch (err) {
        console.error("Error fetching blog posts:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch blog posts")
      } finally {
        setIsLoading(false)
      }
    },
    [pageSize, category, tag, author],
  )

  useEffect(() => {
    fetchPosts(initialPage)
  }, [fetchPosts, initialPage])

  const changePage = (newPage: number) => {
    fetchPosts(newPage)
  }

  return {
    posts,
    pagination,
    isLoading,
    error,
    changePage,
  }
}

// Hook for fetching a single blog post
export function useBlogPost(slug: string) {
  const [post, setPost] = useState<PostType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await getPostBySlug(slug)
        setPost(data)

        // Increment view count
        if (data) {
          incrementPostViewCount(slug).catch(console.error)
        }
      } catch (err) {
        console.error(`Error fetching blog post ${slug}:`, err)
        setError(err instanceof Error ? err.message : "Failed to fetch blog post")
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      fetchPost()
    }
  }, [slug])

  return {
    post,
    isLoading,
    error,
  }
}

// Hook for fetching featured blog posts
export function useFeaturedPosts(limit = 3) {
  const [posts, setPosts] = useState<PostType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await getFeaturedPosts(limit)
        setPosts(data)
      } catch (err) {
        console.error("Error fetching featured posts:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch featured posts")
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedPosts()
  }, [limit])

  return {
    posts,
    isLoading,
    error,
  }
}

// Hook for fetching recent blog posts
export function useRecentPosts(limit = 5) {
  const [posts, setPosts] = useState<PostType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecentPosts = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await getRecentPosts(limit)
        setPosts(data)
      } catch (err) {
        console.error("Error fetching recent posts:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch recent posts")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentPosts()
  }, [limit])

  return {
    posts,
    isLoading,
    error,
  }
}

// Hook for fetching blog categories
export function useBlogCategories() {
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await getBlogCategories()
        setCategories(data)
      } catch (err) {
        console.error("Error fetching blog categories:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch blog categories")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return {
    categories,
    isLoading,
    error,
  }
}

// Hook for fetching blog tags
export function useBlogTags() {
  const [tags, setTags] = useState<TagType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTags = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await getBlogTags()
        setTags(data)
      } catch (err) {
        console.error("Error fetching blog tags:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch blog tags")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTags()
  }, [])

  return {
    tags,
    isLoading,
    error,
  }
}

// Hook for searching blog posts
export function useSearchBlogPosts() {
  const [posts, setPosts] = useState<PostType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (query: string) => {
    if (!query || query.trim() === "") {
      setPosts([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const data = await searchBlogPosts(query)
      setPosts(data)
    } catch (err) {
      console.error(`Error searching blog posts for "${query}":`, err)
      setError(err instanceof Error ? err.message : "Failed to search blog posts")
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    posts,
    isLoading,
    error,
    search,
  }
}
