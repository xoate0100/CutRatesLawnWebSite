import { ServiceDetailView } from "@/components/blocks"
import { getServiceDetail } from "@/lib/marketing-content"

export const metadata = {
  title: "Hardscaping — Patios, Walks & Retaining Walls",
  description:
    "Patios, walks, and walls from Cut Rates Lawn Care, built for Kansas freeze-thaw. Outdoor living coordinated with planting so the project looks finished.",
}

export default function HardscapingPage() {
  const detail = getServiceDetail("hardscaping")!
  return <ServiceDetailView detail={detail} galleryCategory="Hardscape" />
}
