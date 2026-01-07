// API Response Types
export interface ApiResponse<T> {
  data: T
  meta?: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

// Service Types
export interface ServiceType {
  id: string
  attributes: {
    title: string
    slug: string
    shortDescription?: string
    description?: string
    price?: number
    priceUnit?: string
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

// Bundle Types
export interface BundleType {
  id: string
  attributes: {
    title: string
    slug: string
    shortDescription?: string
    description?: string
    price?: number
    priceUnit?: string
    coverImage?: {
      data?: {
        attributes?: {
          url?: string
        }
      }
    }
    services?: {
      data?: any[]
    }
  }
}

// Blog Post Types
export interface PostType {
  id: string
  attributes: {
    title: string
    slug: string
    content: string
    excerpt: string
    coverImage?: any
    author?: {
      data: AuthorType
    }
    categories?: {
      data: CategoryType[]
    }
    tags?: {
      data: TagType[]
    }
    publishedAt: string
    createdAt: string
    updatedAt: string
    viewCount?: number
    featured?: boolean
  }
}

// Author Types
export interface AuthorType {
  id: string
  attributes: {
    name: string
    slug: string
    bio?: string
    avatar?: any
    email?: string
    role?: string
    createdAt: string
    updatedAt: string
  }
}

// Category Types
export interface CategoryType {
  id: string
  attributes: {
    name: string
    slug: string
    description?: string
    createdAt: string
    updatedAt: string
  }
}

// Tag Types
export interface TagType {
  id: string
  attributes: {
    name: string
    slug: string
    createdAt: string
    updatedAt: string
  }
}

// Testimonial Types
export interface TestimonialType {
  id: string
  attributes: {
    name: string
    rating: number
    comment: string
    date: string
    service?: {
      data?: {
        id: string
        attributes: {
          title: string
          slug: string
        }
      }
    }
  }
}

// FAQ Types
export interface FAQType {
  id: string
  attributes: {
    question: string
    answer: string
    category?: {
      data: CategoryType
    }
    createdAt: string
    updatedAt: string
  }
}

// User Types
export interface UserType {
  id: string
  username: string
  email: string
  provider: string
  confirmed: boolean
  blocked: boolean
  createdAt: string
  updatedAt: string
  role: {
    id: number
    name: string
    description: string
    type: string
  }
}

// Form Types
export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export interface QuoteFormData {
  name: string
  email: string
  phone?: string
  address?: string
  serviceType: string
  propertySize: string
  message?: string
}

export interface TestimonialFormData {
  name: string
  email: string
  location?: string
  rating: number
  service?: string
  text: string
}

export interface NewsletterFormData {
  email: string
  name?: string
  interests?: string[]
}

// Error Types
export interface ApiError {
  status: number
  name: string
  message: string
  details?: Record<string, any>
}

// API Response Types
export interface ApiResponse {
  success: boolean
  message?: string
  data?: any
}

export interface Author {
  name: string
  avatar?: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage?: string
  publishedAt: string
  author: Author
  categories: string[]
}

/**
 * Service interface
 */
export interface Service {
  id: number
  attributes: {
    title: string
    slug: string
    description: string
    shortDescription: string
    price: string
    priceUnit: string
    createdAt: string
    updatedAt: string
  }
}

/**
 * Bundle interface
 */
export interface Bundle {
  id: number
  attributes: {
    title: string
    slug: string
    description: string
    shortDescription: string
    price: string
    priceUnit: string
    createdAt: string
    updatedAt: string
    services?: {
      data: Service[]
    }
  }
}

/**
 * Testimonial interface
 */
export interface Testimonial {
  id: number
  attributes: {
    name: string
    text: string
    rating: number
    location: string
    createdAt: string
    updatedAt: string
    service?: {
      data: Service
    }
  }
}

/**
 * Global interface
 */
export interface Global {
  id: number
  attributes: {
    siteName: string
    siteDescription: string
    contactEmail: string
    contactPhone: string
    address: string
    socialLinks: {
      facebook: string
      twitter: string
      instagram: string
    }
    createdAt: string
    updatedAt: string
  }
}

/**
 * Homepage interface
 */
export interface Homepage {
  id: number
  attributes: {
    hero: {
      title: string
      subtitle: string
      cta: string
      ctaLink: string
    }
    featuredServices: {
      title: string
      services: Service[]
    }
    featuredTestimonials: {
      title: string
      testimonials: Testimonial[]
    }
    createdAt: string
    updatedAt: string
  }
}

/**
 * Search result interface
 */
export interface SearchResult {
  id: number
  attributes: {
    title: string
    description?: string
    slug?: string
    contentType: string
    createdAt: string
    updatedAt: string
  }
}
