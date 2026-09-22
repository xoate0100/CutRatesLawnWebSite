import { SERVICE_AREAS } from "@/lib/marketing-content"

const CITY_HINTS: Record<string, string[]> = {
  wichita: ["wichita", "672"],
  "valley-center": ["valley center", "67147"],
  andover: ["andover", "67002"],
  derby: ["derby", "67037"],
  maize: ["maize", "67101"],
  "kansas-city": ["kansas city", "overland park", "olathe", "lenexa", "shawnee", "661", "662"],
  leavenworth: ["leavenworth", "66048"],
}

export function qualifyAddress(address: string, areaSlug?: string): {
  qualified: boolean
  matchedSlug: string | ""
} {
  const hay = address.trim().toLowerCase()
  if (!hay) return { qualified: false, matchedSlug: "" }
  for (const area of SERVICE_AREAS) {
    const hints = CITY_HINTS[area.slug] ?? [area.name.toLowerCase()]
    if (hints.some((h) => hay.includes(h))) {
      return { qualified: true, matchedSlug: area.slug }
    }
  }
  if (areaSlug && CITY_HINTS[areaSlug]?.some((h) => hay.includes(h))) {
    return { qualified: true, matchedSlug: areaSlug }
  }
  if (/\bks\b|kansas/.test(hay)) return { qualified: true, matchedSlug: areaSlug || "" }
  return { qualified: false, matchedSlug: "" }
}

export function areaLabel(slug: string): string {
  return SERVICE_AREAS.find((a) => a.slug === slug)?.name ?? slug
}
