import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/site-config"
import { getAreaSlugs, getServiceSlugs } from "@/lib/marketing-content"
import { QUOTE_SERVICES } from "@/lib/quote/taxonomy"

const STATIC_PATHS = [
  "/",
  "/about",
  "/contact",
  "/quote",
  "/services",
  "/bundles",
  "/our-work",
  "/faq",
  "/careers",
  "/careers/apply",
  "/service-areas",
  "/blog",
  "/privacy",
  "/terms",
  "/pricing",
  "/schedule",
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const extras = [
    ...getServiceSlugs().map((s) => `/services/${s}`),
    ...QUOTE_SERVICES.map((s) => `/quote/${s.id}`),
    ...getAreaSlugs().map((a) => `/service-areas/${a}`),
    ...getAreaSlugs().flatMap((a) =>
      getServiceSlugs().map((s) => `/service-areas/${a}/${s}`),
    ),
  ]
  return [...STATIC_PATHS, ...Array.from(new Set(extras))].map((path) => ({
    url: `${siteConfig.url}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency: path === "/" || path.startsWith("/quote") ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/quote") ? 0.9 : 0.7,
  }))
}
