import Link from "next/link"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/site-config"

type Props = {
  title: string
  summary: string
  bullets: string[]
}

export function ServiceLanding({ title, summary, bullets }: Props) {
  return (
    <main className="flex flex-col min-h-screen">
      <section className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-xl max-w-3xl">{summary}</p>
        </div>
      </section>
      <section className="py-16 container mx-auto px-4 max-w-3xl">
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-10">
          {bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link href="/schedule">Request a schedule</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Contact us</Link>
          </Button>
          <Button asChild variant="outline">
            <a href={`tel:${siteConfig.phone.e164}`}>Call {siteConfig.phone.display}</a>
          </Button>
        </div>
      </section>
    </main>
  )
}
