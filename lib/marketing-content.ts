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

export type ServiceOffering = {
  id: string
  title: string
  description: string
  mediaSlot: string
  href: string
}

export type ServiceDetail = ServiceItem & {
  eyebrow?: string
  longDescription: string
  highlights: string[]
  faqs?: FaqItem[]
  offerings?: ServiceOffering[]
  offeringsEyebrow?: string
  offeringsTitle?: string
  offeringsDescription?: string
  processTitle?: string
  processDescription?: string
  processSteps?: ProcessStep[]
  ctaTitle?: string
  ctaDescription?: string
  ctaLabel?: string
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
  mediaSlot: string
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
    description: "Weekly mowing, fertilization, and weed control — a lawn that stays sharp without you chasing the crew.",
    href: "/services/lawn-care",
    mediaSlot: "services.mowing",
    priceLabel: "from $45",
  },
  {
    id: "aeration",
    title: "Aeration & Overseeding",
    description: "Core aeration and overseeding timed for Kansas soil — thicker turf, stronger roots.",
    href: "/services/aeration",
    mediaSlot: "services.aeration",
    priceLabel: "seasonal",
  },
  {
    id: "pest-control",
    title: "Pest Control",
    description:
      "Termites, rodents, exclusions, trapping, and bed bugs — our highest-value protection work.",
    href: "/services/pest-control",
    mediaSlot: "services.pest-control",
    tag: "Highest value",
  },
  {
    id: "holiday-lights",
    title: "Holiday Lights",
    description: "Roofline-to-trees design, install, and take-down — book in fall before the calendar fills.",
    href: "/services/holiday-lights",
    mediaSlot: "services.holiday-lights",
    priceLabel: "Nov–Jan",
  },
  {
    id: "snow-removal",
    title: "Snow Removal",
    description: "Driveways, walks, and lots cleared after the storm — seasonal routes so you are not the one on the tractor.",
    href: "/services/snow-removal",
    mediaSlot: "services.snow-removal",
    priceLabel: "seasonal",
  },
  {
    id: "hardscaping",
    title: "Hardscaping",
    description: "Patios, walks, and retaining walls built for Kansas weather — outdoor living that lasts.",
    href: "/services/hardscaping",
    mediaSlot: "services.hardscaping",
  },
  {
    id: "commercial",
    title: "Commercial",
    description: "Route-based mowing and grounds for HOAs, retail, and offices that have to look tenant-ready every week.",
    href: "/services/commercial",
    mediaSlot: "services.commercial",
  },
  {
    id: "power-washing",
    title: "Power Washing",
    description: "Driveways, siding, and decks restored — curb appeal that matches the lawn.",
    href: "/services/power-washing",
    mediaSlot: "services.power-washing",
  },
  {
    id: "gutter-cleaning",
    title: "Gutter Cleaning",
    description: "Debris out, downspouts flowing — protect the foundation before the next Kansas storm.",
    href: "/services/gutter-cleaning",
    mediaSlot: "services.cleanup",
  },
  {
    id: "residential",
    title: "Residential Packages",
    description: "Mowing plus the seasonal add-ons busy households actually need — month to month, no lock-in.",
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

export const PEST_OFFERINGS: ServiceOffering[] = [
  {
    id: "termites",
    title: "Termites",
    description:
      "Inspections, baiting, and treatment plans that protect the structure — not a one-spray guess.",
    mediaSlot: "page.pest.termite",
    href: "/quote?service=termites",
  },
  {
    id: "rodents",
    title: "Rodents",
    description:
      "Mice and rats around kitchens, garages, and crawl spaces. Find the pressure, then stop it.",
    mediaSlot: "page.pest.rodent",
    href: "/quote?service=rodents",
  },
  {
    id: "exclusions",
    title: "Exclusions",
    description:
      "Seal the gaps, vents, and roofline openings wildlife actually uses. Treatment without exclusion comes back.",
    mediaSlot: "page.pest.exclusion",
    href: "/quote?service=exclusions",
  },
  {
    id: "trapping",
    title: "Trapping",
    description:
      "Targeted trapping for wildlife that has already moved in — paired with exclusion so it stays resolved.",
    mediaSlot: "page.pest.trapping",
    href: "/quote?service=trapping",
  },
  {
    id: "bedbugs",
    title: "Bed bugs",
    description:
      "Our highest-urgency indoor service. Inspection first, then a treatment plan that matches the infestation.",
    mediaSlot: "page.pest.bedbugs",
    href: "/quote?service=bedbugs",
  },
  {
    id: "general-pest",
    title: "General & mosquito",
    description:
      "Perimeter and lawn programs for ants, wasps, spiders, and mosquitoes when you want the yard usable again.",
    mediaSlot: "services.pest-control",
    href: "/quote?service=pest-control",
  },
]

const PEST_FAQS: FaqItem[] = [
  {
    question: "Do you treat termites, or just spray the yard?",
    answer:
      "Termite work is a dedicated inspection and treatment plan — baiting, liquid treatments, or a combination depending on the structure. It is not the same as a lawn perimeter spray.",
  },
  {
    question: "Can you handle rodents and keep them from coming back?",
    answer:
      "Yes. We combine trapping or baiting with exclusion — sealing the entry points rodents are using. Removing animals without sealing the house is a short-term fix.",
  },
  {
    question: "What does exclusion include?",
    answer:
      "We inspect soffits, vents, garage seals, foundation gaps, and utility penetrations, then close the openings wildlife uses. Quote is based on the actual openings, not a generic package.",
  },
  {
    question: "Do you trap wildlife?",
    answer:
      "Yes. Trapping is available for animals that have already nested or entered. We pair it with exclusion and cleanup guidance so the problem does not restart next season.",
  },
  {
    question: "Do you treat bed bugs?",
    answer:
      "Yes — bed bugs are one of our highest-value indoor services. We inspect first, explain the treatment path (including heat or chemical programs where they fit), and set expectations for follow-up.",
  },
  {
    question: "Is treatment safe for kids and pets?",
    answer:
      "We use labeled products and explain any wait-until-dry or leave-the-home windows before we start. Interior jobs like bed bugs get a clear prep sheet.",
  },
]

type ServiceDetailExtra = {
  eyebrow?: string
  faqs?: FaqItem[]
  offerings?: ServiceOffering[]
  offeringsEyebrow?: string
  offeringsTitle?: string
  offeringsDescription?: string
  processTitle?: string
  processDescription?: string
  processSteps?: ProcessStep[]
  ctaTitle?: string
  ctaDescription?: string
  ctaLabel?: string
}

function journey(
  items: Array<[string, string]>,
): ProcessStep[] {
  return items.map(([title, description], index) => ({
    step: index + 1,
    title,
    description,
  }))
}

export const LAWN_OFFERINGS: ServiceOffering[] = [
  {
    id: "mowing",
    title: "Mowing & edging",
    description:
      "A dependable weekly or biweekly cut — crisp edges, clippings handled, no guessing if the crew will show.",
    mediaSlot: "services.mowing",
    href: "/quote?service=mowing",
  },
  {
    id: "fertilization",
    title: "Fertilization",
    description:
      "A program timed for Kansas turf, not a one-bag dump. Greener growth without burning the lawn.",
    mediaSlot: "services.fertilization",
    href: "/quote?service=fertilization",
  },
  {
    id: "weed-control",
    title: "Weed control",
    description:
      "Broadleaf and grassy weeds treated when they actually respond here — spring through fall.",
    mediaSlot: "services.weed-control",
    href: "/quote?service=weed-control",
  },
  {
    id: "full-service",
    title: "Full-yard plan",
    description:
      "Mowing plus fertility and weeds on one route. One crew, one schedule, one place to text.",
    mediaSlot: "services.mowing",
    href: "/quote?service=full-service",
  },
]

const LAWN_FAQS: FaqItem[] = [
  {
    question: "How often do you mow?",
    answer:
      "Weekly in peak growth, biweekly when the season slows. We'll recommend a cadence from your lot size and grass type after the quote.",
  },
  {
    question: "Do I need to be home?",
    answer:
      "No. As long as gates are unlocked or we have a code, we complete the visit and leave the yard ready.",
  },
  {
    question: "What is in a full-yard plan?",
    answer:
      "Mowing, edging, and the fertility/weed visits your lawn actually needs — not a menu of upsells every week.",
  },
  {
    question: "Can I pause if we go out of town?",
    answer:
      "Yes. There is no annual lock-in. Pause, skip, or add a visit — we would rather have a clean schedule than a trapped customer.",
  },
]

export const LANDSCAPE_OFFERINGS: ServiceOffering[] = [
  {
    id: "design",
    title: "Design",
    description:
      "A plan that fits how you use the yard — curb, beds, and gathering space — before a single plant goes in.",
    mediaSlot: "page.landscaping.1",
    href: "/quote?service=landscaping",
  },
  {
    id: "planting",
    title: "Planting & beds",
    description:
      "Trees, shrubs, and beds that survive Kansas weather. We install, mulch, and set the first-year care.",
    mediaSlot: "services.landscaping",
    href: "/quote?service=planting",
  },
  {
    id: "irrigation",
    title: "Irrigation",
    description:
      "Zones that water the plants you have, not the sidewalk. New systems or repairs on what is already in the ground.",
    mediaSlot: "page.landscaping.3",
    href: "/quote?service=irrigation",
  },
  {
    id: "landscape-maintenance",
    title: "Landscape maintenance",
    description:
      "Beds, shrubs, and seasonal color kept after the install so the design still looks new next year.",
    mediaSlot: "services.cleanup",
    href: "/quote?service=landscape-maintenance",
  },
]

const LANDSCAPE_FAQS: FaqItem[] = [
  {
    question: "Do you design first, or just plant what I pick?",
    answer:
      "We start with how you use the space and what the site will actually grow. You get a clear scope and materials list before we schedule the install.",
  },
  {
    question: "Can you work with an existing yard?",
    answer:
      "Yes. Most of our work is improving what is already there — beds, trees, irrigation, and the hardscape that ties it together.",
  },
  {
    question: "How long does a typical install take?",
    answer:
      "A bed refresh can be a day. A full redesign is scoped after we walk the property. The quote names the window so you are not surprised.",
  },
  {
    question: "Do you maintain what you install?",
    answer:
      "Yes. The best-looking projects stay on a maintenance route. We would rather keep the design than hand you a one-time install and disappear.",
  },
]

export const AERATION_OFFERINGS: ServiceOffering[] = [
  {
    id: "core-aeration",
    title: "Core aeration",
    description:
      "Pull plugs so water, air, and fertilizer reach the roots — the difference on compacted Wichita clay.",
    mediaSlot: "services.aeration",
    href: "/quote?service=aeration",
  },
  {
    id: "overseeding",
    title: "Overseeding",
    description:
      "Fill thin spots while the soil is open. Best paired with aeration in the right seasonal window.",
    mediaSlot: "services.aeration",
    href: "/quote?service=overseeding",
  },
  {
    id: "lawn-aeration-bundle",
    title: "Aeration + fertility",
    description:
      "Aerate, overseed, then feed. One plan instead of three separate vendors guessing at timing.",
    mediaSlot: "services.fertilization",
    href: "/quote?service=full-service",
  },
]

const AERATION_FAQS: FaqItem[] = [
  {
    question: "When should we aerate in Kansas?",
    answer:
      "Cool-season lawns want early fall, with a spring window when compaction is bad. We will not book it in the heat just to fill a calendar.",
  },
  {
    question: "Do you leave the plugs on the lawn?",
    answer:
      "Yes — they break down and feed the soil. We will tell you when to water and when to hold off on mowing after the visit.",
  },
  {
    question: "Should I overseed at the same time?",
    answer:
      "If the lawn is thin, yes. Seed in open holes has a much better chance than seed on a hard surface.",
  },
]

export const HOLIDAY_OFFERINGS: ServiceOffering[] = [
  {
    id: "holiday-design",
    title: "Design & install",
    description:
      "Roofline, trees, and entries designed so the house looks finished — not a box of leftover strands.",
    mediaSlot: "services.holiday-lights",
    href: "/quote?service=holiday-lights",
  },
  {
    id: "take-down",
    title: "Take-down",
    description:
      "We come back after the season, pack the lights, and store or return them. You never get on a ladder in January.",
    mediaSlot: "services.holiday-lights",
    href: "/quote?service=take-down",
  },
  {
    id: "commercial-lights",
    title: "Small commercial",
    description:
      "Storefronts, offices, and HOA entries that need to look done by the first weekend of December.",
    mediaSlot: "services.commercial",
    href: "/quote?service=commercial-lights",
  },
]

const HOLIDAY_FAQS: FaqItem[] = [
  {
    question: "When should I book?",
    answer:
      "September and October. Inventory and crew days fill before Thanksgiving. If you want the house lit for the first weekend of December, do not wait until the leaves are gone.",
  },
  {
    question: "Do you provide the lights?",
    answer:
      "Yes. We design with commercial-grade lighting and install it. Take-down is part of the job unless you only want a one-visit hang.",
  },
  {
    question: "What if a section goes out in December?",
    answer:
      "Tell us. Seasonal clients get a callback so you are not the one on the roof during a freeze.",
  },
  {
    question: "Can you light trees and the roofline?",
    answer:
      "That is the usual scope. Send photos of the front elevation and we will propose a layout with the quote.",
  },
]

export const SNOW_OFFERINGS: ServiceOffering[] = [
  {
    id: "driveway-snow",
    title: "Driveways & walks",
    description:
      "Residential routes after the storm so you can get the cars out and the kids to school — we run the equipment.",
    mediaSlot: "services.snow-removal",
    href: "/quote?service=snow-removal",
  },
  {
    id: "commercial-snow",
    title: "Lots & entries",
    description:
      "Retail, office, and HOA lots cleared to a standard tenants can walk. One point of contact per event.",
    mediaSlot: "services.commercial",
    href: "/quote?service=commercial-snow",
  },
  {
    id: "seasonal-snow",
    title: "Seasonal contract",
    description:
      "You are on the list before the first freeze. We watch the forecast; you do not text us at 5 a.m. hoping someone comes.",
    mediaSlot: "services.snow-removal",
    href: "/quote?service=seasonal-snow",
  },
]

const SNOW_FAQS: FaqItem[] = [
  {
    question: "Do you come automatically, or do I have to call?",
    answer:
      "Seasonal routes trigger on accumulation. Per-event customers text us when they want a visit. Either way, you get a confirmation when the crew is rolling.",
  },
  {
    question: "How soon after the snow stops?",
    answer:
      "Residential routes start as soon as it is safe to run equipment. Priority goes to seasonal contracts, then per-event jobs in the same neighborhood.",
  },
  {
    question: "Can you do commercial lots?",
    answer:
      "Yes. We clear drives, walks, and lots. Send the property list and the standard you need (bare pavement vs packed) and we will quote the route.",
  },
  {
    question: "Do I need to be home?",
    answer:
      "No. Move cars if you can; if you cannot, tell us in the quote notes so the crew plans around them.",
  },
]

export const HARDSCAPE_OFFERINGS: ServiceOffering[] = [
  {
    id: "patio",
    title: "Patios",
    description:
      "A patio you will actually use — sized for how you gather, built for freeze-thaw, not a weekend kit.",
    mediaSlot: "services.hardscaping",
    href: "/quote?service=patio",
  },
  {
    id: "walkways",
    title: "Walks & steps",
    description:
      "Front walks and side paths that drain, hold an edge, and match the house instead of fighting it.",
    mediaSlot: "page.landscaping.2",
    href: "/quote?service=walkways",
  },
  {
    id: "retaining-walls",
    title: "Retaining walls",
    description:
      "Grade changes that stop erosion and create usable space — engineered for Kansas clay, not stacked for looks only.",
    mediaSlot: "services.hardscaping",
    href: "/quote?service=retaining-walls",
  },
  {
    id: "outdoor-living",
    title: "Outdoor living",
    description:
      "Patio, planting, and lighting as one project so the backyard feels finished when we leave.",
    mediaSlot: "ourwork.hardscape.1.after",
    href: "/quote?service=hardscaping",
  },
]

const HARDSCAPE_FAQS: FaqItem[] = [
  {
    question: "Do you design the patio or just build what I sketched?",
    answer:
      "We walk the space, confirm drainage and access, then quote materials and layout. You approve the scope before we break ground.",
  },
  {
    question: "Will it survive Kansas winters?",
    answer:
      "That is the point of doing it professionally. Base, edge restraint, and materials are chosen for freeze-thaw, not the cheapest pallet.",
  },
  {
    question: "Can landscaping be part of the same job?",
    answer:
      "Yes — and it should be. Beds and irrigation look unfinished if they are an afterthought. We coordinate them on one timeline.",
  },
]

export const COMMERCIAL_OFFERINGS: ServiceOffering[] = [
  {
    id: "weekly-mowing",
    title: "Weekly mowing",
    description:
      "Route-based cuts so the property looks tenant-ready every week — not whenever a vendor has a gap.",
    mediaSlot: "services.commercial",
    href: "/quote?service=commercial",
  },
  {
    id: "landscape-beds",
    title: "Beds & grounds",
    description:
      "Shrubs, mulch, and entries kept at a standard your tenants notice when they pull in.",
    mediaSlot: "services.landscaping",
    href: "/quote?service=landscape-beds",
  },
  {
    id: "snow-add-on",
    title: "Snow on the same route",
    description:
      "One vendor for growing season and winter. The crew already knows the lot, the hydrants, and the loading dock.",
    mediaSlot: "services.snow-removal",
    href: "/quote?service=commercial-snow",
  },
  {
    id: "multi-property",
    title: "Multi-property",
    description:
      "HOAs and portfolios with one invoice, one point of contact, and a shared standard across sites.",
    mediaSlot: "services.commercial",
    href: "/quote?service=multi-property",
  },
]

const COMMERCIAL_FAQS: FaqItem[] = [
  {
    question: "Can you handle more than one property?",
    answer:
      "Yes. Send the list, cadence, and who signs off on extras. We quote a route, not a one-off mow.",
  },
  {
    question: "Who do I call if something looks off?",
    answer:
      "You get a named point of contact. We would rather fix a miss the same week than hide behind a ticket portal.",
  },
  {
    question: "Do you offer snow and pest with the lawn route?",
    answer:
      "Yes. Properties that already know our crew add snow, holiday lighting, and pest without starting over with a new vendor.",
  },
  {
    question: "Is there a long contract?",
    answer:
      "We work on a clear scope and cadence. If we are not keeping the property sharp, you should not be stuck.",
  },
]

export const POWER_WASH_OFFERINGS: ServiceOffering[] = [
  {
    id: "driveway",
    title: "Driveways & concrete",
    description:
      "Oil, algae, and winter stain lifted so the front of the house matches the lawn.",
    mediaSlot: "services.power-washing",
    href: "/quote?service=driveway",
  },
  {
    id: "siding",
    title: "Siding & exteriors",
    description:
      "Soft wash where paint and siding need it — clean, not stripped. We will say no if the surface cannot take the pressure.",
    mediaSlot: "services.power-washing",
    href: "/quote?service=siding",
  },
  {
    id: "decks",
    title: "Decks & fences",
    description:
      "Wood and composite brought back before you stain or host. Scope includes what we will not blast.",
    mediaSlot: "services.power-washing",
    href: "/quote?service=decks",
  },
  {
    id: "commercial-wash",
    title: "Commercial exteriors",
    description:
      "Entries, dumpster pads, and sidewalks that make the property look managed.",
    mediaSlot: "services.commercial",
    href: "/quote?service=power-washing",
  },
]

const POWER_WASH_FAQS: FaqItem[] = [
  {
    question: "Will this damage my siding or concrete?",
    answer:
      "We match pressure and detergent to the surface. Soft wash for siding, stronger on concrete. If a surface should not be blasted, we will tell you on the quote.",
  },
  {
    question: "How long does a driveway take?",
    answer:
      "Most residential drives are a same-day visit. We will confirm access, water, and cars before we roll.",
  },
  {
    question: "Can you bundle this with lawn care?",
    answer:
      "Yes. Spring and fall wash visits sit cleanly next to mowing and gutter cleaning so the whole exterior turns over at once.",
  },
]

export const GUTTER_OFFERINGS: ServiceOffering[] = [
  {
    id: "gutter-clean",
    title: "Clean & flush",
    description:
      "Debris out, downspouts flowing. The visit that keeps water off the foundation.",
    mediaSlot: "services.cleanup",
    href: "/quote?service=gutter-cleaning",
  },
  {
    id: "flow-check",
    title: "Flow check",
    description:
      "We confirm water leaves the roof the way it should and flag damage instead of silently skipping it.",
    mediaSlot: "services.cleanup",
    href: "/quote?service=flow-check",
  },
  {
    id: "holiday-timing",
    title: "Before holiday lights",
    description:
      "Clean gutters first, then hang lights. One crew, one trip up the ladder, no buried leaves under the roofline.",
    mediaSlot: "services.holiday-lights",
    href: "/quote?service=holiday-lights",
  },
]

const GUTTER_FAQS: FaqItem[] = [
  {
    question: "How often should gutters be cleaned here?",
    answer:
      "At least once in fall after the leaves drop. Heavy trees may need spring too. We will say so after the first visit.",
  },
  {
    question: "Will you tell me if something is damaged?",
    answer:
      "Yes. If a hanger is gone or a seam is split, it goes on the summary. We do not quietly skip a section.",
  },
  {
    question: "Can this happen the same week as holiday lights?",
    answer:
      "That is the better sequence. Book lights in the fall and we will clear gutters first so we are not clipping strands into a leaf bed.",
  },
]

export const RESIDENTIAL_OFFERINGS: ServiceOffering[] = [
  {
    id: "essentials",
    title: "Essentials",
    description:
      "Mowing on a week-to-week cadence. The starting plan for busy households that just need the lawn handled.",
    mediaSlot: "services.mowing",
    href: "/quote?service=mowing",
  },
  {
    id: "full-yard",
    title: "Full yard",
    description:
      "Mowing, fertility, and weeds as one route. Add aeration in season without finding a second vendor.",
    mediaSlot: "services.mowing",
    href: "/quote?service=full-service",
  },
  {
    id: "seasonal-add-ons",
    title: "Seasonal add-ons",
    description:
      "Gutters, power washing, holiday lights, and snow when the calendar turns — same company you already text.",
    mediaSlot: "services.holiday-lights",
    href: "/quote?service=residential",
  },
  {
    id: "pest-add-on",
    title: "Protect the house",
    description:
      "Termites, rodents, exclusions, and bed bugs sit next to the lawn route. Highest-value work, same local crew.",
    mediaSlot: "services.pest-control",
    href: "/quote?service=pest-control",
  },
]

const RESIDENTIAL_FAQS: FaqItem[] = [
  {
    question: "What is the difference between Essentials and Full yard?",
    answer:
      "Essentials is the cut. Full yard adds fertility and weed control so you are not coordinating three schedules.",
  },
  {
    question: "Can I add pest control or lights later?",
    answer:
      "Yes. Most households start with mowing and add seasonal work once they trust the crew.",
  },
  {
    question: "Are there contracts?",
    answer:
      "No annual lock-in. You should stay because the yard looks right, not because a cancellation clause says so.",
  },
]

const PEST_PROCESS = journey([
  ["Tell us what you are seeing", "Termites, droppings, scratching, bites — the quote starts with the problem, not a spray package."],
  ["We inspect and scope", "Entry points, activity, and the treatment that actually fits. You see the plan before we start."],
  ["Treat, trap, or exclude", "The crew does the work on a scheduled visit and tells you any wait-until-dry or prep steps."],
  ["Follow-up that sticks", "Exclusion and a callback window so the issue does not restart next season."],
])

function detailFromService(
  service: ServiceItem,
  longDescription: string,
  highlights: string[],
  extra?: ServiceDetailExtra,
): ServiceDetail {
  return {
    ...service,
    eyebrow: extra?.eyebrow ?? "Service",
    longDescription,
    highlights,
    faqs: extra?.faqs ?? SERVICE_FAQS,
    offerings: extra?.offerings,
    offeringsEyebrow: extra?.offeringsEyebrow,
    offeringsTitle: extra?.offeringsTitle,
    offeringsDescription: extra?.offeringsDescription,
    processTitle: extra?.processTitle,
    processDescription: extra?.processDescription,
    processSteps: extra?.processSteps,
    ctaTitle: extra?.ctaTitle,
    ctaDescription: extra?.ctaDescription,
    ctaLabel: extra?.ctaLabel,
  }
}

export const SERVICE_DETAILS: ServiceDetail[] = [
  detailFromService(
    SERVICES.find((s) => s.id === "landscaping")!,
    "This is the flagship work: a yard that fits how you live, not a weekend plant dump. We design, plant, and coordinate hardscape so the first impression at the curb is the same one you get in the backyard.",
    [
      "Design before we buy a single plant",
      "Beds, trees, and irrigation that survive Kansas weather",
      "Hardscape coordinated on the same timeline",
      "Maintenance available so the install still looks new next year",
    ],
    {
      eyebrow: "Flagship",
      faqs: LANDSCAPE_FAQS,
      offerings: LANDSCAPE_OFFERINGS,
      offeringsEyebrow: "How we build the yard",
      offeringsTitle: "Design it. Plant it. Keep it.",
      offeringsDescription:
        "Most people start with a photo of the front of the house. We turn that into a scope, a quote, and a crew date — then we stay for maintenance if you want the design to last.",
      processTitle: "From the first photo to a finished yard.",
      processDescription:
        "You should know the layout, the materials, and the window before anyone digs.",
      processSteps: journey([
        ["Share the property", "Photos, how you use the space, and what bothers you now. Two minutes on the quote form is enough to start."],
        ["We propose a scope", "A layout and materials list you can say yes or no to — not a vague 'we will figure it out on site.'"],
        ["Schedule the install", "One crew, one calendar. Hardscape and planting are sequenced so you are not living in a job site all season."],
        ["Maintain it", "Optional route visits so the beds and irrigation still look designed a year later."],
      ]),
      ctaTitle: "Ready to make the yard the best one on the block?",
      ctaDescription:
        "Send photos. We will come back with a scope you can actually decide on — then a local crew does the work.",
      ctaLabel: "Get a landscape quote",
    },
  ),
  detailFromService(
    SERVICES.find((s) => s.id === "lawn-care")!,
    "You should not have to chase a mowing crew. Weekly or biweekly cuts, fertility, and weed control on a route that already knows your yard — starting-at numbers in about two minutes, then we confirm the first visit.",
    [
      "Clean cuts and crisp edges on a published cadence",
      "Fertility timed for Kansas turf, not a one-bag dump",
      "Weed control when it actually works here",
      "Pause or skip a visit — no annual lock-in",
    ],
    {
      eyebrow: "The weekly route",
      faqs: LAWN_FAQS,
      offerings: LAWN_OFFERINGS,
      offeringsEyebrow: "Pick the plan",
      offeringsTitle: "Mow it. Feed it. Keep weeds out.",
      offeringsDescription:
        "Start with mowing if that is the pain. Add fertility and weeds when you are tired of coordinating three vendors.",
      processTitle: "From quote to a lawn that stays handled.",
      processDescription: "Most new customers are on a route within a week of the first estimate.",
      processSteps: journey([
        ["Tell us the lot", "Size, cadence, and whether you want mowing only or the full plan. Instant starting-at numbers."],
        ["We confirm the first visit", "A local crew texts when they are on the way. Gates, dogs, and parking go in the notes once."],
        ["The route starts", "Same crew pattern, same standard. You are not re-explaining the yard every Saturday."],
        ["Add on when you need it", "Aeration, gutters, pest, lights — the same number you already text."],
      ]),
      ctaTitle: "Want the lawn off your list this week?",
      ctaDescription: "Free planning estimate in about two minutes. Local crew. No contracts.",
      ctaLabel: "Get a lawn estimate",
    },
  ),
  detailFromService(
    SERVICES.find((s) => s.id === "aeration")!,
    "Wichita clay compact. Core aeration opens the soil so water and fertilizer reach the roots; overseeding fills the thin spots while the holes are open. Book the window, not a random Saturday in July.",
    [
      "Core aeration for compacted Kansas soils",
      "Overseeding while the ground is open",
      "Fall-first timing, spring when compaction is bad",
      "Pairs with a fertility plan so the seed takes",
    ],
    {
      eyebrow: "Seasonal window",
      faqs: AERATION_FAQS,
      offerings: AERATION_OFFERINGS,
      offeringsEyebrow: "What to book",
      offeringsTitle: "Open the soil. Thicken the turf.",
      offeringsDescription:
        "If the lawn is tired, compacted, or thinning, this is the visit that makes the rest of the program work.",
      processTitle: "Hit the window, then let it grow.",
      processSteps: journey([
        ["Book the season", "Fall is first choice for cool-season turf. We will not sell you a heat-of-summer aeration."],
        ["We confirm the date", "Soil and weather have to cooperate. You get a window, then a day."],
        ["Aerate and overseed", "Plugs pulled, seed in the holes, clear watering guidance on the summary."],
        ["Follow the program", "Hold off on a scalp mow, water as directed, add fertility if it is part of your plan."],
      ]),
      ctaTitle: "Want thicker turf this season?",
      ctaDescription: "Tell us the lawn size and we will put you in the right aeration window.",
      ctaLabel: "Book aeration",
    },
  ),
  detailFromService(
    SERVICES.find((s) => s.id === "pest-control")!,
    "Wichita-area homes and businesses call us for the pest problems that actually cost money — termites, rodents, wildlife exclusions, trapping, and bed bugs. Perimeter sprays are available too, but the high-value work is inspection, exclusion, and treatment plans that stop the issue instead of masking it.",
    [
      "Termite inspections and treatment plans",
      "Rodent control inside and around the structure",
      "Exclusion work that seals entry points",
      "Humane trapping for wildlife pressure",
      "Bed bug inspections and heat/chemical programs",
      "Exterior mosquito and general pest routes",
    ],
    {
      eyebrow: "Highest-value protection",
      faqs: PEST_FAQS,
      offerings: PEST_OFFERINGS,
      offeringsEyebrow: "High-value services",
      offeringsTitle: "What we actually solve.",
      offeringsDescription:
        "Start with the problem. We will inspect and quote the right treatment — not a generic spray package.",
      processTitle: "From the first call to a closed-up house.",
      processDescription:
        "Inspection, a clear plan, then treatment and exclusion — not a one-spray guess.",
      processSteps: PEST_PROCESS,
      ctaTitle: "Need termites, rodents, or bed bugs handled?",
      ctaDescription:
        "Tell us what you are seeing. We quote the real job — inspection, exclusion, and treatment.",
      ctaLabel: "Get a pest quote",
    },
  ),
  detailFromService(
    SERVICES.find((s) => s.id === "holiday-lights")!,
    "Book in the fall. We design the roofline and trees, hang commercial-grade lighting, and take it down after the season — so you are not on a ladder in a Kansas freeze.",
    [
      "Custom design for roofline, trees, and entries",
      "Install timed for the first weekend of December",
      "Take-down and storage included on seasonal jobs",
      "Homes and small commercial storefronts",
    ],
    {
      eyebrow: "Book in fall",
      faqs: HOLIDAY_FAQS,
      offerings: HOLIDAY_OFFERINGS,
      offeringsEyebrow: "The season, handled",
      offeringsTitle: "Design it. Hang it. Take it down.",
      offeringsDescription:
        "Inventory and crew days fill before Thanksgiving. Send elevation photos now and you are lit when the neighbors still have a tangle of cords.",
      processTitle: "From the first photo to a lit house.",
      processSteps: journey([
        ["Book before it fills", "September and October. Send photos of the front elevation with the quote."],
        ["We design the layout", "Roofline, trees, and entries — a look you approve, not leftover strands from the garage."],
        ["Install in November", "Crew on the calendar. Gutters can be cleaned on the same trip if you want them."],
        ["Take-down after the season", "We come back, pack the lights, and you never climb in January."],
      ]),
      ctaTitle: "Want the house lit this December?",
      ctaDescription: "Fall dates fill first. Send photos and we will design the layout with the quote.",
      ctaLabel: "Book holiday lights",
    },
  ),
  detailFromService(
    SERVICES.find((s) => s.id === "snow-removal")!,
    "When the storm is on the radar, you should already be on a route. We run the tractor and the shovels so driveways, walks, and lots are clear — residential first thing, commercial lots to a standard tenants can walk.",
    [
      "Driveways and walks cleared after accumulation",
      "Seasonal routes that trigger without a 5 a.m. text chain",
      "Commercial lots and entries on the same crew",
      "Confirmation when the equipment is rolling",
    ],
    {
      eyebrow: "Before the first freeze",
      faqs: SNOW_FAQS,
      offerings: SNOW_OFFERINGS,
      offeringsEyebrow: "How you stay clear",
      offeringsTitle: "Sign up once. We watch the storm.",
      offeringsDescription:
        "Seasonal contracts get first pass. Per-event jobs are available in the same neighborhoods when the crew is already out.",
      processTitle: "From the forecast to a cleared drive.",
      processSteps: journey([
        ["Get on the list", "Seasonal contract before the first freeze, or per-event if you only want the big storms."],
        ["We watch the radar", "Accumulation triggers the route. You are not hoping someone answers the phone at dawn."],
        ["Crews clear the property", "Tractors and shovels — drives, walks, lots. Cars moved if you can; notes if you cannot."],
        ["You get out", "Confirmation when we are rolling, then a driveway you can actually use."],
      ]),
      ctaTitle: "Want to be on the snow route this winter?",
      ctaDescription: "Seasonal spots go first. Tell us the property and we will quote the plan.",
      ctaLabel: "Get a snow quote",
    },
  ),
  detailFromService(
    SERVICES.find((s) => s.id === "hardscaping")!,
    "Patios, walks, and walls built for freeze-thaw — outdoor living you will use, not a kit that heaves in two winters. We coordinate planting so the hardscape does not sit in a dirt patch when we leave.",
    [
      "Patios sized for how you actually gather",
      "Walks and steps that drain and hold an edge",
      "Retaining walls for Kansas clay and grade",
      "Planting and irrigation sequenced with the build",
    ],
    {
      eyebrow: "Outdoor living",
      faqs: HARDSCAPE_FAQS,
      offerings: HARDSCAPE_OFFERINGS,
      offeringsEyebrow: "What we build",
      offeringsTitle: "Patio, walks, walls — then the plants.",
      offeringsDescription:
        "Start with how you use the space. We quote materials and drainage before anyone breaks ground.",
      processTitle: "Walk it. Quote it. Build it.",
      processSteps: journey([
        ["Walk the space", "Photos help. An on-site look confirms drainage, access, and what the soil will support."],
        ["Materials and quote", "You approve the layout and the number. No 'we will see once we start.'"],
        ["Build", "Base, edge, and finish to survive Kansas winters. You get a window, then a start date."],
        ["Tie in the landscape", "Beds and irrigation so the new patio does not sit in a construction scar."],
      ]),
      ctaTitle: "Ready for a patio you will actually use?",
      ctaDescription: "Send photos of the space. We will come back with layout, materials, and a window.",
      ctaLabel: "Get a hardscape quote",
    },
  ),
  detailFromService(
    SERVICES.find((s) => s.id === "commercial")!,
    "HOAs, retail, and offices that have to look tenant-ready every week. One route, one point of contact, one standard — mowing, beds, snow, and pest without a stack of vendors.",
    [
      "Weekly or custom cadence on a named route",
      "Multi-property portfolios on one invoice",
      "Snow and pest available from the same crew",
      "A person to call when something looks off",
    ],
    {
      eyebrow: "Properties that have to look ready",
      faqs: COMMERCIAL_FAQS,
      offerings: COMMERCIAL_OFFERINGS,
      offeringsEyebrow: "The commercial route",
      offeringsTitle: "One vendor. A property that stays sharp.",
      offeringsDescription:
        "Send the property list and the standard you owe tenants. We quote a route — not a one-off mow when someone cancels.",
      processTitle: "From the property list to a weekly standard.",
      processSteps: journey([
        ["Send the sites", "Addresses, cadence, who signs extras, and photos of the entries that have to look right."],
        ["Scope and a point of contact", "You get a named person, not a ticket queue. The quote is the standard we will keep."],
        ["The route starts", "Weekly or custom. Same crew pattern so the property does not swing from overgrown to scalped."],
        ["Add winter and pest", "Snow, holiday lighting, and pest on the crew that already knows the lot."],
      ]),
      ctaTitle: "Need a grounds crew your tenants will notice?",
      ctaDescription: "Send the property list. We will quote cadence, scope, and a single point of contact.",
      ctaLabel: "Get a commercial quote",
    },
  ),
  detailFromService(
    SERVICES.find((s) => s.id === "power-washing")!,
    "The lawn can look perfect and the house still look tired. We restore driveways, siding, and decks with the pressure the surface can actually take — then you can bundle it with mowing and gutters.",
    [
      "Driveways and concrete brought back",
      "Soft wash for siding that should not be blasted",
      "Decks and fences prepped for stain or hosting",
      "Same-week add-on to a residential route",
    ],
    {
      eyebrow: "Curb appeal, not just grass",
      faqs: POWER_WASH_FAQS,
      offerings: POWER_WASH_OFFERINGS,
      offeringsEyebrow: "What we wash",
      offeringsTitle: "Driveway, siding, deck — the whole face of the house.",
      offeringsDescription:
        "Send photos of the surface. We will quote the method (and tell you if a surface should not be hit).",
      processTitle: "Photos in. Clean surface out.",
      processSteps: journey([
        ["Show us the surface", "Driveway, siding, deck — photos in the quote are enough to start."],
        ["We match the method", "Pressure and detergent to the material. Soft wash where paint and siding need it."],
        ["We wash", "Access, water, and cars confirmed. Most residential drives are same-day."],
        ["Bundle the exterior", "Gutters, lawn, and lights on the same relationship if you want a full turn-over."],
      ]),
      ctaTitle: "Want the hard surfaces to match the lawn?",
      ctaDescription: "Send photos of the driveway or siding. We will quote the method and the visit.",
      ctaLabel: "Get a wash quote",
    },
  ),
  detailFromService(
    SERVICES.find((s) => s.id === "gutter-cleaning")!,
    "Clogged gutters put water where it does not belong. We pull the debris, flush the downspouts, and flag damage — and we will do it before holiday lights go up so we are not clipping strands into a leaf bed.",
    [
      "Debris out and downspouts flowing",
      "Damage called out on the summary, not skipped",
      "Fall first, spring for heavy trees",
      "Sequence with holiday lights on the same trip",
    ],
    {
      eyebrow: "Before the next storm",
      faqs: GUTTER_FAQS,
      offerings: GUTTER_OFFERINGS,
      offeringsEyebrow: "Keep water moving",
      offeringsTitle: "Clean them. Check flow. Then hang lights.",
      offeringsDescription:
        "A short visit that protects the foundation. Book it with holiday lighting if the roofline is already on the calendar.",
      processTitle: "Book it. Clear it. Confirm flow.",
      processSteps: journey([
        ["Pick spring or fall", "Fall after the leaves is the default. Heavy trees may need both."],
        ["We clear and flush", "Gutters and downspouts. You do not need to be home."],
        ["We note damage", "Loose hangers and split seams go on the summary."],
        ["Optional lights", "If you booked holiday lighting, this is the visit that should happen first."],
      ]),
      ctaTitle: "Want gutters that actually drain?",
      ctaDescription: "Fall dates go first. Add holiday lights on the same quote if the roofline is next.",
      ctaLabel: "Book gutter cleaning",
    },
  ),
  detailFromService(
    SERVICES.find((s) => s.id === "residential")!,
    "Busy households do not need five vendors. Start with mowing, add fertility, then layer gutters, wash, lights, snow, and pest — month to month, same local crew, no lock-in.",
    [
      "Mowing on a week-to-week cadence",
      "Full-yard fertility and weeds when you are ready",
      "Seasonal add-ons from the same number",
      "Pest protection without a second company",
    ],
    {
      eyebrow: "The household plan",
      faqs: RESIDENTIAL_FAQS,
      offerings: RESIDENTIAL_OFFERINGS,
      offeringsEyebrow: "Start simple. Add what you need.",
      offeringsTitle: "One crew for the house and the yard.",
      offeringsDescription:
        "Most customers start with the cut. The ones who stay add the seasonal work because the crew already knows the property.",
      processTitle: "Pick a starting plan. Grow it.",
      processSteps: journey([
        ["Choose Essentials or Full yard", "Mowing only, or mowing plus fertility and weeds. Instant starting-at numbers."],
        ["Get on a route", "First visit within the week in most cases. Gates and dogs go in the notes once."],
        ["Add the seasons", "Aeration, gutters, wash, lights, snow — when the calendar turns, you already have the crew."],
        ["Protect the house", "Termites, rodents, exclusions, bed bugs. Highest-value work, same company."],
      ]),
      ctaTitle: "Want the house and yard on one list?",
      ctaDescription: "Start with mowing or the full yard. Add pest and seasonal work when you are ready.",
      ctaLabel: "Get a residential quote",
    },
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
  termites: "pest-control",
  termite: "pest-control",
  rodents: "pest-control",
  rodent: "pest-control",
  exclusions: "pest-control",
  exclusion: "pest-control",
  trapping: "pest-control",
  bedbugs: "pest-control",
  "bed-bugs": "pest-control",
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
    quote: "Joe with Cut Rates did a fantastic job on our yard. The guy can mow a yard with the best of em.",
    name: "Mason Burns",
    area: "Google review",
    rating: 5,
  },
  {
    quote: "Cut Rates did a phenomenal job. Communication was top notch. Would highly recommend.",
    name: "Matthew Ankenbrandt",
    area: "Google review",
    rating: 5,
  },
  {
    quote: "Best lawn service I’ve ever used.",
    name: "Austin Lochmann",
    area: "Google review",
    rating: 5,
  },
  {
    quote:
      "Couldn't ask for anything more! Great rates, great work ethic, and when the job wasn't quite done the way we wanted they came back at no extra cost.",
    name: "Mike Schaplowsky",
    area: "Google review",
    rating: 5,
  },
  {
    quote: "Chris and his crew are awesome! They always do a great job and leave the place nice and clean!",
    name: "Joel Atherton",
    area: "Google review",
    rating: 5,
  },
  {
    quote: "Great company with a standup and trustworthy owner! Had a great experience! Highly recommend!!",
    name: "Nicholas Lewis",
    area: "Google review",
    rating: 5,
  },
  {
    quote: "The best company in the area. Has tradition and quality that exceeds anyone comparable.",
    name: "Elizabeth Petrakis",
    area: "Google review",
    rating: 5,
  },
  {
    quote: "Fast and reliable. Also very flexible hours and friendly crew.",
    name: "Gabe Phillips",
    area: "Google review",
    rating: 5,
  },
  {
    quote: "Quality lawn care, quality folks!",
    name: "Zach Castor",
    area: "Google review",
    rating: 5,
  },
]

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "lawn-1",
    title: "Residential lawn care",
    category: "Lawn",
    mediaSlot: "ourwork.lawn.1.after",
  },
  {
    id: "lawn-2",
    title: "Finished turf",
    category: "Lawn",
    mediaSlot: "ourwork.lawn.2.after",
  },
  {
    id: "hardscape-1",
    title: "Patio & outdoor living",
    category: "Hardscape",
    mediaSlot: "ourwork.hardscape.1.after",
  },
  {
    id: "commercial-1",
    title: "Commercial curb appeal",
    category: "Commercial",
    mediaSlot: "ourwork.commercial.1.after",
  },
  {
    id: "landscaping-1",
    title: "Landscape design",
    category: "Landscaping",
    mediaSlot: "services.landscaping",
  },
  {
    id: "pest-1",
    title: "Pest protection",
    category: "Pest",
    mediaSlot: "services.pest-control",
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
  "4.8★ on Google from 24 reviews",
  "As seen on KWCH",
  "Termites · rodents · exclusions · bed bugs",
  "Free quotes in about 2 minutes — no contracts",
]

export const RIBBON_ITEMS = [
  "Mowing",
  "Landscaping",
  "Termites",
  "Bed Bugs",
  "Rodents",
  "Exclusions",
  "Holiday Lights",
  "Snow Removal",
  "Power Washing",
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
