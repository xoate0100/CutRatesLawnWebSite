import { ServiceDetailView } from "@/components/blocks"
import { getServiceDetail } from "@/lib/marketing-content"

export const metadata = {
  title: "Lawn Care — Mowing, Fertilization & Weed Control",
  description:
    "Weekly or biweekly mowing, fertility, and weed control from Cut Rates Lawn Care. Instant starting-at numbers, local crew, no contracts.",
}

export default function LawnCarePage() {
  const detail = getServiceDetail("lawn-care")!
  return <ServiceDetailView detail={detail} galleryCategory="Lawn" />
}
