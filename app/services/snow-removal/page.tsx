import { ServiceLanding } from "@/components/service-landing"

export const metadata = { title: "Snow Removal | Cut Rates Lawn Care" }

export default function SnowRemovalPage() {
  return (
    <ServiceLanding
      title="Snow Removal"
      summary="Seasonal snow clearing for driveways, walks, and commercial lots — confirm coverage and trigger depths with our team."
      bullets={[
        "Residential driveway and walk clearing",
        "Commercial lot options by agreement",
        "Seasonal contracts available",
        "Call for current season availability",
      ]}
    />
  )
}
