/**
 * Mock data for development when Strapi is not available
 */

export interface MockDataOptions {
  delay?: number
  shouldFail?: boolean
  errorMessage?: string
}

// Generic mock data store
const mockDataStore: Record<string, any> = {
  "home-page": {
    data: {
      id: 1,
      attributes: {
        title: "Cut Rates Lawn Care",
        subtitle: "Professional Lawn Care Services",
        hero: {
          title: "Quality Lawn Care at Affordable Rates",
          description: "We provide professional lawn care services to keep your yard looking its best all year round.",
          cta: "Get a Free Quote",
        },
        services: [
          {
            id: 1,
            title: "Lawn Mowing",
            description: "Regular lawn mowing to keep your grass at the optimal height for health and appearance.",
            icon: "scissors",
          },
          {
            id: 2,
            title: "Edging & Trimming",
            description: "Precise edging and trimming to give your lawn a clean, manicured look.",
            icon: "ruler",
          },
          {
            id: 3,
            title: "Fertilization",
            description: "Custom fertilization programs to keep your lawn green and healthy.",
            icon: "sprout",
          },
          {
            id: 4,
            title: "Weed Control",
            description: "Effective weed control to keep unwanted plants from taking over your lawn.",
            icon: "ban",
          },
        ],
        about: {
          title: "About Cut Rates Lawn Care",
          description:
            "Cut Rates Lawn Care has been providing quality lawn care services to the community for over 10 years. We take pride in our work and strive to exceed our customers' expectations.",
          image: "/placeholder.svg?height=400&width=600",
        },
        testimonials: [
          {
            id: 1,
            name: "John Smith",
            quote:
              "Cut Rates Lawn Care has been taking care of my lawn for 3 years now. They always do an excellent job!",
            rating: 5,
          },
          {
            id: 2,
            name: "Jane Doe",
            quote: "I've tried several lawn care companies, but Cut Rates is by far the best. Highly recommended!",
            rating: 5,
          },
          {
            id: 3,
            name: "Mike Johnson",
            quote: "Professional, reliable, and affordable. What more could you ask for?",
            rating: 4,
          },
        ],
        contact: {
          title: "Contact Us",
          description: "Get in touch with us for a free quote or to schedule a service.",
          phone: "(555) 123-4567",
          email: "info@cutrateslawn.com",
          address: "123 Main St, Anytown, USA",
        },
      },
    },
  },
  services: {
    data: [
      {
        id: 1,
        attributes: {
          name: "Lawn Mowing",
          description: "Regular lawn mowing to keep your grass at the optimal height for health and appearance.",
          price: "Starting at $30",
          image: "/placeholder.svg?height=300&width=400",
        },
      },
      {
        id: 2,
        attributes: {
          name: "Edging & Trimming",
          description: "Precise edging and trimming to give your lawn a clean, manicured look.",
          price: "Starting at $20",
          image: "/placeholder.svg?height=300&width=400",
        },
      },
      {
        id: 3,
        attributes: {
          name: "Fertilization",
          description: "Custom fertilization programs to keep your lawn green and healthy.",
          price: "Starting at $50",
          image: "/placeholder.svg?height=300&width=400",
        },
      },
      {
        id: 4,
        attributes: {
          name: "Weed Control",
          description: "Effective weed control to keep unwanted plants from taking over your lawn.",
          price: "Starting at $40",
          image: "/placeholder.svg?height=300&width=400",
        },
      },
      {
        id: 5,
        attributes: {
          name: "Aeration",
          description: "Lawn aeration to improve soil drainage and encourage root growth.",
          price: "Starting at $60",
          image: "/placeholder.svg?height=300&width=400",
        },
      },
      {
        id: 6,
        attributes: {
          name: "Overseeding",
          description: "Overseeding to fill in bare spots and improve the density of your lawn.",
          price: "Starting at $45",
          image: "/placeholder.svg?height=300&width=400",
        },
      },
    ],
  },
}

/**
 * Get mock data for a specific endpoint
 */
export async function getMockData<T>(endpoint: string, options: MockDataOptions = {}): Promise<T> {
  const { delay = 500, shouldFail = false, errorMessage = "Mock API error" } = options

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, delay))

  // Simulate API failure if requested
  if (shouldFail) {
    throw new Error(errorMessage)
  }

  // Return mock data if available
  if (endpoint in mockDataStore) {
    return mockDataStore[endpoint] as T
  }

  // Return empty data if endpoint not found
  console.warn(`No mock data available for endpoint: ${endpoint}`)
  return {} as T
}

/**
 * Check if an endpoint has mock data
 */
export function hasMockData(endpoint: string): boolean {
  return endpoint in mockDataStore
}
