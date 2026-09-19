/**
 * Auth helpers — customer accounts live in FieldPortals.
 * Local mock login/register has been removed.
 */
import { siteConfig } from "@/lib/site-config"

export function getCustomerPortalUrl(): string {
  return siteConfig.customerPortalUrl
}

/** @deprecated Mock sessions removed — always null. */
export async function getCurrentUser(): Promise<null> {
  return null
}

export async function logoutUser(): Promise<boolean> {
  if (typeof window !== "undefined") {
    localStorage.removeItem("cut_rates_auth_token")
  }
  return true
}
