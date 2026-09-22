import type { QuoteServiceId } from "./taxonomy"

export type FieldType =
  | "text"
  | "tel"
  | "email"
  | "number"
  | "select"
  | "radio"
  | "chips"
  | "slider"
  | "textarea"
  | "multiselect"

export type QuoteField = {
  key: string
  label: string
  type: FieldType
  sendToCrm: boolean
  required?: boolean
  help?: string
  options?: { value: string; label: string }[]
  min?: number
  max?: number
  step?: number
  inputMode?: string
  autoComplete?: string
  enterKeyHint?: string
  placeholder?: string
}

const lawnFields: QuoteField[] = [
  { key: "propertyType", label: "Property type", type: "radio", sendToCrm: true, required: true, options: [{ value: "residential", label: "Residential" }, { value: "commercial", label: "Commercial" }] },
  { key: "lawnSizeSqFt", label: "Lawn size (sq ft)", type: "slider", sendToCrm: true, required: true, min: 500, max: 15000, step: 250 },
  { key: "frequency", label: "Frequency", type: "radio", sendToCrm: true, required: true, options: [{ value: "weekly", label: "Weekly" }, { value: "biweekly", label: "Bi-weekly" }] },
  { key: "mowTier", label: "Package", type: "chips", sendToCrm: true, options: [{ value: "standard", label: "Green Standard" }, { value: "complete", label: "Complete" }, { value: "premier", label: "Premier" }] },
]

const aerationFields: QuoteField[] = [
  { key: "lawnSizeSqFt", label: "Lawn size (sq ft)", type: "slider", sendToCrm: true, required: true, min: 500, max: 15000, step: 250 },
  { key: "turfCondition", label: "Current turf", type: "chips", sendToCrm: true, options: [{ value: "thin", label: "Thin / patchy" }, { value: "ok", label: "Mostly healthy" }, { value: "thick", label: "Thick" }] },
  { key: "lastAerated", label: "Last aerated", type: "chips", sendToCrm: true, options: [{ value: "never", label: "Never / unknown" }, { value: "1y", label: "Within a year" }, { value: "2y", label: "Over a year" }] },
]

const termiteFields: QuoteField[] = [
  { key: "homeSquareFeet", label: "Home square feet", type: "number", sendToCrm: true, required: true, inputMode: "numeric", min: 400, max: 20000 },
  { key: "foundationType", label: "Foundation", type: "chips", sendToCrm: true, required: true, options: [{ value: "slab", label: "Slab" }, { value: "crawl", label: "Crawl space" }, { value: "basement", label: "Basement" }] },
  { key: "stories", label: "Stories", type: "chips", sendToCrm: true, options: [{ value: "1", label: "1" }, { value: "2", label: "2" }, { value: "3+", label: "3+" }] },
  { key: "sightingVsPrevention", label: "Need", type: "chips", sendToCrm: true, required: true, options: [{ value: "active", label: "Active sighting" }, { value: "prevention", label: "Prevention" }, { value: "real-estate", label: "Real-estate deadline" }] },
  { key: "realEstateDeadline", label: "Closing / deadline", type: "text", sendToCrm: true, autoComplete: "off", placeholder: "e.g. closing in 2 weeks" },
]

const pestFields: QuoteField[] = [
  { key: "homeSquareFeet", label: "Home square feet", type: "number", sendToCrm: true, inputMode: "numeric" },
  { key: "pestType", label: "Pest", type: "chips", sendToCrm: true, required: true, options: [{ value: "ants", label: "Ants" }, { value: "roaches", label: "Roaches" }, { value: "spiders", label: "Spiders" }, { value: "wasps", label: "Wasps" }, { value: "mice", label: "Mice" }, { value: "other", label: "Other" }] },
  { key: "indoorOutdoor", label: "Where", type: "chips", sendToCrm: true, options: [{ value: "indoor", label: "Indoor" }, { value: "outdoor", label: "Outdoor" }, { value: "both", label: "Both" }] },
  { key: "urgency", label: "Urgency", type: "chips", sendToCrm: true, options: [{ value: "today", label: "Today / tomorrow" }, { value: "week", label: "This week" }, { value: "planning", label: "Planning" }] },
  { key: "priorTreatment", label: "Prior treatment", type: "chips", sendToCrm: true, options: [{ value: "no", label: "None" }, { value: "yes", label: "Yes" }, { value: "unsure", label: "Not sure" }] },
]

const snowFields: QuoteField[] = [
  { key: "lotSizeBand", label: "Driveway / lot size", type: "chips", sendToCrm: true, required: true, options: [{ value: "short", label: "Short residential" }, { value: "long", label: "Long / circle drive" }, { value: "lot", label: "Parking lot" }] },
  { key: "surface", label: "Surface", type: "chips", sendToCrm: true, options: [{ value: "asphalt", label: "Asphalt" }, { value: "concrete", label: "Concrete" }, { value: "gravel", label: "Gravel" }] },
  { key: "propertyType", label: "Property type", type: "radio", sendToCrm: true, options: [{ value: "residential", label: "Residential" }, { value: "commercial", label: "Commercial" }] },
  { key: "triggerDepth", label: "Trigger depth", type: "chips", sendToCrm: true, options: [{ value: "1", label: "1 inch" }, { value: "2", label: "2 inches" }, { value: "on-call", label: "On call" }] },
  { key: "salting", label: "Salting", type: "chips", sendToCrm: true, options: [{ value: "yes", label: "Include salt" }, { value: "no", label: "Plow only" }] },
  { key: "seasonalVsPerPush", label: "Contract", type: "chips", sendToCrm: true, options: [{ value: "per-push", label: "Per push" }, { value: "seasonal", label: "Seasonal" }] },
]

const lightsFields: QuoteField[] = [
  { key: "rooflineFt", label: "Roofline (linear ft)", type: "number", sendToCrm: true, inputMode: "numeric" },
  { key: "stories", label: "Stories", type: "chips", sendToCrm: true, options: [{ value: "1", label: "1" }, { value: "2", label: "2" }, { value: "3+", label: "3+" }] },
  { key: "roofAccess", label: "Roof access / pitch", type: "chips", sendToCrm: true, options: [{ value: "easy", label: "Easy" }, { value: "steep", label: "Steep" }, { value: "unsure", label: "Not sure" }] },
  { key: "installTakedown", label: "Scope", type: "multiselect", sendToCrm: true, options: [{ value: "install", label: "Install" }, { value: "takedown", label: "Take-down" }, { value: "storage", label: "Storage" }] },
  { key: "materials", label: "Lights", type: "chips", sendToCrm: true, options: [{ value: "ours", label: "You supply" }, { value: "theirs", label: "We supply" }, { value: "unsure", label: "Not sure" }] },
]

const gutterFields: QuoteField[] = [
  { key: "stories", label: "Stories", type: "chips", sendToCrm: true, options: [{ value: "1", label: "1" }, { value: "2", label: "2" }, { value: "3+", label: "3+" }] },
  { key: "gutterFt", label: "Gutter length (ft)", type: "number", sendToCrm: true, inputMode: "numeric" },
  { key: "guardsInstalled", label: "Guards installed", type: "chips", sendToCrm: true, options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "unsure", label: "Not sure" }] },
  { key: "roofType", label: "Roof type", type: "chips", sendToCrm: true, options: [{ value: "shingle", label: "Shingle" }, { value: "metal", label: "Metal" }, { value: "other", label: "Other" }] },
]

const washFields: QuoteField[] = [
  { key: "surfaces", label: "Surfaces", type: "multiselect", sendToCrm: true, required: true, options: [{ value: "driveway", label: "Driveway" }, { value: "siding", label: "Siding" }, { value: "deck", label: "Deck" }, { value: "fence", label: "Fence" }] },
  { key: "approxArea", label: "Approx. area", type: "chips", sendToCrm: true, options: [{ value: "small", label: "Small" }, { value: "medium", label: "Medium" }, { value: "large", label: "Large" }] },
  { key: "lastCleaned", label: "Last cleaned", type: "chips", sendToCrm: true, options: [{ value: "year", label: "This year" }, { value: "never", label: "Never / years" }, { value: "unsure", label: "Not sure" }] },
]

const landscapeFields: QuoteField[] = [
  { key: "projectType", label: "Project type", type: "chips", sendToCrm: true, options: [{ value: "beds", label: "Beds / planting" }, { value: "hardscape", label: "Hardscape" }, { value: "full", label: "Full redesign" }, { value: "irrigation", label: "Irrigation" }] },
  { key: "budgetBand", label: "Budget band", type: "chips", sendToCrm: true, required: true, help: "Helps us quote the right crew — not a commitment.", options: [{ value: "lt2k", label: "Under $2k" }, { value: "2to5k", label: "$2–5k" }, { value: "5to15k", label: "$5–15k" }, { value: "15kplus", label: "$15k+" }, { value: "unsure", label: "Not sure" }] },
  { key: "timeline", label: "Timeline", type: "chips", sendToCrm: true, options: [{ value: "asap", label: "ASAP" }, { value: "month", label: "This month" }, { value: "season", label: "This season" }, { value: "planning", label: "Just planning" }] },
  { key: "designNeeded", label: "Design needed", type: "chips", sendToCrm: true, options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No — I know what I want" }] },
  { key: "photoNote", label: "Photos", type: "text", sendToCrm: false, placeholder: "You can share photos after we reply." },
]

const commercialFields: QuoteField[] = [
  { key: "propertyCount", label: "Number of properties", type: "number", sendToCrm: true, inputMode: "numeric", min: 1, max: 99 },
  { key: "siteType", label: "Site type", type: "chips", sendToCrm: true, options: [{ value: "office", label: "Office" }, { value: "retail", label: "Retail" }, { value: "hoa", label: "HOA / apartments" }, { value: "industrial", label: "Industrial" }] },
  { key: "contractCycle", label: "Contract cycle", type: "chips", sendToCrm: true, options: [{ value: "month", label: "Month-to-month" }, { value: "season", label: "Seasonal" }, { value: "annual", label: "Annual" }] },
  { key: "decisionTimeline", label: "Decision timing", type: "chips", sendToCrm: true, options: [{ value: "week", label: "This week" }, { value: "month", label: "This month" }, { value: "quarter", label: "This quarter" }] },
  { key: "coiRequired", label: "COI / insurance", type: "chips", sendToCrm: true, options: [{ value: "yes", label: "Required" }, { value: "no", label: "Not required" }] },
  { key: "currentVendor", label: "Current vendor", type: "chips", sendToCrm: true, options: [{ value: "yes", label: "Have one" }, { value: "no", label: "None" }] },
]

const SCHEMA: Record<QuoteServiceId, QuoteField[]> = {
  mowing: lawnFields,
  fertilization: lawnFields.filter((f) => f.key !== "mowTier" && f.key !== "frequency"),
  "weed-control": lawnFields.filter((f) => f.key !== "mowTier" && f.key !== "frequency"),
  "full-service": lawnFields,
  residential: lawnFields,
  aeration: aerationFields,
  overseeding: aerationFields,
  termites: termiteFields,
  "pest-control": pestFields,
  rodents: pestFields,
  exclusions: pestFields,
  trapping: pestFields,
  bedbugs: pestFields,
  "snow-removal": snowFields,
  "commercial-snow": snowFields,
  "seasonal-snow": snowFields,
  "holiday-lights": lightsFields,
  "take-down": lightsFields,
  "commercial-lights": lightsFields,
  "gutter-cleaning": gutterFields,
  "flow-check": gutterFields,
  "power-washing": washFields,
  driveway: washFields,
  siding: washFields,
  decks: washFields,
  landscaping: landscapeFields,
  planting: landscapeFields,
  irrigation: landscapeFields,
  "landscape-maintenance": landscapeFields,
  hardscaping: landscapeFields,
  patio: landscapeFields,
  walkways: landscapeFields,
  "retaining-walls": landscapeFields,
  commercial: commercialFields,
  "landscape-beds": commercialFields,
  "multi-property": commercialFields,
}

export const IDENTITY_FIELDS: QuoteField[] = [
  { key: "name", label: "Name", type: "text", sendToCrm: true, required: true, autoComplete: "name", enterKeyHint: "next" },
  { key: "phone", label: "Mobile", type: "tel", sendToCrm: true, required: true, inputMode: "tel", autoComplete: "tel", enterKeyHint: "next" },
  { key: "email", label: "Email (optional)", type: "email", sendToCrm: true, inputMode: "email", autoComplete: "email" },
  { key: "notes", label: "Anything else? (optional)", type: "textarea", sendToCrm: true },
]

export const SHARED_FIELDS: QuoteField[] = [
  { key: "address", label: "Service address", type: "text", sendToCrm: true, required: true, autoComplete: "street-address", placeholder: "Street, city" },
  { key: "urgency", label: "When do you need this?", type: "chips", sendToCrm: true, options: [{ value: "asap", label: "ASAP" }, { value: "week", label: "This week" }, { value: "month", label: "This month" }, { value: "planning", label: "Just planning" }] },
  { key: "heardAboutUs", label: "How did you hear about us?", type: "chips", sendToCrm: true, options: [{ value: "google", label: "Google" }, { value: "gbp", label: "Google maps" }, { value: "neighbor", label: "Neighbor / yard sign" }, { value: "repeat", label: "I’m a customer" }, { value: "other", label: "Other" }] },
]

export function fieldsForService(id: QuoteServiceId): QuoteField[] {
  return SCHEMA[id] ?? []
}

export function crmKeysForService(id: QuoteServiceId): Set<string> {
  return new Set(fieldsForService(id).filter((f) => f.sendToCrm).map((f) => f.key))
}
