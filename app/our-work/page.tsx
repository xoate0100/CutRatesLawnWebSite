import { SectionHead } from "@/components/ui/section-head"
import {
  BeforeAfterSlider,
  CTASection,
  Gallery,
  InteriorHero,
} from "@/components/blocks"

export const metadata = {
  title: "Our Work",
  description: "Before-and-after lawn and landscape projects from Cut Rates Lawn Care.",
}

export default function OurWorkPage() {
  return (
    <div className="bg-paper">
      <InteriorHero
        eyebrow="Portfolio"
        title="Real yards. Local results."
        description="Filter the gallery, then drag the slider — proof before you book."
        mediaSlot="gallery.after"
      />

      <section className="mx-auto w-[min(1200px,92vw)] py-[clamp(2.5rem,5vw,4.5rem)]">
        <SectionHead
          eyebrow="Gallery"
          title="Browse by category."
          description="Lawn, hardscape, and commercial work across our service area."
        />
        <Gallery className="mt-8" />
      </section>

      <section className="bg-cream py-[clamp(2.5rem,5vw,4.5rem)]">
        <div className="mx-auto w-[min(1000px,92vw)]">
          <SectionHead
            eyebrow="Compare"
            title="Before and after."
            align="center"
          />
          <BeforeAfterSlider className="mt-8" />
        </div>
      </section>

      <CTASection title="Like what you see? Get a quote." />
    </div>
  )
}
