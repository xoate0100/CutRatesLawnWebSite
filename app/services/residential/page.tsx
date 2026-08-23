import { ServiceDetailView } from "@/components/blocks"
import { getServiceDetail } from "@/lib/marketing-content"

export const metadata = {
  title: "Residential Packages",
  description: "Home exterior care packages from Cut Rates Lawn Care.",
}

export default function ResidentialPage() {
  const detail = getServiceDetail("residential")!
  return <ServiceDetailView detail={detail} galleryCategory="Lawn" />
}
