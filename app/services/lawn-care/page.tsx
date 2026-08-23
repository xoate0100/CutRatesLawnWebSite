import { ServiceDetailView } from "@/components/blocks"
import { getServiceDetail } from "@/lib/marketing-content"

export const metadata = {
  title: "Lawn Care",
  description: "Mowing, fertilization, and weed control from Cut Rates Lawn Care.",
}

export default function LawnCarePage() {
  const detail = getServiceDetail("lawn-care")!
  return <ServiceDetailView detail={detail} galleryCategory="Lawn" />
}
