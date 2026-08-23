import { notFound } from "next/navigation"
import { SectionHead } from "@/components/ui/section-head"
import {
  CTASection,
  InteriorHero,
  ServiceGrid,
  TestimonialMarquee,
} from "@/components/blocks"
import {
  getAreaBySlug,
  getAreaSlugs,
  SERVICES,
  testimonialsForArea,
} from "@/lib/marketing-content"

type Props = { params: { slug: string } }

export function generateStaticParams() {
  return getAreaSlugs().map((slug) => ({ slug }))
}

export function generateMetadata({ params }: Props) {
  const area = getAreaBySlug(params.slug)
  if (!area) return { title: "Service area" }
  return {
    title: `Lawn Care in ${area.name}`,
    description: area.blurb,
  }
}

export default function ServiceAreaSlugPage({ params }: Props) {
  const area = getAreaBySlug(params.slug)
  if (!area) notFound()

  const localQuotes = testimonialsForArea(area.name)

  return (
    <div className="bg-paper">
      <InteriorHero
        eyebrow={`${area.name} · KS`}
        title={`Lawn care & landscaping in ${area.name}.`}
        description={area.blurb}
        mediaSlot={area.heroSlot}
        ctaHref={`/quote?area=${area.slug}`}
      />

      <section className="mx-auto w-[min(1200px,92vw)] py-[clamp(2.5rem,5vw,4rem)]">
        <SectionHead
          eyebrow="Local crew"
          title={`Why neighbors in ${area.name} book us.`}
          description="Fast quotes, month-to-month plans, and work that shows up on the curb."
        />
        <dl className="mt-8 grid gap-4 sm:grid-cols-3">
          {area.stats.map((s) => (
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

      <section className="bg-cream py-[clamp(2.5rem,5vw,4rem)]">
        <div className="mx-auto w-[min(1200px,92vw)]">
          <SectionHead
            eyebrow="Services in town"
            title={`What we offer in ${area.name}.`}
          />
          <ServiceGrid services={SERVICES.slice(0, 7)} />
        </div>
      </section>

      <section className="py-[clamp(2rem,4vw,3rem)]">
        <div className="mx-auto mb-4 w-[min(1200px,92vw)]">
          <SectionHead
            eyebrow="Neighbors"
            title="What customers say nearby."
            description={
              localQuotes[0]
                ? `“${localQuotes[0].quote}” — ${localQuotes[0].name}`
                : undefined
            }
          />
        </div>
        <TestimonialMarquee />
      </section>

      <CTASection
        title={
          <>
            Get a {area.name} quote
            <br />
            in about two minutes.
          </>
        }
        ctaHref={`/quote?area=${area.slug}`}
      />
    </div>
  )
}
