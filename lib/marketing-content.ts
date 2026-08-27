export type ServiceItem = {
  id: string
  title: string
  description: string
  href: string
  mediaSlot: string
  priceLabel?: string
  featured?: boolean
  tag?: string
}

export type ServiceDetail = ServiceItem & {
  eyebrow?: string
  longDescription: string
  highlights: string[]
  faqs?: FaqItem[]
}

export type AreaItem = {
  name: string
  slug: string
  href: string
}

export type AreaDetail = AreaItem & {
  heroSlot: string
  blurb: string
  stats: { label: string; value: string }[]
}

export type BundleItem = {
  id: string
  name: string
  priceFrom: number
  period: string
  features: string[]
  popular?: boolean
  href: string
}

export type FaqItem = {
  question: string
  answer: string
}

export type TestimonialItem = {
  quote: string
  name: string
  area: string
  rating?: number
}

export type GalleryItem = {
  id: string
  title: string
  category: string
  beforeSlot: string
  afterSlot: string
}

export type ProcessStep = {
  step: number
  title: string
  description: string
}

export type TeamMember = {
  name: string
  role: string
  mediaSlot: string
}

export const SERVICE_AREAS: AreaItem[] = [
  { name: "Wichita", slug: "wichita", href: "/service-areas/wichita" },
  { name: "Valley Center", slug: "valley-center", href: "/service-areas/valley-center" },
  { name: "Andover", slug: "andover", href: "/service-areas/andover" },
  { name: "Derby", slug: "derby", href: "/service-areas/derby" },
  { name: "Maize", slug: "maize", href: "/service-areas/maize" },
  { name: "Kansas City", slug: "kansas-city", href: "/service-areas/kansas-city" },
  { name: "Leavenworth", slug: "leavenworth", href: "/service-areas/leavenworth" },
]

export const AREA_DETAILS: AreaDetail[] = SERVICE_AREAS.map((area) => ({
  ...area,
  heroSlot: `areas.${area.slug}.hero`,
  blurb: `Cut Rates Lawn Care serves ${area.name} with landscaping, lawn care, and seasonal services — local crews, no contracts, free quotes in about two minutes.`,
  stats: [
    { label: "Response", value: "Same day" },
    { label: "Contracts", value: "None" },
    { label: "Quote time", value: "~2 min" },
  ],
}))

export const SERVICES: ServiceItem[] = [
  {
    id: "landscaping",
    title: "Landscaping & Design",
    description:
      "Design, hardscaping, planting, and irrigation — the transformations that turn a plain yard into the best one on the block.",
    href: "/services/landscaping",
    mediaSlot: "services.landscaping",
    featured: true,
    tag: "Our specialty",
  },
  {
    id: "lawn-care",
    title: "Lawn Care",
    description: "Mowing, fertilization, weed control, and seasonal care on a dependable schedule.",
    href: "/services/lawn-care",
    mediaSlot: "services.mowing",
    priceLabel: "from $45",
  },
  {
    id: "aeration",
    title: "Aeration & Overseeding",
    description: "Thicker turf and better roots before the season.",
    href: "/services/aeration",
    mediaSlot: "services.aeration",
    priceLabel: "seasonal",
  },
  {
    id: "pest-control",
    title: "Pest Control",
    description: "Targeted exterior protection, no complications.",
    href: "/services/pest-control",
    mediaSlot: "services.pest-control",
    priceLabel: "from $49",
  },
  {
    id: "holiday-lights",
    title: "Holiday Lights",
    description: "Design, install, take-down — we handle it all.",
    href: "/services/holiday-lights",
    mediaSlot: "services.holiday-lights",
    priceLabel: "Nov–Jan",
  },
  {
    id: "snow-removal",
    title: "Snow Removal",
    description: "Clear drives and walks when winter hits.",
    href: "/services/snow-removal",
    mediaSlot: "services.snow-removal",
    priceLabel: "seasonal",
  },
  {
    id: "hardscaping",
    title: "Hardscaping",
    description: "Patios, walks, and outdoor structure that lasts.",
    href: "/services/hardscaping",
    mediaSlot: "services.hardscaping",
  },
  {
    id: "commercial",
    title: "Commercial",
    description: "Reliable route service for properties that need to look sharp.",
    href: "/services/commercial",
    mediaSlot: "services.commercial",
  },
  {
    id: "power-washing",
    title: "Power Washing",
    description: "Driveways, siding, and hard surfaces cleaned up right.",
    href: "/services/power-washing",
    mediaSlot: "services.power-washing",
  },
  {
    id: "gutter-cleaning",
    title: "Gutter Cleaning",
    description: "Keep water flowing and foundations protected.",
    href: "/services/gutter-cleaning",
    mediaSlot: "services.cleanup",
  },
  {
    id: "residential",
    title: "Residential Packages",
    description: "Home exterior care bundled for busy households.",
    href: "/services/residential",
    mediaSlot: "page.residential.pest",
  },
]

const SERVICE_FAQS: FaqItem[] = [
  {
    question: "How often should I get this service?",
    answer:
      "It depends on your property and the season. We'll recommend a practical schedule after your quote — weekly, bi-weekly, or seasonal as needed.",
  },
  {
    question: "Do I need to be home?",
    answer:
      "Usually no. As long as we can access the work area, we complete the job and leave a quick summary.",
  },
  {
    question: "Is it safe for pets and kids?",
    answer:
      "We use family- and pet-conscious products where treatments apply. We'll note any wait-until-dry guidance on your service summary.",
  },
]

function detailFromService(
  service: ServiceItem,
  longDescription: string,
  highlights: string[],
  eyebrow?: string,
): ServiceDetail {
  return {
    ...service,
    eyebrow: eyebrow ?? "Service",
    longDescription,
    highlights,
    faqs: SERVICE_FAQS,
  }
}

export const SERVICE_DETAILS: ServiceDetail[] = [
  detailFromService(
    SERVICES.find((s) => s.id === "landscaping")!,
    "From concept sketches to planting and hardscape, we design outdoor spaces that fit how you actually live — curb appeal that lasts, not a one-weekend makeover.",
    [
      "Custom design tailored to your property",
      "Planting, beds, and irrigation options",
      "Hardscape coordination when you need structure",
      "Clear scope before we start",
    ],
    "Flagship",
  ),
  detailFromService(
    SERVICES.find((s) => s.id === "lawn-care")!,
    "Dependable mowing, fertilization, and weed control so your lawn stays sharp without you chasing the schedule.",
    [
      "Clean cuts and crisp edges",
      "Fertilization programs that fit your yard",
      "Weed control when you need it",
      "Week-to-week or flexible cadence",
    ],
  ),
  detailFromService(
    SERVICES.find((s) => s.id === "aeration")!,
    "Core aeration and overseeding help roots breathe and fill in thin spots — best timed for Kansas growing seasons.",
    [
      "Core aeration for compacted soils",
      "Overseeding for thicker turf",
      "Seasonal windows that actually work here",
      "Pairs well with fertilization plans",
    ],
    "Seasonal",
  ),
  detailFromService(
    SERVICES.find((s) => s.id === "pest-control")!,
    "Exterior-focused pest protection for lawns and perimeters — targeted treatments without the runaround.",
    [
      "Perimeter and lawn-focused options",
      "Clear scheduling and reminders",
      "Practical plans for residential yards",
      "Add-on to ongoing lawn care",
    ],
  ),
  detailFromService(
    SERVICES.find((s) => s.id === "holiday-lights")!,
    "We design, install, and take down holiday lighting so your home looks sharp from November through January — without the ladder work.",
    [
      "Custom design for your roofline and trees",
      "Professional install and take-down",
      "Seasonal booking windows",
      "Residential and small commercial",
    ],
    "Seasonal",
  ),
  detailFromService(
    SERVICES.find((s) => s.id === "snow-removal")!,
    "When winter hits, we clear drives and walks so you can get out safely — residential routes with commercial options.",
    [
      "Driveway and walk clearing",
      "Event-based or seasonal plans",
      "Residential and commercial routes",
      "Text updates when crews are en route",
    ],
    "Seasonal",
  ),
  detailFromService(
    SERVICES.find((s) => s.id === "hardscaping")!,
    "Patios, walks, and outdoor structure built to last — functional outdoor living that complements your landscape.",
    [
      "Patios and walkways",
      "Retaining walls and edging",
      "Durable materials for Kansas weather",
      "Design coordination with landscaping",
    ],
  ),
  detailFromService(
    SERVICES.find((s) => s.id === "commercial")!,
    "Route-based maintenance for properties that need to look sharp every week — HOAs, retail, and office sites.",
    [
      "Reliable weekly or custom cadence",
      "Multi-property coordination",
      "Curb appeal that stays consistent",
      "Clear scopes and point of contact",
    ],
  ),
  detailFromService(
    SERVICES.find((s) => s.id === "power-washing")!,
    "Driveways, siding, and hard surfaces cleaned up so the whole property looks cared for — not just the lawn.",
    [
      "Driveways and sidewalks",
      "Siding and exterior surfaces",
      "Seasonal refresh options",
      "Bundles with residential packages",
    ],
  ),
  detailFromService(
    SERVICES.find((s) => s.id === "gutter-cleaning")!,
    "Cleared gutters keep water moving away from your foundation — simple maintenance that prevents bigger problems.",
    [
      "Debris removal and flow check",
      "Seasonal visits available",
      "Pairs with roof-line holiday lights timing",
      "Residential focus with commercial options",
    ],
  ),
  detailFromService(
    SERVICES.find((s) => s.id === "residential")!,
    "Home exterior care packages that combine the services busy households actually need — without locking you into a long contract.",
    [
      "Mowing and seasonal lawn care",
      "Optional fertilization and aeration",
      "Exterior add-ons like gutters or wash",
      "Month-to-month flexibility",
    ],
  ),
]

/** Slug aliases for legacy or alternate URLs. */
const SERVICE_SLUG_ALIASES: Record<string, string> = {
  mowing: "lawn-care",
  "lawn-mowing": "lawn-care",
  fertilization: "lawn-care",
  "aeration-overseeding": "aeration",
  "holiday-lighting": "holiday-lights",
  snow: "snow-removal",
  landscape: "landscaping",
}

export function resolveServiceSlug(slug: string): string {
  return SERVICE_SLUG_ALIASES[slug] ?? slug
}

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  const id = resolveServiceSlug(slug)
  return SERVICES.find((s) => s.id === id || s.href.endsWith(`/${id}`))
}

export function getServiceDetail(slug: string): ServiceDetail | undefined {
  const id = resolveServiceSlug(slug)
  return SERVICE_DETAILS.find((s) => s.id === id)
}

export function getAreaBySlug(slug: string): AreaDetail | undefined {
  return AREA_DETAILS.find((a) => a.slug === slug)
}

export function getAreaSlugs(): string[] {
  return AREA_DETAILS.map((a) => a.slug)
}

export function getServiceSlugs(): string[] {
  return SERVICES.map((s) => s.id)
}

export const BUNDLES: BundleItem[] = [
  {
    id: "essentials",
    name: "Essentials",
    priceFrom: 129,
    period: "/mo starting",
    features: ["Weekly mowing & edging", "Seasonal cleanup", "Text reminders"],
    href: "/quote?bundle=essentials",
  },
  {
    id: "full-yard",
    name: "Full Yard",
    priceFrom: 199,
    period: "/mo starting",
    features: [
      "Everything in Essentials",
      "Fertilization program",
      "Aeration & overseeding",
    ],
    popular: true,
    href: "/quote?bundle=full-yard",
  },
  {
    id: "estate",
    name: "Estate",
    priceFrom: 349,
    period: "/mo starting",
    features: [
      "Everything in Full Yard",
      "Landscape maintenance",
      "Priority scheduling",
    ],
    href: "/quote?bundle=estate",
  },
]

export function getBundleById(id: string): BundleItem | undefined {
  return BUNDLES.find((b) => b.id === id)
}

export const FAQS: FaqItem[] = [
  {
    question: "Do I have to sign a contract?",
    answer:
      "Never. Every plan is month-to-month — stay because the lawn looks great, not because you're locked in.",
  },
  {
    question: "How fast will I hear back?",
    answer:
      "The moment you finish a quote, it texts our crew and you get an instant confirmation. Most folks hear from a real person the same day.",
  },
  {
    question: "Which areas do you serve?",
    answer:
      "From Wichita and the surrounding towns all the way to the Kansas City side — Wichita, Valley Center, Andover, Derby, Maize, Kansas City, and Leavenworth.",
  },
  {
    question: "Can I bundle services?",
    answer:
      "Absolutely — bundling mowing, fertilization, and aeration into one plan is the easiest way to save and keep the whole yard on schedule.",
  },
]

export const BUNDLE_FAQS: FaqItem[] = [
  {
    question: "What does “starting at” mean?",
    answer:
      "Listed prices are planning estimates for typical residential lots. Final pricing depends on size, access, and scope — confirmed after your quote.",
  },
  {
    question: "Can I change bundles later?",
    answer:
      "Yes. Plans are month-to-month, so you can upgrade, downgrade, or pause without a long contract.",
  },
  ...FAQS.slice(0, 2),
]

export const TESTIMONIALS: TestimonialItem[] = [
  {
    quote: "Yard looked better immediately. Easy to book and they actually show up.",
    name: "Sarah M.",
    area: "Derby",
    rating: 5,
  },
  {
    quote: "Finally a landscaping crew that explains the plan and sticks to it.",
    name: "James T.",
    area: "Wichita",
    rating: 5,
  },
  {
    quote: "Holiday lights looked sharp and take-down was handled without a fuss.",
    name: "Priya K.",
    area: "Andover",
    rating: 5,
  },
  {
    quote: "Commercial lot stays clean every week. Reliable and fair pricing.",
    name: "Mike R.",
    area: "Valley Center",
    rating: 5,
  },
  {
    quote: "Quick quote, clear price, and the lawn stays on schedule.",
    name: "Dana L.",
    area: "Maize",
    rating: 5,
  },
  {
    quote: "They cover our KC-side property without drama. Solid crew.",
    name: "Chris P.",
    area: "Kansas City",
    rating: 5,
  },
  {
    quote: "Snow cleared before we needed to leave. Worth every bit.",
    name: "Alex W.",
    area: "Leavenworth",
    rating: 5,
  },
]

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "lawn-1",
    title: "Front lawn refresh",
    category: "Lawn",
    beforeSlot: "ourwork.lawn.1.before",
    afterSlot: "ourwork.lawn.1.after",
  },
  {
    id: "lawn-2",
    title: "Thick turf turnaround",
    category: "Lawn",
    beforeSlot: "ourwork.lawn.2.before",
    afterSlot: "ourwork.lawn.2.after",
  },
  {
    id: "hardscape-1",
    title: "Patio & edging",
    category: "Hardscape",
    beforeSlot: "ourwork.hardscape.1.before",
    afterSlot: "ourwork.hardscape.1.after",
  },
  {
    id: "hardscape-2",
    title: "Walkway upgrade",
    category: "Hardscape",
    beforeSlot: "ourwork.hardscape.2.before",
    afterSlot: "ourwork.hardscape.2.after",
  },
  {
    id: "commercial-1",
    title: "Commercial curb appeal",
    category: "Commercial",
    beforeSlot: "ourwork.commercial.1.before",
    afterSlot: "ourwork.commercial.1.after",
  },
]

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: 1,
    title: "Tell us about your property",
    description: "Quick online form — size, services, and timing.",
  },
  {
    step: 2,
    title: "Get a planning estimate",
    description: "See starting-at numbers instantly, then we confirm on-site.",
  },
  {
    step: 3,
    title: "We text you",
    description: "A real local crew follows up the same day in most cases.",
  },
  {
    step: 4,
    title: "Done right",
    description: "Show up, do the work, keep your yard looking sharp.",
  },
]

export const TEAM: TeamMember[] = [
  { name: "Owner / Lead", role: "Operations", mediaSlot: "team.owner" },
  { name: "Route Manager", role: "Scheduling", mediaSlot: "team.manager" },
  { name: "Field Crew", role: "On-site", mediaSlot: "team.crew" },
]

export const ABOUT_STATS = [
  { label: "Lawns cared for", value: "1,200+" },
  { label: "Towns served", value: "7" },
  { label: "Google rating", value: "4.8★" },
  { label: "Contracts", value: "None" },
] as const

export function testimonialsForArea(areaName: string): TestimonialItem[] {
  const local = TESTIMONIALS.filter(
    (t) => t.area.toLowerCase() === areaName.toLowerCase(),
  )
  return local.length ? local : TESTIMONIALS.slice(0, 3)
}

export const ANNOUNCEMENT_ITEMS = [
  "Free quotes in about 2 minutes",
  "No contracts — month to month",
  "Landscaping flagship · Wichita → KC",
  "Aeration & holiday lights now booking",
]

export const RIBBON_ITEMS = [
  "Mowing",
  "Landscaping",
  "Fertilization",
  "Aeration & Overseeding",
  "Pest Control",
  "Holiday Lights",
  "Snow Removal",
  "Hardscaping",
  "Commercial",
]

export const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Areas", href: "/service-areas" },
  { label: "Our Work", href: "/our-work" },
  { label: "Bundles", href: "/bundles" },
  { label: "Careers", href: "/careers" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const
