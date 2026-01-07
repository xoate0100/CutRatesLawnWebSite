import type { StrapiData, StrapiResponse } from "./types"

/**
 * Transforms a Strapi response to a simpler format
 * @param response - The Strapi response
 * @returns The transformed data
 */
export function transformStrapiResponse<T, R>(
  response: StrapiResponse<T>,
  transformer: (item: StrapiData<any>) => R,
): R[] {
  if (!response.data) {
    return []
  }

  // Handle single item
  if (!Array.isArray(response.data)) {
    return [transformer(response.data as StrapiData<any>)]
  }

  // Handle array of items
  return response.data.map(transformer)
}

/**
 * Transforms a Strapi service to a simpler format
 * @param service - The Strapi service
 * @returns The transformed service
 */
export function transformService(service: StrapiData<any>): any {
  return {
    id: service.id,
    title: service.attributes.title,
    description: service.attributes.description,
    price: service.attributes.price,
    image: service.attributes.image,
    slug: service.attributes.slug,
  }
}

/**
 * Transforms a Strapi bundle to a simpler format
 * @param bundle - The Strapi bundle
 * @returns The transformed bundle
 */
export function transformBundle(bundle: StrapiData<any>): any {
  return {
    id: bundle.id,
    title: bundle.attributes.title,
    description: bundle.attributes.description,
    price: bundle.attributes.price,
    services: bundle.attributes.services?.data?.map(transformService) || [],
    slug: bundle.attributes.slug,
  }
}

/**
 * Transforms a Strapi testimonial to a simpler format
 * @param testimonial - The Strapi testimonial
 * @returns The transformed testimonial
 */
export function transformTestimonial(testimonial: StrapiData<any>): any {
  return {
    id: testimonial.id,
    name: testimonial.attributes.name,
    comment: testimonial.attributes.comment,
    rating: testimonial.attributes.rating,
    service: testimonial.attributes.service?.data ? transformService(testimonial.attributes.service.data) : null,
  }
}
