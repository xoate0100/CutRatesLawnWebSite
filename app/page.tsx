import { SectionHead } from "@/components/ui/section-head"
import {
  AreaChips,
  BeforeAfterSlider,
  BundleCards,
  CTASection,
  FAQAccordion,
  Hero,
  QuoteBand,
  RibbonMarquee,
  ServiceGrid,
  TestimonialMarquee,
} from "@/components/blocks"

export default function HomePage() {
  return (
    <div className="bg-paper">
      <Hero />
      <RibbonMarquee />

      <section className="mx-auto w-[min(1200px,92vw)] py-[clamp(2.5rem,5vw,4.5rem)]">
        <SectionHead
          eyebrow="Popular services"
          title="The work your property actually needs."
          description="Landscaping first — then the weekly care that keeps it looking sharp."
        />
        <ServiceGrid />
      </section>

      <QuoteBand />

      <section className="mx-auto w-[min(1000px,92vw)] py-[clamp(2.5rem,5vw,4.5rem)]">
        <SectionHead
          eyebrow="Proof"
          title="Before and after, side by side."
          description="Drag the slider — real yards, local work."
          align="center"
        />
        <BeforeAfterSlider className="mt-8" />
      </section>

      <TestimonialMarquee />

      <section className="bg-cream py-[clamp(2.5rem,5vw,4rem)]">
        <div className="mx-auto w-[min(1200px,92vw)]">
          <SectionHead
            eyebrow="Service areas"
            title="Wichita to the Kansas City side."
            description="Seven towns. Local crews. Same easy booking."
          />
          <AreaChips />
        </div>
      </section>

      <section className="mx-auto w-[min(1200px,92vw)] py-[clamp(2.5rem,5vw,4.5rem)]">
        <SectionHead
          eyebrow="Bundles"
          title="Starting-at plans that stay flexible."
          description="Month-to-month packages — pick what fits, change later."
        />
        <BundleCards />
      </section>

      <section className="bg-cream py-[clamp(2.5rem,5vw,4rem)]">
        <div className="mx-auto w-[min(900px,92vw)]">
          <SectionHead eyebrow="FAQ" title="Straight answers." align="center" />
          <FAQAccordion />
        </div>
      </section>

      <CTASection />
    </div>
  )
}
