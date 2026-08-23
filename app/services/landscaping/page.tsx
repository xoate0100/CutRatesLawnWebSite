import { ServiceDetailView } from "@/components/blocks"
import { getServiceDetail } from "@/lib/marketing-content"

export const metadata = {
  title: "Landscaping & Design",
  description:
    "Custom landscaping, planting, and outdoor design from Cut Rates Lawn Care — Wichita to Kansas City.",
}

export default function LandscapingPage() {
  const detail = getServiceDetail("landscaping")!
  return <ServiceDetailView detail={detail} galleryCategory="Hardscape" />
}
