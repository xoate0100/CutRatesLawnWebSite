"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Gift, DollarSign, Users } from "lucide-react"
import CTASection from "@/components/cta-section"
import { siteConfig } from "@/lib/site-config"
import { toast } from "sonner"

export default function ReferralPage() {
  const [name, setName] = useState("")
  const referralUrl = useMemo(() => {
    const slug = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
    const code = slug || "friend"
    return `${siteConfig.url}/contact?ref=${encodeURIComponent(code)}`
  }, [name])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl)
      toast.success("Referral link copied")
    } catch {
      toast.error("Could not copy — select the link and copy manually")
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="bg-green-600 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Refer a Friend</h1>
            <p className="text-xl mb-8 max-w-3xl">
              {/* TODO(owner-approval): Confirm referral discount amounts ($50 / 20%) before advertising as policy. */}
              Share Cut Rates Lawn Care with neighbors. Rewards listed below are pending owner confirmation — ask us
              when you refer someone.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {[
                  {
                    icon: Users,
                    title: "Refer",
                    description: "Share your personal referral link with friends and family.",
                  },
                  {
                    icon: Gift,
                    title: "They Contact Us",
                    description:
                      "When they reach out through your link, mention your name so we can track the referral.",
                  },
                  {
                    icon: DollarSign,
                    title: "Ask About Rewards",
                    description:
                      "TODO(owner-approval): Published credit amounts require owner approval before we promise them.",
                  },
                ].map((step, index) => (
                  <Card key={index} className="text-center">
                    <CardHeader>
                      <step.icon className="h-12 w-12 mx-auto text-green-600 mb-4" />
                      <CardTitle>{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{step.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Your Referral Link</CardTitle>
                  <CardDescription>Enter your name to personalize the link, then copy it.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    placeholder="Your first name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-label="Name for referral code"
                  />
                  <div className="flex">
                    <Input value={referralUrl} readOnly className="flex-grow" aria-label="Referral link" />
                    <Button type="button" className="ml-2 bg-green-600 hover:bg-green-700" onClick={copy}>
                      Copy
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-gray-600">
                    Prefer email?{" "}
                    <a className="text-green-700 underline" href={`mailto:${siteConfig.email}`}>
                      {siteConfig.email}
                    </a>
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        <CTASection
          title="Ready to get started?"
          description="Contact us to set up service — and tell us who referred you."
          primaryButtonText="Contact us"
          primaryButtonLink="/contact"
          secondaryButtonText="Call now"
          secondaryButtonLink={`tel:${siteConfig.phone.e164}`}
        />
      </main>
    </div>
  )
}
