import { ServiceDetailView } from "@/components/blocks"
import { getServiceDetail } from "@/lib/marketing-content"

export const metadata = {
  title: "Hardscaping",
  description: "Patios, walks, and outdoor structure from Cut Rates Lawn Care.",
}

export default function HardscapingPage() {
  const detail = getServiceDetail("hardscaping")!
  return <ServiceDetailView detail={detail} galleryCategory="Hardscape" />
}
