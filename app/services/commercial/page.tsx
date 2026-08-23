import { ServiceDetailView } from "@/components/blocks"
import { getServiceDetail } from "@/lib/marketing-content"

export const metadata = {
  title: "Commercial Lawn Care",
  description: "Route-based commercial property maintenance from Cut Rates Lawn Care.",
}

export default function CommercialPage() {
  const detail = getServiceDetail("commercial")!
  return <ServiceDetailView detail={detail} galleryCategory="Commercial" />
}
