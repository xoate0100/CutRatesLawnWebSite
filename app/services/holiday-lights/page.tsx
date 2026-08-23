import { ServiceDetailView } from "@/components/blocks"
import { getServiceDetail } from "@/lib/marketing-content"

export const metadata = {
  title: "Holiday Lights",
  description:
    "Holiday light design, install, and take-down from Cut Rates Lawn Care — Nov through Jan.",
}

export default function HolidayLightsPage() {
  const detail = getServiceDetail("holiday-lights")!
  return <ServiceDetailView detail={detail} />
}
