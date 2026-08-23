import { SectionHead } from "@/components/ui/section-head"
import {
  CTASection,
  FAQAccordion,
  Gallery,
  InteriorHero,
  ProcessSteps,
} from "@/components/blocks"
import {
  GALLERY_ITEMS,
  getServiceDetail,
  type ServiceDetail,
} from "@/lib/marketing-content"

export function ServiceDetailView({
  detail,
  galleryCategory,
}: {
  detail: ServiceDetail
  galleryCategory?: string
}) {
  const gallery = galleryCategory
    ? GALLERY_ITEMS.filter((g) => g.category === galleryCategory)
    : GALLERY_ITEMS.slice(0, 3)

  return (
    <div className="bg-paper">
      <InteriorHero
        eyebrow={detail.eyebrow ?? "Service"}
        title={detail.title}
        description={detail.longDescription}
        mediaSlot={detail.mediaSlot}
        ctaHref={`/quote?service=${detail.id}`}
        ctaLabel="Get a quote"
      />

      <section className="mx-auto w-[min(1200px,92vw)] py-[clamp(2.5rem,5vw,4rem)]">
        <SectionHead
          eyebrow="What’s included"
          title="Clear scope. Local crew. Done right."
          description={detail.description}
        />
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {detail.highlights.map((h) => (
            <li
              key={h}
              className="rounded-brand border border-line bg-white px-4 py-3 text-sm font-semibold text-ink"
            >
              <span className="mr-2 text-green" aria-hidden>
                ✓
              </span>
              {h}
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-cream py-[clamp(2.5rem,5vw,4rem)]">
        <div className="mx-auto w-[min(1200px,92vw)]">
          <SectionHead
            eyebrow="How it works"
            title="From quote to curb appeal."
          />
          <ProcessSteps />
        </div>
      </section>

      {gallery.length > 0 ? (
        <section className="mx-auto w-[min(1200px,92vw)] py-[clamp(2.5rem,5vw,4rem)]">
          <SectionHead eyebrow="Our work" title="Results on real properties." />
          <Gallery items={gallery} className="mt-8" />
        </section>
      ) : null}

      <section className="bg-cream py-[clamp(2.5rem,5vw,4rem)]">
        <div className="mx-auto w-[min(900px,92vw)]">
          <SectionHead eyebrow="FAQ" title="Quick answers." align="center" />
          <FAQAccordion items={detail.faqs} className="mt-8" />
        </div>
      </section>

      <CTASection
        title={
          <>
            Ready for {detail.title.toLowerCase()}?
          </>
        }
        description="Free planning estimate in about two minutes. No contracts."
        ctaHref={`/quote?service=${detail.id}`}
      />
    </div>
  )
}

export function ServiceDetailBySlug({ slug }: { slug: string }) {
  const detail = getServiceDetail(slug)
  if (!detail) return null
  return <ServiceDetailView detail={detail} />
}
