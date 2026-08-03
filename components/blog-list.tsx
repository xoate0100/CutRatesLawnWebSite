"use client"

import { Button } from "@/components/ui/button"

import { useState, useEffect } from "react"
import { BlogCard } from "@/components/blog-card"
import { BlogSearch } from "@/components/blog-search"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type { BlogPost } from "@/lib/types"

interface BlogListProps {
  initialPosts?: BlogPost[]
}

export function BlogList({ initialPosts = [] }: BlogListProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts)
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(initialPosts)
  const [isLoading, setIsLoading] = useState(initialPosts.length === 0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialPosts.length === 0) {
      fetchBlogPosts()
    }
  }, [initialPosts])

  const fetchBlogPosts = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data
      const mockPosts: BlogPost[] = [
        {
          id: "1",
          title: "Lawn Care Tips for Summer",
          slug: "lawn-care-tips-summer",
          excerpt: "Keep your lawn looking its best during the hot summer months with these essential tips.",
          content: "Full content here...",
          featuredImage: "/placeholder.jpg?height=300&width=400",
          publishedAt: "2023-06-15T10:00:00Z",
          author: {
            name: "John Smith",
            avatar: "/placeholder.jpg?height=50&width=50",
          },
          categories: ["Lawn Care", "Summer"],
        },
        {
          id: "2",
          title: "How to Deal with Common Lawn Pests",
          slug: "dealing-with-lawn-pests",
          excerpt: "Identify and treat common lawn pests before they cause significant damage.",
          content: "Full content here...",
          featuredImage: "/placeholder.jpg?height=300&width=400",
          publishedAt: "2023-05-22T14:30:00Z",
          author: {
            name: "Sarah Johnson",
            avatar: "/placeholder.jpg?height=50&width=50",
          },
          categories: ["Pest Control", "Lawn Care"],
        },
        {
          id: "3",
          title: "Benefits of Regular Lawn Aeration",
          slug: "benefits-lawn-aeration",
          excerpt: "Learn why aeration is crucial for maintaining a healthy, vibrant lawn.",
          content: "Full content here...",
          featuredImage: "/placeholder.jpg?height=300&width=400",
          publishedAt: "2023-04-10T09:15:00Z",
          author: {
            name: "Mike Williams",
            avatar: "/placeholder.jpg?height=50&width=50",
          },
          categories: ["Lawn Care", "Maintenance"],
        },
      ]

      setPosts(mockPosts)
      setFilteredPosts(mockPosts)
    } catch (err) {
      setError("Failed to load blog posts. Please try again later.")
      console.error("Error fetching blog posts:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredPosts(posts)
      return
    }

    const lowercaseQuery = query.toLowerCase()
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowercaseQuery) ||
        post.excerpt.toLowerCase().includes(lowercaseQuery) ||
        post.categories.some((category) => category.toLowerCase().includes(lowercaseQuery)),
    )

    setFilteredPosts(filtered)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <BlogSearch onSearch={handleSearch} />
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-[300px] w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <BlogSearch onSearch={handleSearch} />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (filteredPosts.length === 0) {
    return (
      <div className="space-y-6">
        <BlogSearch onSearch={handleSearch} />
        <div className="text-center py-12">
          <p className="text-muted-foreground">No blog posts found matching your search criteria.</p>
          <Button variant="link" onClick={() => setFilteredPosts(posts)} className="mt-2">
            Clear search
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <BlogSearch onSearch={handleSearch} />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
