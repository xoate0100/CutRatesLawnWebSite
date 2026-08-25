import Link from "next/link"
import { siteConfig } from "@/lib/site-config"
import { pageWrapProse } from "@/lib/layout"

export const metadata = {
  title: `Privacy Policy | ${siteConfig.name}`,
  description: "Privacy policy for Cut Rates Lawn Care.",
}

export default function PrivacyPage() {
  return (
    <div className="bg-paper">
      <div className={`${pageWrapProse} py-16`}>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-sage">Legal</p>
        <h1 className="font-display mt-2 text-4xl font-extrabold text-ink">Privacy Policy</h1>
        <p className="mt-3 text-sm text-sage">
          {/* TODO(attorney-review): Replace this shell with attorney-approved privacy policy text. */}
          Draft shell pending attorney review — not final legal advice.
        </p>
        <div className="mt-8 space-y-4 text-ink/85">
          <p>
            {siteConfig.name} (&quot;we&quot;, &quot;us&quot;) operates {siteConfig.url}. This page will describe how we
            collect, use, and protect personal information when you contact us, request a quote, or use our services.
          </p>
          <p>
            {/* TODO(attorney-review): Add categories of data collected, purposes, retention, sharing, cookies, rights, and contact for privacy requests. */}
            Until the full policy is published, contact us for privacy questions:
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
            <li>Address: {siteConfig.address.full}</li>
          </ul>
          <p>
            Customer account data for the online portal is handled by our portal provider (FieldPortals). See their
            policies for portal-specific processing.
          </p>
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
