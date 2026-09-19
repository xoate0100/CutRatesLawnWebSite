import { ServiceDetailView } from "@/components/blocks"
import { getServiceDetail } from "@/lib/marketing-content"

export const metadata = {
  title: "Aeration & Overseeding — Kansas Seasonal Windows",
  description:
    "Core aeration and overseeding from Cut Rates Lawn Care, timed for Kansas clay. Thicker turf and stronger roots — book the window, not a random Saturday.",
}

export default function AerationPage() {
  const detail = getServiceDetail("aeration")!
  return <ServiceDetailView detail={detail} galleryCategory="Lawn" />
}
