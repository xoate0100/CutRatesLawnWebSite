import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { mediaAlt, mediaSrc } from "@/lib/media"
import { NewsletterSignup } from "@/components/newsletter-signup"

const social = [
  // TODO(owner-approval): Confirm official social profile URLs before enabling.
  process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK_URL
    ? { href: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK_URL, label: "Facebook", Icon: Facebook }
    : null,
  process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL
    ? { href: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL, label: "Instagram", Icon: Instagram }
    : null,
].filter(Boolean) as { href: string; label: string; Icon: typeof Facebook }[]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="inline-block mb-6">
              <Image
                src={mediaSrc("header.logo")}
                alt={mediaAlt("header.logo", "Cut Rates Lawn Care")}
                width={180}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-gray-400 mb-6">
              Professional exterior property services for residential and commercial clients. Quality service at
              competitive rates.
            </p>
            {social.length > 0 && (
              <div className="flex space-x-4">
                {social.map(({ href, label, Icon }) => (
                  <a key={label} href={href} className="text-gray-400 hover:text-white" target="_blank" rel="noreferrer">
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{label}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/services" className="text-gray-400 hover:text-white">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/bundles" className="text-gray-400 hover:text-white">
                  Bundles & Subscriptions
                </Link>
              </li>
              <li>
                <Link href="/our-work" className="text-gray-400 hover:text-white">
                  Our Work
                </Link>
              </li>
              <li>
                <Link href="/quote" className="text-gray-400 hover:text-white">
                  Get a Quote
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href={siteConfig.customerPortalUrl}
                  className="text-gray-400 hover:text-white"
                >
                  Customer Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex">
                <MapPin className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-400">
                  {siteConfig.address.line1}
                  <br />
                  {siteConfig.address.cityStateZip}
                </span>
              </li>
              <li className="flex">
                <Phone className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <Link href={`tel:${siteConfig.phone.e164}`} className="text-gray-400 hover:text-white">
                  {siteConfig.phone.display}
                </Link>
              </li>
              <li className="flex">
                <Mail className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <Link href={`mailto:${siteConfig.email}`} className="text-gray-400 hover:text-white">
                  {siteConfig.email}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for seasonal tips, special offers, and more.
            </p>
            <NewsletterSignup variant="footer" />
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Cut Rates Lawn Care LLC. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-white text-sm">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

