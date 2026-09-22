import { notFound } from "next/navigation"

/** Template filler — gated until owner confirms in HUMAN_INPUTS.md */
export default function CaseStudiesPage() {
  if (process.env.NEXT_PUBLIC_SHOW_UNVERIFIED_PAGES !== "true") notFound()
  return null
}
