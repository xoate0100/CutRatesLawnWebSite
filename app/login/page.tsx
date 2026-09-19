import { redirect } from "next/navigation"
import { siteConfig } from "@/lib/site-config"

export const metadata = {
  title: "Login",
  description: "Sign in to your Cut Rates Lawn Care customer portal.",
  robots: { index: false, follow: false },
}

/** Local mock auth removed — customer accounts are on FieldPortals. */
export default function LoginPage() {
  redirect(siteConfig.customerPortalUrl)
}
