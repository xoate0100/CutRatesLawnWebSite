/** In-page scroll targets for homepage-only preview (no off-home routes). */
export const PREVIEW_SECTION = {
  services: "services",
  quote: "quote",
  proof: "proof",
  areas: "areas",
  bundles: "bundles",
  faq: "faq",
  contact: "contact",
} as const

export type PreviewSectionId = (typeof PREVIEW_SECTION)[keyof typeof PREVIEW_SECTION]

/** Map primary nav labels → homepage section ids. */
export const NAV_SCROLL_TARGET: Record<string, PreviewSectionId> = {
  Services: PREVIEW_SECTION.services,
  Areas: PREVIEW_SECTION.areas,
  "Our Work": PREVIEW_SECTION.proof,
  Bundles: PREVIEW_SECTION.bundles,
  About: PREVIEW_SECTION.faq,
  Contact: PREVIEW_SECTION.contact,
}

export const QUOTE_SOON_MESSAGE =
  "Quotes launching soon — call/text (316) 925-5050."

export function scrollToSection(id: string) {
  if (typeof document === "undefined") return
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: "smooth", block: "start" })
}
