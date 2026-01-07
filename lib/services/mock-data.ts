export const mockData = {
  "home-page": {
    data: {
      title: "Cut Rates Lawn Care",
      subtitle: "Professional Lawn Care Services",
      content: "We provide professional lawn care services at competitive rates. Contact us today for a free quote!",
    },
    meta: {
      mock: true,
    },
  },
  // Add more mock data as needed
}

/**
 * Get mock data for a specific path
 */
export function getMockData<T>(path: string): T | null {
  // @ts-ignore - Dynamic access
  return mockData[path] || null
}
