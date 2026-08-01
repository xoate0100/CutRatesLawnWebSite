import { redirect } from "next/navigation"
import { siteConfig } from "@/lib/site-config"

export default function CustomerPortalPage() {
  redirect(siteConfig.customerPortalUrl)
}
