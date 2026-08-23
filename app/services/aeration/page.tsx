import { ServiceDetailView } from "@/components/blocks"
import { getServiceDetail } from "@/lib/marketing-content"

export const metadata = {
  title: "Aeration & Overseeding",
  description:
    "Core aeration and overseeding for thicker turf — seasonal service from Cut Rates Lawn Care.",
}

export default function AerationPage() {
  const detail = getServiceDetail("aeration")!
  return <ServiceDetailView detail={detail} galleryCategory="Lawn" />
}
