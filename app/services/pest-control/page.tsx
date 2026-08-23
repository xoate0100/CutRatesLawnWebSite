import { ServiceDetailView } from "@/components/blocks"
import { getServiceDetail } from "@/lib/marketing-content"

export const metadata = {
  title: "Pest Control",
  description: "Exterior pest control for lawns and perimeters — Cut Rates Lawn Care.",
}

export default function PestControlPage() {
  const detail = getServiceDetail("pest-control")!
  return <ServiceDetailView detail={detail} />
}
