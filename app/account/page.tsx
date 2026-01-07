import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { AccountDashboard } from "@/components/account/account-dashboard"

export const metadata: Metadata = {
  title: "My Account | Cut Rates Lawn Care",
  description: "Manage your Cut Rates Lawn Care account, view your services, and update your profile.",
}

export default async function AccountPage() {
  // Server-side authentication check
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login?redirect=/account")
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      <AccountDashboard user={user} />
    </div>
  )
}
