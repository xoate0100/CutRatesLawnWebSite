import { getServiceSlugs, SERVICES } from "@/lib/marketing-content"

export type QuoteCategoryId =
  | "lawn"
  | "fert-weed"
  | "pest"
  | "landscape"
  | "snow"
  | "lights"
  | "exterior"
  | "commercial"

export type QuoteServiceId =
  | "mowing"
  | "fertilization"
  | "weed-control"
  | "full-service"
  | "pest-control"
  | "termites"
  | "rodents"
  | "exclusions"
  | "trapping"
  | "bedbugs"
  | "landscaping"
  | "planting"
  | "irrigation"
  | "landscape-maintenance"
  | "holiday-lights"
  | "take-down"
  | "commercial-lights"
  | "snow-removal"
  | "commercial-snow"
  | "seasonal-snow"
  | "power-washing"
  | "driveway"
  | "siding"
  | "decks"
  | "commercial"
  | "landscape-beds"
  | "multi-property"
  | "hardscaping"
  | "patio"
  | "walkways"
  | "retaining-walls"
  | "aeration"
  | "overseeding"
  | "gutter-cleaning"
  | "flow-check"
  | "residential"

/** GHL `service:` tag labels — do not rename without a CRM migration. */
export const GHL_SERVICE_LABELS: Record<QuoteServiceId, string> = {
  mowing: "Lawn Mowing",
  fertilization: "Fertilization",
  "weed-control": "Weed Control",
  "full-service": "Full Service Lawn Care",
  "pest-control": "Pest Control",
  termites: "Termite Protection",
  rodents: "Rodent Control",
  exclusions: "Pest Exclusions",
  trapping: "Wildlife Trapping",
  bedbugs: "Bed Bug Treatment",
  landscaping: "Landscaping",
  planting: "Planting & Beds",
  irrigation: "Irrigation",
  "landscape-maintenance": "Landscape Maintenance",
  "holiday-lights": "Holiday Lights",
  "take-down": "Holiday Light Take-down",
  "commercial-lights": "Commercial Holiday Lights",
  "snow-removal": "Snow Removal",
  "commercial-snow": "Commercial Snow Removal",
  "seasonal-snow": "Seasonal Snow Contract",
  "power-washing": "Power Washing",
  driveway: "Driveway Power Washing",
  siding: "Siding & Exterior Wash",
  decks: "Deck & Fence Wash",
  commercial: "Commercial Maintenance",
  "landscape-beds": "Commercial Beds & Grounds",
  "multi-property": "Multi-property Maintenance",
  hardscaping: "Hardscaping",
  patio: "Patio",
  walkways: "Walks & Steps",
  "retaining-walls": "Retaining Walls",
  aeration: "Aeration & Overseeding",
  overseeding: "Overseeding",
  "gutter-cleaning": "Gutter Cleaning",
  "flow-check": "Gutter Flow Check",
  residential: "Residential Package",
}

/**
 * Allowed values on GHL "Service Requested" (f1Sn1OZOXVB5VwI2xHBB / contact.service_requested).
 * Kept in sync with the live picklist (site labels + phone-only extras). Updated 2026-09-23.
 */
export const GHL_SERVICE_REQUESTED_OPTIONS = [
  ...Object.values(GHL_SERVICE_LABELS),
  // Phone / legacy intake — not top-level quote picks
  "Sod",
  "Drainage",
  "Tree / Shrub work",
  "Hardscape (Patio/Driveway/Walls)",
  "Outdoor Lighting",
  "Snow / Ice",
  "Fertilization / Weed Control",
  "Other",
] as const

export type GhlServiceRequestedOption = (typeof GHL_SERVICE_REQUESTED_OPTIONS)[number]

const SERVICE_REQUESTED_SET = new Set<string>(GHL_SERVICE_REQUESTED_OPTIONS)

/**
 * Value safe to write to contact.service_requested.
 * Prefer the site's canonical label for the quote service id (exact picklist match).
 */
export function mapToGhlServiceRequested(
  serviceId?: string | null,
  serviceLabel?: string | null,
): GhlServiceRequestedOption {
  const id = resolveQuoteService(serviceId || "") || resolveQuoteService(serviceLabel || "")
  if (id) {
    const label = GHL_SERVICE_LABELS[id]
    if (SERVICE_REQUESTED_SET.has(label)) return label as GhlServiceRequestedOption
  }

  const label = (serviceLabel || "").trim()
  if (SERVICE_REQUESTED_SET.has(label)) return label as GhlServiceRequestedOption

  return "Other"
}

export type QuoteServiceDef = {
  id: QuoteServiceId
  label: string
  category: QuoteCategoryId
  servicePageSlug: string
  estimable: boolean
  aliases: string[]
}

export const QUOTE_CATEGORIES: Array<{
  id: QuoteCategoryId
  label: string
  icon: string
}> = [
  { id: "lawn", label: "Lawn Care", icon: "🌿" },
  { id: "fert-weed", label: "Fertilization & Weed", icon: "🌱" },
  // Use Unicode 6–era emoji — 🪲/🪨 often fail to render on Windows Segoe UI Emoji.
  { id: "pest", label: "Pest & Termite", icon: "🐛" },
  { id: "landscape", label: "Landscaping & Hardscape", icon: "🌳" },
  { id: "snow", label: "Snow & Ice", icon: "❄️" },
  { id: "lights", label: "Holiday Lights", icon: "✨" },
  { id: "exterior", label: "Exterior Cleaning", icon: "🚿" },
  { id: "commercial", label: "Commercial", icon: "🏢" },
]

export const QUOTE_SERVICES: QuoteServiceDef[] = [
  { id: "mowing", label: GHL_SERVICE_LABELS.mowing, category: "lawn", servicePageSlug: "lawn-care", estimable: true, aliases: ["lawn-mowing", "lawn-care"] },
  { id: "full-service", label: GHL_SERVICE_LABELS["full-service"], category: "lawn", servicePageSlug: "lawn-care", estimable: true, aliases: ["full-service-lawn-care", "full-yard"] },
  { id: "residential", label: GHL_SERVICE_LABELS.residential, category: "lawn", servicePageSlug: "residential", estimable: false, aliases: ["seasonal-add-ons"] },
  { id: "fertilization", label: GHL_SERVICE_LABELS.fertilization, category: "fert-weed", servicePageSlug: "lawn-care", estimable: true, aliases: ["fertilizing"] },
  { id: "weed-control", label: GHL_SERVICE_LABELS["weed-control"], category: "fert-weed", servicePageSlug: "lawn-care", estimable: true, aliases: ["weeds"] },
  { id: "aeration", label: GHL_SERVICE_LABELS.aeration, category: "fert-weed", servicePageSlug: "aeration", estimable: false, aliases: ["core-aeration", "aeration-overseeding"] },
  { id: "overseeding", label: GHL_SERVICE_LABELS.overseeding, category: "fert-weed", servicePageSlug: "aeration", estimable: false, aliases: [] },
  { id: "pest-control", label: GHL_SERVICE_LABELS["pest-control"], category: "pest", servicePageSlug: "pest-control", estimable: false, aliases: ["pest", "pest-add-on", "general-pest"] },
  { id: "termites", label: GHL_SERVICE_LABELS.termites, category: "pest", servicePageSlug: "pest-control", estimable: false, aliases: ["termite"] },
  { id: "rodents", label: GHL_SERVICE_LABELS.rodents, category: "pest", servicePageSlug: "pest-control", estimable: false, aliases: ["rodent"] },
  { id: "exclusions", label: GHL_SERVICE_LABELS.exclusions, category: "pest", servicePageSlug: "pest-control", estimable: false, aliases: ["exclusion"] },
  { id: "trapping", label: GHL_SERVICE_LABELS.trapping, category: "pest", servicePageSlug: "pest-control", estimable: false, aliases: [] },
  { id: "bedbugs", label: GHL_SERVICE_LABELS.bedbugs, category: "pest", servicePageSlug: "pest-control", estimable: false, aliases: ["bed-bugs"] },
  { id: "landscaping", label: GHL_SERVICE_LABELS.landscaping, category: "landscape", servicePageSlug: "landscaping", estimable: false, aliases: ["landscape"] },
  { id: "planting", label: GHL_SERVICE_LABELS.planting, category: "landscape", servicePageSlug: "landscaping", estimable: false, aliases: [] },
  { id: "irrigation", label: GHL_SERVICE_LABELS.irrigation, category: "landscape", servicePageSlug: "landscaping", estimable: false, aliases: [] },
  { id: "landscape-maintenance", label: GHL_SERVICE_LABELS["landscape-maintenance"], category: "landscape", servicePageSlug: "landscaping", estimable: false, aliases: [] },
  { id: "hardscaping", label: GHL_SERVICE_LABELS.hardscaping, category: "landscape", servicePageSlug: "hardscaping", estimable: false, aliases: ["outdoor-living"] },
  { id: "patio", label: GHL_SERVICE_LABELS.patio, category: "landscape", servicePageSlug: "hardscaping", estimable: false, aliases: [] },
  { id: "walkways", label: GHL_SERVICE_LABELS.walkways, category: "landscape", servicePageSlug: "hardscaping", estimable: false, aliases: [] },
  { id: "retaining-walls", label: GHL_SERVICE_LABELS["retaining-walls"], category: "landscape", servicePageSlug: "hardscaping", estimable: false, aliases: [] },
  { id: "snow-removal", label: GHL_SERVICE_LABELS["snow-removal"], category: "snow", servicePageSlug: "snow-removal", estimable: false, aliases: ["snow", "driveway-snow"] },
  { id: "commercial-snow", label: GHL_SERVICE_LABELS["commercial-snow"], category: "snow", servicePageSlug: "snow-removal", estimable: false, aliases: ["snow-add-on"] },
  { id: "seasonal-snow", label: GHL_SERVICE_LABELS["seasonal-snow"], category: "snow", servicePageSlug: "snow-removal", estimable: false, aliases: [] },
  { id: "holiday-lights", label: GHL_SERVICE_LABELS["holiday-lights"], category: "lights", servicePageSlug: "holiday-lights", estimable: false, aliases: ["holiday-lighting"] },
  { id: "take-down", label: GHL_SERVICE_LABELS["take-down"], category: "lights", servicePageSlug: "holiday-lights", estimable: false, aliases: ["takedown"] },
  { id: "commercial-lights", label: GHL_SERVICE_LABELS["commercial-lights"], category: "lights", servicePageSlug: "holiday-lights", estimable: false, aliases: [] },
  { id: "power-washing", label: GHL_SERVICE_LABELS["power-washing"], category: "exterior", servicePageSlug: "power-washing", estimable: false, aliases: [] },
  { id: "driveway", label: GHL_SERVICE_LABELS.driveway, category: "exterior", servicePageSlug: "power-washing", estimable: false, aliases: [] },
  { id: "siding", label: GHL_SERVICE_LABELS.siding, category: "exterior", servicePageSlug: "power-washing", estimable: false, aliases: [] },
  { id: "decks", label: GHL_SERVICE_LABELS.decks, category: "exterior", servicePageSlug: "power-washing", estimable: false, aliases: [] },
  { id: "gutter-cleaning", label: GHL_SERVICE_LABELS["gutter-cleaning"], category: "exterior", servicePageSlug: "gutter-cleaning", estimable: false, aliases: ["gutter-clean"] },
  { id: "flow-check", label: GHL_SERVICE_LABELS["flow-check"], category: "exterior", servicePageSlug: "gutter-cleaning", estimable: false, aliases: [] },
  { id: "commercial", label: GHL_SERVICE_LABELS.commercial, category: "commercial", servicePageSlug: "commercial", estimable: false, aliases: ["weekly-mowing"] },
  { id: "landscape-beds", label: GHL_SERVICE_LABELS["landscape-beds"], category: "commercial", servicePageSlug: "commercial", estimable: false, aliases: [] },
  { id: "multi-property", label: GHL_SERVICE_LABELS["multi-property"], category: "commercial", servicePageSlug: "commercial", estimable: false, aliases: [] },
]

const BY_ID = new Map(QUOTE_SERVICES.map((s) => [s.id, s]))
const BY_ALIAS = new Map<string, QuoteServiceId>()
for (const s of QUOTE_SERVICES) {
  BY_ALIAS.set(s.id, s.id)
  for (const a of s.aliases) BY_ALIAS.set(a, s.id)
}

export function resolveQuoteService(raw: string | null | undefined): QuoteServiceId | "" {
  if (!raw) return ""
  return BY_ALIAS.get(raw.trim().toLowerCase()) ?? ""
}

export function getQuoteService(id: string): QuoteServiceDef | undefined {
  return BY_ID.get(id as QuoteServiceId)
}

export function servicesInCategory(id: QuoteCategoryId): QuoteServiceDef[] {
  return QUOTE_SERVICES.filter((s) => s.category === id)
}

export function isEstimable(id: string): boolean {
  return Boolean(getQuoteService(id)?.estimable)
}

/** Fail the build-time test if taxonomy drifts from marketing SERVICES slugs. */
export function taxonomyPageSlugs(): string[] {
  return Array.from(new Set(QUOTE_SERVICES.map((s) => s.servicePageSlug))).sort()
}

export function marketingServiceSlugs(): string[] {
  return [...getServiceSlugs()].sort()
}

export function taxonomyDrift(): string[] {
  const tax = new Set(taxonomyPageSlugs())
  const mkt = new Set(marketingServiceSlugs())
  const missing: string[] = []
  for (const s of mkt) if (!tax.has(s)) missing.push(`marketing-only:${s}`)
  for (const s of tax) {
    if (!mkt.has(s) && s !== SERVICES.find((x) => x.id === s)?.id) {
      /* page slugs should be a subset or equal */
    }
    if (!mkt.has(s)) missing.push(`taxonomy-only:${s}`)
  }
  return missing
}
