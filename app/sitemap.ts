import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/site-config"

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
  return STATIC_PATHS.map((path) => ({
    url: `${siteConfig.url}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency: path === "/" || path === "/quote" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/quote" || path === "/careers" ? 0.9 : 0.7,
  }))
}
