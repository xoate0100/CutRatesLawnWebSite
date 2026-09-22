import type { Metadata } from "next"
import { AnalyticsPhoneLink } from "@/components/analytics/phone-link"
import { QuoteFunnel } from "@/components/quote/quote-funnel"
import { FAQAccordion } from "@/components/blocks"
import { GoogleReviewsRotator } from "@/components/trust/google-reviews-rotator"
import { siteConfig } from "@/lib/site-config"
import { getServiceDetail } from "@/lib/marketing-content"
import { GHL_SERVICE_LABELS, getQuoteService, resolveQuoteService, QUOTE_SERVICES } from "@/lib/quote/taxonomy"
import { Suspense } from "react"

type Props = { params: { service: string } }

export function generateStaticParams() {
  return QUOTE_SERVICES.map((s) => ({ service: s.servicePageSlug })).filter(
    (v, i, a) => a.findIndex((x) => x.service === v.service) === i,
  )
}

export function generateMetadata({ params }: Props): Metadata {
  const id = resolveQuoteService(params.service)
  const label = id ? GHL_SERVICE_LABELS[id] : params.service
  return {
    title: `${label} — Get a quote`,
    robots: { index: false, follow: false },
  }
}

export default function PaidLandingPage({ params }: Props) {
  const id = resolveQuoteService(params.service) || params.service
  const def = getQuoteService(id)
  const detail = getServiceDetail(def?.servicePageSlug || params.service)
  return (
    <div className="bg-paper min-h-screen">
      <header className="flex items-center justify-between border-b border-line px-4 py-3">
        <span className="font-display font-extrabold text-forest">Cut Rates</span>
        <AnalyticsPhoneLink href={`tel:${siteConfig.phone.e164}`} location="lp_header" className="font-bold text-forest">
          {siteConfig.phone.display}
        </AnalyticsPhoneLink>
      </header>
      <div className="mx-auto max-w-xl px-4 py-8">
        <p className="text-sm font-bold uppercase tracking-wider text-sage">{def?.label ?? "Quote"}</p>
        <h1 className="font-display mt-2 text-3xl font-extrabold">
          {detail?.title ?? def?.label ?? "Get a quote"}
        </h1>
        <p className="mt-3 text-sage">{detail?.description ?? "Local crew. No contracts. We’ll follow up after you submit."}</p>
        <div className="mt-6 rounded-brand border border-line bg-white p-4">
          <Suspense fallback={<p>Loading…</p>}>
            <QuoteFunnel />
          </Suspense>
        </div>
        <div className="mt-8">
          <GoogleReviewsRotator />
        </div>
        {detail?.faqs?.length ? (
          <div className="mt-8">
            <FAQAccordion items={detail.faqs} />
          </div>
        ) : null}
      </div>
    </div>
  )
}
