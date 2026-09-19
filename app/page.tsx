import { SectionHead } from "@/components/ui/section-head"
import { pageWrap, pageWrapNarrow, pageWrapMid } from "@/lib/layout"
import {
  AreaChips,
  BundleCards,
  CTASection,
  FAQAccordion,
  Hero,
  QuoteBand,
  RibbonMarquee,
  ServiceGrid,
  TestimonialMarquee,
} from "@/components/blocks"
import { GoogleReviewsRotator } from "@/components/trust/google-reviews-rotator"
import { PressFeature } from "@/components/trust/press-feature"
import { TrustBar } from "@/components/trust/trust-bar"

export default function HomePage() {
  return (
    <div className="bg-paper">
      <Hero />
      <RibbonMarquee />

      <section className={`${pageWrap} py-[clamp(2.5rem,5vw,4.5rem)]`}>
        <SectionHead
          eyebrow="Popular services"
          title="The work your property actually needs."
          description="Landscaping and weekly lawn care — plus termites, rodents, bed bugs, and the seasonal jobs that keep a property finished."
        />
        <ServiceGrid />
      </section>

      <QuoteBand />

      <section className={`${pageWrapMid} py-[clamp(2.5rem,5vw,4.5rem)]`}>
        <SectionHead
          eyebrow="Proof"
          title="4.8 stars on Google. Featured on KWCH."
          description="Real Wichita-area customers — and a KWCH story featuring owner Chris Porter."
          align="center"
        />
        <TrustBar className="mt-6 justify-center" />
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <GoogleReviewsRotator />
          <PressFeature />
        </div>
      </section>

      <TestimonialMarquee />

      <section className="bg-cream py-[clamp(2.5rem,5vw,4rem)]">
        <div className={`${pageWrap}`}>
          <SectionHead
            eyebrow="Service areas"
            title="Wichita to the Kansas City side."
            description="Seven towns. Local crews. Same easy booking."
          />
          <AreaChips />
        </div>
      </section>

      <section className={`${pageWrap} py-[clamp(2.5rem,5vw,4.5rem)]`}>
        <SectionHead
          eyebrow="Bundles"
          title="Starting-at plans that stay flexible."
          description="Month-to-month packages — pick what fits, change later."
        />
        <BundleCards />
      </section>

      <section className="bg-cream py-[clamp(2.5rem,5vw,4rem)]">
        <div className={`${pageWrapNarrow}`}>
          <SectionHead eyebrow="FAQ" title="Straight answers." align="center" />
          <FAQAccordion />
        </div>
      </section>

      <CTASection />
    </div>
  )
}
