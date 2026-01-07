import type { SearchResultType, SearchResultsType } from "./types"

// Search API functions
export async function performSearch(query: string): Promise<SearchResultsType> {
  try {
    if (!query || query.trim() === "") {
      return {
        query: "",
        results: [],
        totalResults: 0,
        categories: {
          services: 0,
          bundles: 0,
          posts: 0,
          faqs: 0,
        },
      }
    }

    // For Phase 3 preparation, we'll simulate the API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock search results
    const mockResults: SearchResultType[] = [
      {
        type: "service",
        id: "1",
        title: "Lawn Mowing",
        description: "Professional lawn mowing services for residential and commercial properties.",
        slug: "lawn-mowing",
        url: "/services/lawn-mowing",
        image: "/placeholder.svg?height=200&width=300",
        category: "Residential",
      },
      {
        type: "bundle",
        id: "2",
        title: "Basic Lawn Care",
        description: "Essential lawn maintenance for homeowners",
        slug: "basic-lawn-care",
        url: "/bundles/basic-lawn-care",
        image: "/placeholder.svg?height=200&width=300",
        category: "Residential",
      },
      {
        type: "post",
        id: "3",
        title: "Lawn Care Tips for Summer",
        description: "Keep your lawn healthy during hot summer months with these tips.",
        slug: "lawn-care-tips-summer",
        url: "/blog/lawn-care-tips-summer",
        image: "/placeholder.svg?height=200&width=300",
        category: "Lawn Care",
      },
      {
        type: "faq",
        id: "4",
        title: "How often should I mow my lawn?",
        description: "The frequency of lawn mowing depends on the season and growth rate.",
        slug: "how-often-mow-lawn",
        url: "/faqs#how-often-mow-lawn",
        category: "Lawn Maintenance",
      },
    ]

    // Filter results based on query
    const filteredResults = mockResults.filter(
      (result) =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase()),
    )

    // Count results by category
    const serviceResults = filteredResults.filter((r) => r.type === "service")
    const bundleResults = filteredResults.filter((r) => r.type === "bundle")
    const postResults = filteredResults.filter((r) => r.type === "post")
    const faqResults = filteredResults.filter((r) => r.type === "faq")

    return {
      query,
      results: filteredResults,
      totalResults: filteredResults.length,
      categories: {
        services: serviceResults.length,
        bundles: bundleResults.length,
        posts: postResults.length,
        faqs: faqResults.length,
      },
    }
  } catch (error) {
    console.error("Search error:", error)
    return {
      query,
      results: [],
      totalResults: 0,
      categories: {
        services: 0,
        bundles: 0,
        posts: 0,
        faqs: 0,
      },
    }
  }
}

// Search by content type
export async function searchServices(query: string): Promise<SearchResultType[]> {
  try {
    const results = await performSearch(query)
    return results.results.filter((result) => result.type === "service")
  } catch (error) {
    console.error("Service search error:", error)
    return []
  }
}

export async function searchBundles(query: string): Promise<SearchResultType[]> {
  try {
    const results = await performSearch(query)
    return results.results.filter((result) => result.type === "bundle")
  } catch (error) {
    console.error("Bundle search error:", error)
    return []
  }
}

export async function searchPosts(query: string): Promise<SearchResultType[]> {
  try {
    const results = await performSearch(query)
    return results.results.filter((result) => result.type === "post")
  } catch (error) {
    console.error("Post search error:", error)
    return []
  }
}

export async function searchFAQs(query: string): Promise<SearchResultType[]> {
  try {
    const results = await performSearch(query)
    return results.results.filter((result) => result.type === "faq")
  } catch (error) {
    console.error("FAQ search error:", error)
    return []
  }
}

// Search hook (client-side)
export function useSearch() {
  const search = async (query: string) => {
    return await performSearch(query)
  }

  return { search }
}
