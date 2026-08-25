import { SectionHead } from "@/components/ui/section-head"
import { CTASection, InteriorHero, ServiceGrid } from "@/components/blocks"
import { SERVICES } from "@/lib/marketing-content"
import { pageWrap } from "@/lib/layout"

export const metadata = {
  title: "Services",
  description:
    "Landscaping, lawn care, aeration, pest control, holiday lights, snow removal, and more — Cut Rates Lawn Care from Wichita to Kansas City.",
}

export default function ServicesPage() {
  return (
    <div className="bg-paper">
      <InteriorHero
        eyebrow="Services"
        title="Landscaping first. Lawn care that keeps up."
        description="Flagship design and hardscape, plus the weekly and seasonal work that makes a yard look finished — not just mowed."
        mediaSlot="services.hero"
      />

      <section className={`${pageWrap} py-[clamp(2.5rem,5vw,4.5rem)]`}>
        <SectionHead
          eyebrow="What we do"
          title="Pick a service. Get a fast quote."
          description="Landscaping is our specialty — everything else supports a yard that stays sharp."
        />
        <ServiceGrid services={SERVICES} />
      </section>

      <CTASection
        title={
          <>
            Not sure what you need?
            <br />
            Start with a quote.
          </>
        }
      />
    </div>
  )
}
