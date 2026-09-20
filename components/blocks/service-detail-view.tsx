import { SectionHead } from "@/components/ui/section-head"
import { pageWrap, pageWrapNarrow } from "@/lib/layout"
import {
  CTASection,
  FAQAccordion,
  InteriorHero,
  ProcessSteps,
} from "@/components/blocks"
import { ServiceOfferings } from "@/components/blocks/service-offerings"
import { GoogleReviewsRotator } from "@/components/trust/google-reviews-rotator"
import { getServiceDetail, type ServiceDetail } from "@/lib/marketing-content"

export function ServiceDetailView({
  detail,
  areaSlug,
}: {
  detail: ServiceDetail
  galleryCategory?: string
  areaSlug?: string
}) {
  const quoteHref = areaSlug ? `/quote/${detail.id}?area=${areaSlug}` : `/quote/${detail.id}`
  return (
    <div className="bg-paper">
      <InteriorHero
        eyebrow={detail.eyebrow ?? "Service"}
        title={detail.title}
        description={detail.longDescription}
        mediaSlot={detail.mediaSlot}
        ctaHref={quoteHref}
        ctaLabel={detail.ctaLabel ?? "Get a quote"}
      />

      <section className={`${pageWrap} py-[clamp(2.5rem,5vw,4rem)]`}>
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

      {detail.offerings?.length ? (
        <section className={`${pageWrap} pb-[clamp(2.5rem,5vw,4rem)]`}>
          <SectionHead
            eyebrow={detail.offeringsEyebrow ?? "How we help"}
            title={detail.offeringsTitle ?? "Pick the job. Get a quote."}
            description={
              detail.offeringsDescription ??
              "Start with the problem. We will quote the right visit — not a generic package."
            }
          />
          <ServiceOfferings offerings={detail.offerings} className="mt-8" />
        </section>
      ) : null}

      <section className="bg-cream py-[clamp(2.5rem,5vw,4rem)]">
        <div className={`${pageWrap}`}>
          <SectionHead
            eyebrow="How it works"
            title={detail.processTitle ?? "From quote to a finished job."}
            description={detail.processDescription}
          />
          <ProcessSteps steps={detail.processSteps} />
        </div>
      </section>

      <section className={`${pageWrap} py-[clamp(2.5rem,5vw,4rem)]`}>
        <GoogleReviewsRotator />
      </section>

      <section className="bg-cream py-[clamp(2.5rem,5vw,4rem)]">
        <div className={`${pageWrapNarrow}`}>
          <SectionHead eyebrow="FAQ" title="Quick answers." align="center" />
          <FAQAccordion items={detail.faqs} className="mt-8" />
        </div>
      </section>

      <CTASection
        title={detail.ctaTitle ?? <>Ready for {detail.title.toLowerCase()}?</>}
        description={
          detail.ctaDescription ??
          "Free planning quote. Local crew. No contracts."
        }
        ctaHref={quoteHref}
        ctaLabel={detail.ctaLabel ?? "Get a quote"}
      />
    </div>
  )
}

export function ServiceDetailBySlug({ slug }: { slug: string }) {
  const detail = getServiceDetail(slug)
  if (!detail) return null
  return <ServiceDetailView detail={detail} />
}