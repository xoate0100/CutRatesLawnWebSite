import { ServiceLanding } from "@/components/service-landing"

export const metadata = { title: "Hardscaping | Cut Rates Lawn Care" }

export default function HardscapingPage() {
  return (
    <ServiceLanding
      title="Hardscaping"
      summary="Patios, walkways, and outdoor hardscape features that complement your lawn and landscape."
      bullets={[
        "Consultation on layout and materials",
        "Walkways, patio pads, and related hardscape installs",
        "Coordination with lawn and landscape services",
        "Custom quotes based on site conditions",
      ]}
    />
  )
}
