import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { InteriorHero } from "@/components/blocks"
import { QuoteFunnel } from "@/components/quote/quote-funnel"
import { pageWrapQuote } from "@/lib/layout"
import { GHL_SERVICE_LABELS, getQuoteService, resolveQuoteService, QUOTE_SERVICES } from "@/lib/quote/taxonomy"
import { siteConfig } from "@/lib/site-config"

type Props = { params: { service: string } }

export function generateStaticParams() {
  return QUOTE_SERVICES.map((s) => ({ service: s.id }))
}

export function generateMetadata({ params }: Props): Metadata {
  const id = resolveQuoteService(params.service)
  const label = id ? GHL_SERVICE_LABELS[id] : "Quote"
  return {
    title: `${label} quote`,
    description: `Free ${label.toLowerCase()} planning quote from Cut Rates Lawn Care.`,
    alternates: { canonical: `${siteConfig.url}/quote/${params.service}` },
  }
}

export default function QuoteServicePage({ params }: Props) {
  const id = resolveQuoteService(params.service)
  if (!id && params.service) {
    const def = getQuoteService(params.service)
    if (!def) notFound()
  }
  const def = getQuoteService(id || params.service)
  return (
    <div className="bg-paper">
      <InteriorHero
        eyebrow="Free quote"
        title={`${def?.label ?? "Service"} — planning estimate.`}
        description="Tell us about the property. We text back with a real next step."
        ctaHref="#quote-funnel"
        ctaLabel="Start below"
      />
      <section id="quote-funnel" className={`${pageWrapQuote} py-[clamp(2.5rem,5vw,4.5rem)]`}>
        <div className="rounded-brand border border-line bg-white p-4 shadow-sm sm:p-8">
          <Suspense fallback={<p className="text-center text-sage">Loading quote form…</p>}>
            <QuoteFunnel />
          </Suspense>
        </div>
      </section>
    </div>
  )
}
