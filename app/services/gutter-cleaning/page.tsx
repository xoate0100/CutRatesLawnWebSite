import { ServiceDetailView } from "@/components/blocks"
import { getServiceDetail } from "@/lib/marketing-content"

export const metadata = {
  title: "Gutter Cleaning — Before the Next Storm",
  description:
    "Residential gutter cleaning from Cut Rates Lawn Care. Debris out, downspouts flowing, damage flagged — and sequenced before holiday lights go up.",
}

export default function GutterCleaningPage() {
  const detail = getServiceDetail("gutter-cleaning")!
  return <ServiceDetailView detail={detail} />
}
