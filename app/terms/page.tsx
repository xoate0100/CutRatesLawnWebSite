import Link from "next/link"
import { siteConfig } from "@/lib/site-config"
import { pageWrapProse } from "@/lib/layout"

export const metadata = {
  title: `Terms of Service | ${siteConfig.name}`,
  description: "Terms of service for Cut Rates Lawn Care.",
}

export default function TermsPage() {
  return (
    <div className="bg-paper">
      <div className={`${pageWrapProse} py-16`}>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-sage">Legal</p>
        <h1 className="font-display mt-2 text-4xl font-extrabold text-ink">Terms of Service</h1>
        <p className="mt-3 text-sm text-sage">
          {/* TODO(attorney-review): Replace this shell with attorney-approved terms of service. */}
          Draft shell pending attorney review — not final legal advice.
        </p>
        <div className="mt-8 space-y-4 text-ink/85">
          <p>
            These terms will govern use of {siteConfig.url} and related service requests submitted to{" "}
            {siteConfig.name}.
          </p>
          <p>
            {/* TODO(attorney-review): Add acceptance, services description, payments, warranties/disclaimers, limitation of liability, governing law (Kansas), and dispute resolution. */}
            Until the full terms are published, service agreements are confirmed directly with our team:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              Phone:{" "}
              <a className="font-semibold text-green underline" href={`tel:${siteConfig.phone.e164}`}>
                {siteConfig.phone.display}
              </a>
            </li>
            <li>
              Email:{" "}
              <a className="font-semibold text-green underline" href={`mailto:${siteConfig.email}`}>
                {siteConfig.email}
              </a>
            </li>
          </ul>
        </div>
        <p className="mt-10">
          <Link href="/" className="font-bold text-green">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}
