import { SectionHead } from "@/components/ui/section-head"
import { CTASection, InteriorHero, TeamGrid } from "@/components/blocks"
import { ABOUT_STATS } from "@/lib/marketing-content"

export const metadata = {
  title: "About",
  description:
    "Family-owned landscaping and lawn care from Valley Center — serving Wichita to Kansas City.",
}

export default function AboutPage() {
  return (
    <div className="bg-paper">
      <InteriorHero
        eyebrow="About us"
        title="Local crew. Straight talk. Done right."
        description="Family-owned Cut Rates Lawn Care — landscaping flagship work and dependable lawn care from Wichita to the Kansas City side."
        mediaSlot="about.hero"
      />

      <section className="mx-auto w-[min(1200px,92vw)] py-[clamp(2.5rem,5vw,4.5rem)]">
        <SectionHead
          eyebrow="Our story"
          title="Show up. Do the work. Make booking easy."
          description="We built Cut Rates for homeowners who want a better-looking lawn without chasing contractors. No contracts, fast quotes, and a crew that treats your property like a neighbor’s — because we are."
        />
        <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ABOUT_STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-brand border border-line bg-cream px-5 py-4 text-center"
            >
              <dt className="text-xs font-bold uppercase tracking-wider text-sage">{s.label}</dt>
              <dd className="font-display mt-1 text-2xl font-extrabold text-forest">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="bg-cream py-[clamp(2.5rem,5vw,4.5rem)]">
        <div className="mx-auto w-[min(1200px,92vw)]">
          <SectionHead
            eyebrow="Team"
            title="People behind the routes."
            description="Operations, scheduling, and field crews focused on consistent results."
          />
          <TeamGrid />
        </div>
      </section>

      <CTASection title="Meet the crew on your next quote." />
    </div>
  )
}
