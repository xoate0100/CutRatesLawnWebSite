import { services, bundles, testimonials, faqs } from "./static-data"
import type { Service, Bundle, Testimonial, FormResponse, SearchResult } from "./interfaces"

/**
 * API helper functions for the Cut Rates Lawn Care website
 * These functions simulate API calls but use static data for the MVP
 */

// Get all services
export async function getAllServices(): Promise<{ data: Service[] }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return services
}

// Get a service by slug
export async function getServiceBySlug(slug: string): Promise<{ data: Service | null }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const service = services.data.find((service) => service.attributes.slug === slug) || null
  return { data: service }
}

// Get all bundles
export async function getAllBundles(): Promise<{ data: Bundle[] }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return bundles
}

// Get a bundle by slug
export async function getBundleBySlug(slug: string): Promise<{ data: Bundle | null }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const bundle = bundles.data.find((bundle) => bundle.attributes.slug === slug) || null
  return { data: bundle }
}

// Get all testimonials
export async function getAllTestimonials(): Promise<{ data: Testimonial[] }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return testimonials
}

// Get testimonials by service ID
export async function getTestimonialsByService(serviceId: string): Promise<{ data: Testimonial[] }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const filtered = testimonials.data.filter((testimonial) => testimonial.service?.data?.id === serviceId)

  return { data: filtered }
}

// Get all FAQs
export async function getFAQs(): Promise<{ data: any[] }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return { data: faqs }
}

// Submit a quote request
export async function submitQuoteRequest(data: any): Promise<FormResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Log the data in development
  if (process.env.NODE_ENV === "development") {
    console.log("Quote request submitted:", data)
  }

  // Always return success for the MVP
  return {
    success: true,
    message: "Quote request submitted successfully",
  }
}

// Submit a contact form
export async function submitContactForm(data: any): Promise<FormResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Log the data in development
  if (process.env.NODE_ENV === "development") {
    console.log("Contact form submitted:", data)
  }

  // Always return success for the MVP
  return {
    success: true,
    message: "Contact form submitted successfully",
  }
}

// Search services and bundles
export async function searchContent(query: string): Promise<SearchResult> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const normalizedQuery = query.toLowerCase().trim()

  // Search in services
  const matchedServices = services.data
    .filter(
      (service) =>
        service.attributes.title.toLowerCase().includes(normalizedQuery) ||
        service.attributes.description.toLowerCase().includes(normalizedQuery) ||
        (service.attributes.content && service.attributes.content.toLowerCase().includes(normalizedQuery)),
    )
    .map((service) => ({
      ...service,
      contentType: "service",
    }))

  // Search in bundles
  const matchedBundles = bundles.data
    .filter(
      (bundle) =>
        bundle.attributes.title.toLowerCase().includes(normalizedQuery) ||
        bundle.attributes.description.toLowerCase().includes(normalizedQuery) ||
        (bundle.attributes.content && bundle.attributes.content.toLowerCase().includes(normalizedQuery)),
    )
    .map((bundle) => ({
      ...bundle,
      contentType: "bundle",
    }))

  // Combine results
  const results = [...matchedServices, ...matchedBundles]

  return { data: results }
}
