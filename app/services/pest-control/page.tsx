import { ServiceDetailView } from "@/components/blocks"
import { getServiceDetail } from "@/lib/marketing-content"

export const metadata = {
  title: "Pest Control — Termites, Rodents, Exclusions, Bed Bugs",
  description:
    "Cut Rates Lawn Care pest control in Wichita: termites, rodents, exclusions, trapping, and bed bugs — plus perimeter and mosquito programs.",
}

export default function PestControlPage() {
  const detail = getServiceDetail("pest-control")!
  return <ServiceDetailView detail={detail} />
}
