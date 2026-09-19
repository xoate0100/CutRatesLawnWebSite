import { ServiceDetailView } from "@/components/blocks"
import { getServiceDetail } from "@/lib/marketing-content"

export const metadata = {
  title: "Commercial Lawn Care — HOAs, Retail & Offices",
  description:
    "Route-based commercial grounds from Cut Rates Lawn Care. Weekly mowing, beds, snow, and pest — one point of contact for properties that have to look tenant-ready.",
}

export default function CommercialPage() {
  const detail = getServiceDetail("commercial")!
  return <ServiceDetailView detail={detail} galleryCategory="Commercial" />
}
