import Link from "next/link"
import { siteConfig } from "@/lib/site-config"

export const metadata = {
  title: `Privacy Policy | ${siteConfig.name}`,
  description: "Privacy policy for Cut Rates Lawn Care.",
}

export default function PrivacyPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">
        {/* TODO(attorney-review): Replace this shell with attorney-approved privacy policy text. */}
        Draft shell pending attorney review — not final legal advice.
      </p>
      <div className="prose prose-gray max-w-none space-y-4 text-gray-700">
        <p>
          {siteConfig.name} (&quot;we&quot;, &quot;us&quot;) operates {siteConfig.url}. This page will describe how we
          collect, use, and protect personal information when you contact us, request a quote, or use our services.
        </p>
        <p>
          {/* TODO(attorney-review): Add categories of data collected, purposes, retention, sharing, cookies, rights, and contact for privacy requests. */}
          Until the full policy is published, contact us for privacy questions:
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
          <li>Address: {siteConfig.address.full}</li>
        </ul>
        <p>
          Customer account data for the online portal is handled by our portal provider (FieldPortals). See their
          policies for portal-specific processing.
        </p>
      </div>
      <p className="mt-10">
        <Link href="/" className="text-green-700 underline">
          Back to home
        </Link>
      </p>
    </main>
  )
}
