/**
 * Type definitions for the application data
 * These interfaces define the shape of our data and help with type safety
 */

// Base content interface
export interface BaseContent {
  id: string
  attributes: {
    title: string
    slug: string
    description: string
    shortDescription?: string
  }
}

// Service interface
export interface Service extends BaseContent {
  attributes: {
    title: string
    slug: string
    description: string
    shortDescription?: string
    content?: string
    price: number
    priceUnit: string
    featured: boolean
    coverImage?: {
      data?: {
        attributes?: {
          url?: string
        }
      }
    }
    icon?: string
  }
}

// Bundle interface
export interface Bundle extends BaseContent {
  attributes: {
    title: string
    slug: string
    description: string
    shortDescription?: string
    content?: string
    price: number
    priceUnit: string
    featured: boolean
    coverImage?: {
      data?: {
        attributes?: {
          url?: string
        }
      }
    }
    services?: {
      data: Service[]
    }
  }
}

// Testimonial interface
export interface Testimonial {
  id: string
  attributes: {
    name: string
    comment: string
    text: string
    rating: number
    location: string
    service?: {
      data?: {
        id: string
        attributes: {
          title: string
          slug: string
        }
      }
    }
    image?: {
      data?: {
        attributes?: {
          url?: string
        }
      }
    }
  }
}

// Company information interface
export interface CompanyInfo {
  name: string
  phone: string
  email: string
  address: string
  hours: string
  socialMedia: {
    facebook: string
    instagram: string
    twitter: string
  }
  serviceAreas: string[]
}

// FAQ interface
export interface FAQ {
  question: string
  answer: string
}

// Hero content interface
export interface HeroContent {
  title: string
  description: string
  ctaText: string
  ctaLink: string
  image: string
}

// Features content interface
export interface FeaturesContent {
  title: string
  features: {
    title: string
    description: string
    icon: string
  }[]
}

// CTA content interface
export interface CTAContent {
  title: string
  description: string
  primaryButtonText: string
  primaryButtonLink: string
  secondaryButtonText: string
  secondaryButtonLink: string
}

// Form submission response interface
export interface FormResponse {
  success: boolean
  message: string
}

// Search result interface
export interface SearchResult {
  data: (Service | (Bundle & { contentType: string }))[]
}
