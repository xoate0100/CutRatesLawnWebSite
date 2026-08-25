import { Suspense } from "react"
import { InteriorHero } from "@/components/blocks"
import { QuoteFunnel } from "@/components/quote/quote-funnel"
import { siteConfig } from "@/lib/site-config"
import { pageWrapQuote } from "@/lib/layout"

export const metadata = {
  title: "Get a Quote",
  description:
    "Free planning estimate in about two minutes. Local Cut Rates Lawn Care crew — no contracts.",
}

export default function QuotePage() {
  return (
    <div className="bg-paper">
      <InteriorHero
        eyebrow="Free quote"
        title="See a planning estimate in minutes."
        description={
          <>
            Tell us about your property — we text back fast. Prefer to talk?{" "}
            <a className="underline decoration-lime/60 underline-offset-2" href={`tel:${siteConfig.phone.e164}`}>
              Call {siteConfig.phone.display}
            </a>
            .
          </>
        }
        mediaSlot="services.hero"
        ctaHref="#quote-funnel"
        ctaLabel="Start below"
      />

      <section
        id="quote-funnel"
        className={`${pageWrapQuote} py-[clamp(2.5rem,5vw,4.5rem)]`}
      >
        <div className="rounded-brand border border-line bg-white p-4 shadow-sm sm:p-8">
          <Suspense fallback={<p className="text-center text-sage">Loading quote form…</p>}>
            <QuoteFunnel />
          </Suspense>
        </div>
      </section>
    </div>
  )
}
