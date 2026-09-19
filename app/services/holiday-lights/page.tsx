import { ServiceDetailView } from "@/components/blocks"
import { getServiceDetail } from "@/lib/marketing-content"

export const metadata = {
  title: "Holiday Lights — Design, Install & Take-down",
  description:
    "Book fall holiday lighting with Cut Rates Lawn Care. Roofline and trees designed, installed, and taken down — so you are not on a ladder in a Kansas freeze.",
}

export default function HolidayLightsPage() {
  const detail = getServiceDetail("holiday-lights")!
  return <ServiceDetailView detail={detail} />
}
