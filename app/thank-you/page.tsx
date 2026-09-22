import { Suspense } from "react"
import type { Metadata } from "next"
import { ThankYouClient } from "@/components/quote/thank-you-client"

export const metadata: Metadata = {
  title: "Request received",
  robots: { index: false, follow: false },
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<p className="p-8 text-sage">Loading…</p>}>
      <ThankYouClient />
    </Suspense>
  )
}
