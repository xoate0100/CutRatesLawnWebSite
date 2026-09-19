import { ServiceDetailView } from "@/components/blocks"
import { getServiceDetail } from "@/lib/marketing-content"

export const metadata = {
  title: "Residential Packages — Yard and House, One Crew",
  description:
    "Home exterior care from Cut Rates Lawn Care. Start with mowing, add fertility, then gutters, lights, snow, and pest — month to month, no lock-in.",
}

export default function ResidentialPage() {
  const detail = getServiceDetail("residential")!
  return <ServiceDetailView detail={detail} galleryCategory="Lawn" />
}
