import { notFound } from "next/navigation"

/** Unverified claims — gated until owner confirms in HUMAN_INPUTS.md */
export default function CertificationsPage() {
  if (process.env.NEXT_PUBLIC_SHOW_UNVERIFIED_PAGES !== "true") notFound()
  return null
}
