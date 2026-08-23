import { ServiceDetailView } from "@/components/blocks"
import { getServiceDetail } from "@/lib/marketing-content"

export const metadata = {
  title: "Power Washing",
  description: "Driveway and exterior power washing from Cut Rates Lawn Care.",
}

export default function PowerWashingPage() {
  const detail = getServiceDetail("power-washing")!
  return <ServiceDetailView detail={detail} />
}
