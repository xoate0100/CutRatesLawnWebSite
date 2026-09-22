import { Suspense } from "react"
import type { Metadata } from "next"
import { ThankYouClient } from "@/components/quote/thank-you-client"

type Props = { params: { service: string } }

export const metadata: Metadata = {
  title: "Request received",
  robots: { index: false, follow: false },
}

export default function ThankYouServicePage({ params }: Props) {
  return (
    <Suspense fallback={<p className="p-8 text-sage">Loading…</p>}>
      <ThankYouClient service={params.service} />
    </Suspense>
  )
}
