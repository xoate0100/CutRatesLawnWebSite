import { notFound } from "next/navigation"
import { ServiceDetailView } from "@/components/blocks"
import { LocalBusinessJsonLd } from "@/components/seo/local-business-json-ld"
import { getAreaBySlug, getAreaSlugs, getServiceDetail, SERVICES } from "@/lib/marketing-content"
import { GHL_SERVICE_LABELS, resolveQuoteService, QUOTE_SERVICES } from "@/lib/quote/taxonomy"
import { siteConfig } from "@/lib/site-config"
import type { Metadata } from "next"

type Props = { params: { slug: string; service: string } }

export function generateStaticParams() {
  const areas = getAreaSlugs()
  const services = Array.from(new Set(QUOTE_SERVICES.map((s) => s.servicePageSlug)))
  return areas.flatMap((slug) => services.map((service) => ({ slug, service })))
}

export function generateMetadata({ params }: Props): Metadata {
  const area = getAreaBySlug(params.slug)
  const id = resolveQuoteService(params.service)
  const label = id ? GHL_SERVICE_LABELS[id] : params.service
  return {
    title: `${label} in ${area?.name ?? params.slug}`,
    description: `${label} from Cut Rates Lawn Care in ${area?.name ?? params.slug}, KS.`,
    alternates: { canonical: `${siteConfig.url}/service-areas/${params.slug}/${params.service}` },
  }
}

export default function AreaServicePage({ params }: Props) {
  const area = getAreaBySlug(params.slug)
  if (!area) notFound()
  const detail = getServiceDetail(params.service)
  if (!detail) notFound()
  if (!SERVICES.some((s) => s.id === detail.id)) notFound()

  return (
    <div className="bg-paper">
      <LocalBusinessJsonLd />
      <ServiceDetailView
        detail={{
          ...detail,
          eyebrow: `${area.name} · ${detail.eyebrow ?? "Service"}`,
          title: `${detail.title} in ${area.name}`,
        }}
        areaSlug={area.slug}
      />
    </div>
  )
}
