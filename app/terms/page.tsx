import Link from "next/link"
import { siteConfig } from "@/lib/site-config"

export const metadata = {
  title: `Terms of Service | ${siteConfig.name}`,
  description: "Terms of service for Cut Rates Lawn Care.",
}

export default function TermsPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">
        {/* TODO(attorney-review): Replace this shell with attorney-approved terms of service. */}
        Draft shell pending attorney review — not final legal advice.
      </p>
      <div className="prose prose-gray max-w-none space-y-4 text-gray-700">
        <p>
          These terms will govern use of {siteConfig.url} and related service requests submitted to{" "}
          {siteConfig.name}.
        </p>
        <p>
          {/* TODO(attorney-review): Add acceptance, services description, payments, warranties/disclaimers, limitation of liability, governing law (Kansas), and dispute resolution. */}
          Until the full terms are published, service agreements are confirmed directly with our team:
        </p>
        <ul className="list-disc pl-6">
          <li>
            Phone:{" "}
            <a className="text-green-700 underline" href={`tel:${siteConfig.phone.e164}`}>
              {siteConfig.phone.display}
            </a>
          </li>
          <li>
            Email:{" "}
            <a className="text-green-700 underline" href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>
          </li>
        </ul>
      </div>
      <p className="mt-10">
        <Link href="/" className="text-green-700 underline">
          Back to home
        </Link>
      </p>
    </main>
  )
}
