import { SectionHead } from "@/components/ui/section-head"
import { pageWrap, pageWrapNarrow } from "@/lib/layout"
import {
  BundleCards,
  CompareTable,
  CTASection,
  FAQAccordion,
  InteriorHero,
} from "@/components/blocks"
import { BUNDLE_FAQS } from "@/lib/marketing-content"

export const metadata = {
  title: "Bundles",
  description:
    "Starting-at lawn care bundles from Cut Rates — Essentials, Full Yard, and Estate. Month-to-month, no contracts.",
}

export default function BundlesPage() {
  return (
    <div className="bg-paper">
      <InteriorHero
        eyebrow="Plans"
        title="Starting-at bundles that stay flexible."
        description="Planning estimates for typical residential lots. Final price confirmed after your quote — no long contracts."
        mediaSlot="page.bundles-all.1"
      />

      <section className={`${pageWrap} py-[clamp(2.5rem,5vw,4.5rem)]`}>
        <SectionHead
          eyebrow="Choose a plan"
          title="Starting at prices. Month to month."
          description="Upgrade or pause whenever — stay because the lawn looks great."
        />
        <BundleCards />
      </section>

      <section className="bg-cream py-[clamp(2.5rem,5vw,4rem)]">
        <div className={`${pageWrap}`}>
          <SectionHead
            eyebrow="Compare"
            title="What’s included at each starting price."
          />
          <CompareTable />
        </div>
      </section>

      <section className={`${pageWrapNarrow} py-[clamp(2.5rem,5vw,4rem)]`}>
        <SectionHead eyebrow="FAQ" title="Bundle questions." align="center" />
        <FAQAccordion items={BUNDLE_FAQS} />
      </section>

      <CTASection
        title="Pick a starting-at plan — get a quote."
        description="Tell us your lot size and we’ll confirm pricing fast."
      />
    </div>
  )
}
