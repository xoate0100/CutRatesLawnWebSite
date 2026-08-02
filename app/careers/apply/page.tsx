import Link from "next/link"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/site-config"

export const metadata = { title: `Apply | Careers | ${siteConfig.name}` }

export default function CareersApplyPage() {
  const mailto = `mailto:${siteConfig.email}?subject=${encodeURIComponent("Job application")}`
  return (
    <main className="container mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-4xl font-bold mb-4">Apply for a Position</h1>
      <p className="text-gray-700 mb-6">
        We do not host a full online application form yet. Email your resume and the role you are interested in, or call
        us to apply.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild>
          <a href={mailto}>Email {siteConfig.email}</a>
        </Button>
        <Button asChild variant="outline">
          <a href={`tel:${siteConfig.phone.e164}`}>Call {siteConfig.phone.display}</a>
        </Button>
        <Button asChild variant="outline">
          <Link href="/careers">Back to careers</Link>
        </Button>
      </div>
    </main>
  )
}
