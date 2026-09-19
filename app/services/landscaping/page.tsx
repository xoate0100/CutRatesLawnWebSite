import { ServiceDetailView } from "@/components/blocks"
import { getServiceDetail } from "@/lib/marketing-content"

export const metadata = {
  title: "Landscaping & Design — Wichita to Kansas City",
  description:
    "Design, planting, irrigation, and maintenance from Cut Rates Lawn Care. A scope you can decide on — then a local crew installs and keeps it.",
}

export default function LandscapingPage() {
  const detail = getServiceDetail("landscaping")!
  return <ServiceDetailView detail={detail} galleryCategory="Hardscape" />
}
