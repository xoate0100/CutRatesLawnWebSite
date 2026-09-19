import { redirect } from "next/navigation"
import { siteConfig } from "@/lib/site-config"

export const metadata = {
  title: "My Account",
  description: "Manage your Cut Rates Lawn Care account in the customer portal.",
  robots: { index: false, follow: false },
}

/** Account UI is FieldPortals — no local mock dashboard. */
export default function AccountPage() {
  redirect(siteConfig.customerPortalUrl)
}
