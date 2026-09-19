import { siteConfig } from "@/lib/site-config"
import { GOOGLE_RATING, GOOGLE_REVIEW_COUNT, GOOGLE_MAPS_URL } from "@/lib/google-reviews"
import { KWCH_FEATURE } from "@/lib/press"

/** Server-rendered LocalBusiness JSON-LD from siteConfig NAP. */
export function LocalBusinessJsonLd() {
  const [city, stateZip = ""] = siteConfig.address.cityStateZip.split(",").map((s) => s.trim())
  const stateMatch = stateZip.match(/^([A-Z]{2})\s+(\d{5}(-\d{4})?)$/i)
  const region = stateMatch?.[1] ?? "KS"
  const postal = stateMatch?.[2] ?? "67147"

  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.name,
    description:
      "Family-owned landscaping, lawn care, and pest control from Wichita to Kansas City — termites, rodents, exclusions, bed bugs, holiday lights, and more.",
    url: siteConfig.url,
    telephone: siteConfig.phone.display,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.line1,
      addressLocality: city || "Valley Center",
      addressRegion: region,
      postalCode: postal,
      addressCountry: "US",
    },
    areaServed: [
      { "@type": "City", name: "Wichita" },
      { "@type": "City", name: "Valley Center" },
      { "@type": "City", name: "Kansas City" },
    ],
    priceRange: "$$",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: GOOGLE_RATING,
      reviewCount: GOOGLE_REVIEW_COUNT,
      bestRating: 5,
      worstRating: 1,
    },
    sameAs: [GOOGLE_MAPS_URL, KWCH_FEATURE.url],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Cut Rates services",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Pest Control" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Termite Treatment" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Rodent Control" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Bed Bug Treatment" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Landscaping" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Lawn Care" } },
      ],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}