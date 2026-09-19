import { ServiceDetailView } from "@/components/blocks"
import { getServiceDetail } from "@/lib/marketing-content"

export const metadata = {
  title: "Power Washing — Driveways, Siding & Decks",
  description:
    "Cut Rates Lawn Care power washing in Wichita: driveways, siding, and decks restored so the house matches the lawn. Soft wash where the surface needs it.",
}

export default function PowerWashingPage() {
  const detail = getServiceDetail("power-washing")!
  return <ServiceDetailView detail={detail} />
}
