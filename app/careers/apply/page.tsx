import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CareersApplyClient } from "@/components/careers/apply-client"
import { pageWrap } from "@/lib/layout"
import { siteConfig } from "@/lib/site-config"

export const metadata = {
  title: "Apply | Careers",
  description: `Short field-job application for ${siteConfig.name}. No account. No mandatory résumé for entry-level openings.`,
}

export default function CareersApplyPage() {
  return (
    <main className={`${pageWrap} max-w-2xl py-12 sm:py-16`}>
      <p className="text-xs font-bold uppercase tracking-wider text-green">Careers</p>
      <h1 className="font-display mt-2 text-3xl font-bold text-ink sm:text-4xl">Apply for a field role</h1>
      <p className="mt-3 text-sage">
        Enough information to decide the next step. Or{" "}
        <Link href="/careers#jobs" className="font-semibold text-forest underline">
          browse open jobs
        </Link>{" "}
        first.
      </p>
      <div className="mt-8">
        <Suspense fallback={<p className="text-sm text-sage">Loading application…</p>}>
          <CareersApplyClient />
        </Suspense>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
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
