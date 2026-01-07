/**
 * Fallback data for development and testing
 */
export const fallbackData = {
  services: [
    {
      id: 1,
      title: "Basic Lawn Mowing",
      description: "Regular lawn mowing service to keep your yard looking neat and tidy.",
      price: 35,
    },
    {
      id: 2,
      title: "Lawn Fertilization",
      description: "Nutrient-rich fertilization to promote healthy grass growth.",
      price: 65,
    },
    {
      id: 3,
      title: "Weed Control",
      description: "Targeted weed control to keep your lawn free of unwanted plants.",
      price: 55,
    },
    {
      id: 4,
      title: "Hedge Trimming",
      description: "Professional hedge trimming to maintain shape and promote healthy growth.",
      price: 45,
    },
  ],
  testimonials: [
    {
      id: 1,
      name: "John Smith",
      rating: 5,
      comment:
        "CutRates has been maintaining my lawn for over a year now, and I couldn't be happier with their service. Always on time and thorough!",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      rating: 4,
      comment: "Great service at a reasonable price. My lawn has never looked better!",
    },
    {
      id: 3,
      name: "Michael Brown",
      rating: 5,
      comment: "The team is professional, friendly, and does an excellent job. Highly recommend!",
    },
  ],
}

/**
 * Get fallback data for a content type
 */
export function getFallbackData<T>(contentType: string): T[] {
  return (fallbackData[contentType as keyof typeof fallbackData] || []) as T[]
}
