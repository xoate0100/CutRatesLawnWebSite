import { notFound } from "next/navigation"
import { ServiceDetailView } from "@/components/blocks"
import { getServiceDetail, getServiceSlugs } from "@/lib/marketing-content"

type Props = { params: { slug: string } }

export function generateStaticParams() {
  return getServiceSlugs().map((slug) => ({ slug }))
}

export function generateMetadata({ params }: Props) {
  const detail = getServiceDetail(params.slug)
  if (!detail) return { title: "Service" }
  return {
    title: detail.title,
    description: detail.description,
  }
}

export default function ServiceSlugPage({ params }: Props) {
  const detail = getServiceDetail(params.slug)
  if (!detail) notFound()
  return <ServiceDetailView detail={detail} />
}
