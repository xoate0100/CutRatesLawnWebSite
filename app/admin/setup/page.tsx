import { StrapiSetupGuide } from "@/components/strapi-setup-guide"

export const metadata = {
  title: "Strapi Setup Guide | Cut Rates Lawn Care",
  description: "Setup guide for configuring Strapi content types for Cut Rates Lawn Care website",
}

export default function SetupPage() {
  return (
    <div className="container py-12">
      <StrapiSetupGuide />
    </div>
  )
}
