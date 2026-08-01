import Link from "next/link"
import { siteConfig } from "@/lib/site-config"

export const metadata = {
  title: `Sitemap | ${siteConfig.name}`,
}

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/services/all", label: "All services" },
  { href: "/bundles", label: "Bundles" },
  { href: "/quote", label: "Quote" },
  { href: "/schedule", label: "Schedule" },
  { href: "/contact", label: "Contact" },
  { href: "/pricing", label: "Pricing" },
  { href: "/our-work", label: "Our work" },
  { href: "/faq", label: "FAQ" },
  { href: "/blog", label: "Blog" },
  { href: "/careers", label: "Careers" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/portal", label: "Customer portal" },
]

export default function HtmlSitemapPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Sitemap</h1>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-green-700 underline">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
