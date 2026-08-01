import { redirect } from "next/navigation"
import { siteConfig } from "@/lib/site-config"

/** F-004 / F-018: Customer accounts live only in FieldPortals — no local mock dashboard. */
export default function DashboardPage() {
  redirect(siteConfig.customerPortalUrl)
}
