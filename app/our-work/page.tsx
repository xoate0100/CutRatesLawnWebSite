import { SectionHead } from "@/components/ui/section-head"
import { pageWrap } from "@/lib/layout"
import { CTASection, Gallery, InteriorHero } from "@/components/blocks"
import { GoogleReviewsRotator } from "@/components/trust/google-reviews-rotator"
import { PressFeature } from "@/components/trust/press-feature"

export const metadata = {
  title: "Our Work",
  description:
    "Lawn, landscape, commercial, and pest-protection work from Cut Rates Lawn Care — Wichita to Kansas City.",
}

export default function OurWorkPage() {
  return (
    <div className="bg-paper">
      <InteriorHero
        eyebrow="Portfolio"
        title="Finished work on local properties."
        description="Browse the kinds of jobs we run every week — lawn, landscape, commercial, and pest protection."
        mediaSlot="gallery.after"
      />

      <section className={`${pageWrap} py-[clamp(2.5rem,5vw,4.5rem)]`}>
        <SectionHead
          eyebrow="Gallery"
          title="Browse by category."
          description="Lawn, hardscape, commercial, landscaping, and pest protection."
        />
        <Gallery className="mt-8" />
      </section>

      <section className={`${pageWrap} pb-[clamp(2.5rem,5vw,4.5rem)]`}>
        <div className="grid gap-4 lg:grid-cols-2">
          <GoogleReviewsRotator />
          <PressFeature />
        </div>
      </section>

      <CTASection title="Like what you see? Get a quote." />
    </div>
  )
}