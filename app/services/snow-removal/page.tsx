import { ServiceDetailView } from "@/components/blocks"
import { getServiceDetail } from "@/lib/marketing-content"

export const metadata = {
  title: "Snow Removal",
  description: "Residential and commercial snow clearing from Cut Rates Lawn Care.",
}

export default function SnowRemovalPage() {
  const detail = getServiceDetail("snow-removal")!
  return <ServiceDetailView detail={detail} />
}
