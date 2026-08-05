import { Suspense } from "react"
import { QuoteFunnel } from "@/components/quote/quote-funnel"
import { siteConfig } from "@/lib/site-config"

export default function QuotePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
        <section className="bg-primary py-16 text-primary-foreground">
          <div className="container mx-auto px-4">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">Get a Quote</h1>
            <p className="mb-4 max-w-3xl text-xl">
              See a planning estimate in seconds, then send your details so our team can confirm pricing and schedule.
            </p>
            <p className="text-sm text-primary-foreground/85">
              Prefer to talk now?{" "}
              <a className="underline" href={`tel:${siteConfig.phone.e164}`}>
                Call {siteConfig.phone.display}
              </a>
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <Suspense fallback={<p className="text-center text-muted-foreground">Loading quote form…</p>}>
              <QuoteFunnel />
            </Suspense>
          </div>
        </section>
      </main>
    </div>
  )
}
