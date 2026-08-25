import Link from "next/link"
import { SectionHead } from "@/components/ui/section-head"
import { AreaChips, CTASection, InteriorHero } from "@/components/blocks"
import { SERVICE_AREAS } from "@/lib/marketing-content"
import { pageWrap } from "@/lib/layout"

export const metadata = {
  title: "Service Areas",
  description:
    "Cut Rates Lawn Care serves Wichita, Valley Center, Andover, Derby, Maize, Kansas City, and Leavenworth.",
}

export default function ServiceAreasPage() {
  return (
    <div className="bg-paper">
      <InteriorHero
        eyebrow="Where we work"
        title="Seven towns. One easy booking."
        description="From Wichita and the surrounding communities to the Kansas City side — local crews, no contracts."
        mediaSlot="services.hero"
      />

      <section className={`${pageWrap} py-[clamp(2.5rem,5vw,4.5rem)]`}>
        <SectionHead
          eyebrow="Towns"
          title="Find your neighborhood."
          description="Tap a town for local details — or jump straight to a quote."
        />
        <AreaChips className="mt-8" />

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_AREAS.map((area) => (
            <li key={area.slug}>
              <Link
                href={area.href}
                className="block rounded-brand border border-line bg-white p-5 transition-transform hover:-translate-y-1 hover:shadow-brand"
              >
                <h3 className="font-display text-xl font-bold text-ink">{area.name}</h3>
                <p className="mt-1 text-sm text-sage">Lawn care & landscaping</p>
                <span className="mt-3 inline-flex font-bold text-green">View area →</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <CTASection title="Serving your town — get a quote." />
    </div>
  )
}
