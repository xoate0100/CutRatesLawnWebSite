import type { Metadata } from "next"

/**
 * Default metadata for the site
 */
export const defaultMetadata: Metadata = {
  title: {
    default: "CutRatesLawn - Professional Lawn Care Services",
    template: "%s | CutRatesLawn",
  },
  description: "Professional lawn care services at competitive rates. Serving the local community since 2010.",
  keywords: ["lawn care", "lawn mowing", "hedge trimming", "fertilization", "weed control"],
  authors: [{ name: "CutRatesLawn" }],
  creator: "CutRatesLawn",
  publisher: "CutRatesLawn",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cutrateslawn.com",
    siteName: "CutRatesLawn",
    title: "CutRatesLawn - Professional Lawn Care Services",
    description: "Professional lawn care services at competitive rates. Serving the local community since 2010.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CutRatesLawn",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CutRatesLawn - Professional Lawn Care Services",
    description: "Professional lawn care services at competitive rates. Serving the local community since 2010.",
    images: ["/images/twitter-image.jpg"],
    creator: "@cutrateslawn",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/apple-touch-icon-precomposed.png",
    },
  },
  manifest: "/site.webmanifest",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
}

/**
 * Creates metadata for a service page
 * @param service - The service data
 * @returns The metadata
 */
export function createServiceMetadata(service: any): Metadata {
  if (!service) {
    return defaultMetadata
  }

  const title = service.attributes.title
  const description = service.attributes.description || defaultMetadata.description
  const imageUrl = service.attributes.image?.data?.attributes?.url || "/images/og-image.jpg"

  return {
    ...defaultMetadata,
    title,
    description,
    openGraph: {
      ...defaultMetadata.openGraph,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      ...defaultMetadata.twitter,
      title,
      description,
      images: [imageUrl],
    },
  }
}

/**
 * Creates metadata for a bundle page
 * @param bundle - The bundle data
 * @returns The metadata
 */
export function createBundleMetadata(bundle: any): Metadata {
  if (!bundle) {
    return defaultMetadata
  }

  const title = bundle.attributes.title
  const description = bundle.attributes.description || defaultMetadata.description
  const imageUrl = bundle.attributes.image?.data?.attributes?.url || "/images/og-image.jpg"

  return {
    ...defaultMetadata,
    title,
    description,
    openGraph: {
      ...defaultMetadata.openGraph,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      ...defaultMetadata.twitter,
      title,
      description,
      images: [imageUrl],
    },
  }
}
