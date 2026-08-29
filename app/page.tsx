import { SectionHead } from "@/components/ui/section-head"
import { pageWrap, pageWrapNarrow, pageWrapMid } from "@/lib/layout"
import { PREVIEW_SECTION } from "@/lib/preview-nav"
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

      <section
        id={PREVIEW_SECTION.services}
        className={`${pageWrap} py-[clamp(2.5rem,5vw,4.5rem)] scroll-mt-24`}
      >
        <SectionHead
          eyebrow="Popular services"
          title="The work your property actually needs."
          description="Landscaping first — then the weekly care that keeps it looking sharp."
        />
        <ServiceGrid />
      </section>

      <QuoteBand />

      <section
        id={PREVIEW_SECTION.proof}
        className={`${pageWrapMid} py-[clamp(2.5rem,5vw,4.5rem)] scroll-mt-24`}
      >
        <SectionHead
          eyebrow="Proof"
          title="Before and after, side by side."
          description="Drag the slider — real yards, local work."
          align="center"
        />
        <BeforeAfterSlider className="mt-8" />
      </section>

      <TestimonialMarquee />

      <section
        id={PREVIEW_SECTION.areas}
        className="bg-cream py-[clamp(2.5rem,5vw,4rem)] scroll-mt-24"
      >
        <div className={`${pageWrap}`}>
          <SectionHead
            eyebrow="Service areas"
            title="Wichita to the Kansas City side."
            description="Seven towns. Local crews. Same easy booking."
          />
          <AreaChips />
        </div>
      </section>

      <section
        id={PREVIEW_SECTION.bundles}
        className={`${pageWrap} py-[clamp(2.5rem,5vw,4.5rem)] scroll-mt-24`}
      >
        <SectionHead
          eyebrow="Bundles"
          title="Starting-at plans that stay flexible."
          description="Month-to-month packages — pick what fits, change later."
        />
        <BundleCards />
      </section>

      <section
        id={PREVIEW_SECTION.faq}
        className="bg-cream py-[clamp(2.5rem,5vw,4rem)] scroll-mt-24"
      >
        <div className={`${pageWrapNarrow}`}>
          <SectionHead eyebrow="FAQ" title="Straight answers." align="center" />
          <FAQAccordion />
        </div>
      </section>

      <CTASection />
    </div>
  )
}
