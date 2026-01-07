import type { LocalBusiness, WithContext } from "schema-dts"

interface JsonLdProps {
  data: WithContext<LocalBusiness>
}

export function JsonLd({ data }: JsonLdProps) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

/**
 * Creates local business structured data
 * @param companyInfo - The company information
 * @returns The structured data
 */
export function createLocalBusinessData(companyInfo: any): WithContext<LocalBusiness> {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: companyInfo.name || "CutRatesLawn",
    description: companyInfo.description || "Professional lawn care services at competitive rates.",
    url: "https://cutrateslawn.com",
    telephone: companyInfo.phone || "(555) 123-4567",
    email: companyInfo.email || "info@cutrateslawn.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: companyInfo.address || "123 Green Street",
      addressLocality: companyInfo.city || "Lawn City",
      addressRegion: companyInfo.state || "LC",
      postalCode: companyInfo.zip || "12345",
      addressCountry: companyInfo.country || "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: companyInfo.latitude || "40.7128",
      longitude: companyInfo.longitude || "-74.0060",
    },
    openingHours: companyInfo.hours || "Mo-Fr 08:00-18:00, Sa 09:00-16:00",
    image: companyInfo.logo?.data?.attributes?.url || "/images/logo.png",
    priceRange: "$$",
    paymentAccepted: "Cash, Credit Card",
    currenciesAccepted: "USD",
  }
}

/**
 * Creates service structured data
 * @param service - The service data
 * @returns The structured data
 */
export function createServiceData(service: any): any {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.attributes.title,
    description: service.attributes.description,
    provider: {
      "@type": "LocalBusiness",
      name: "CutRatesLawn",
      url: "https://cutrateslawn.com",
    },
    offers: {
      "@type": "Offer",
      price: service.attributes.price,
      priceCurrency: "USD",
    },
    image: service.attributes.image?.data?.attributes?.url || "/images/logo.png",
    url: `https://cutrateslawn.com/services/${service.attributes.slug}`,
  }
}
