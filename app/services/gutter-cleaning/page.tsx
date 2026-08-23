import { ServiceDetailView } from "@/components/blocks"
import { getServiceDetail } from "@/lib/marketing-content"

export const metadata = {
  title: "Gutter Cleaning",
  description: "Residential gutter cleaning from Cut Rates Lawn Care.",
}

export default function GutterCleaningPage() {
  const detail = getServiceDetail("gutter-cleaning")!
  return <ServiceDetailView detail={detail} />
}
