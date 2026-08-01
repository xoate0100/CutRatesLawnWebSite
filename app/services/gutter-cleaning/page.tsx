import { ServiceLanding } from "@/components/service-landing"

export const metadata = { title: "Gutter Cleaning | Cut Rates Lawn Care" }

export default function GutterCleaningPage() {
  return (
    <ServiceLanding
      title="Gutter Cleaning"
      summary="Keep water flowing away from your foundation with professional gutter cleaning and light debris removal."
      bullets={[
        "Clear leaves and debris from gutters and downspouts",
        "Basic flow check after cleaning",
        "Residential and light commercial properties",
        "Ask us about pairing with seasonal lawn packages",
      ]}
    />
  )
}
