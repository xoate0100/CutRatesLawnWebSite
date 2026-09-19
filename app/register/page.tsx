import { redirect } from "next/navigation"
import { siteConfig } from "@/lib/site-config"

export const metadata = {
  title: "Register",
  description: "Create a Cut Rates Lawn Care customer portal account.",
  robots: { index: false, follow: false },
}

/** Local mock registration removed — use FieldPortals. */
export default function RegisterPage() {
  redirect(siteConfig.customerPortalUrl)
}
