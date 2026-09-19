import { ServiceDetailView } from "@/components/blocks"
import { getServiceDetail } from "@/lib/marketing-content"

export const metadata = {
  title: "Snow Removal — Driveways, Walks & Lots",
  description:
    "Cut Rates Lawn Care snow removal in Wichita: residential driveways, walks, and commercial lots. Seasonal routes that trigger with the storm — we run the equipment.",
}

export default function SnowRemovalPage() {
  const detail = getServiceDetail("snow-removal")!
  return <ServiceDetailView detail={detail} />
}
