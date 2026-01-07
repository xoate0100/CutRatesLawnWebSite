import Link from "next/link"
import { Button } from "@/components/ui/button"
import { companyInfo } from "@/lib/static-data"
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter } from "lucide-react"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { IMAGES, getPlaceholderImage } from "@/lib/image-constants"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-6">
              <Link href="/" className="inline-block">
                <OptimizedImage
                  src={IMAGES.LOGO_WHITE || getPlaceholderImage(200, 80, "Cut Rates Lawn")}
                  alt="Cut Rates Lawn Care Logo"
                  width={180}
                  height={72}
                />
              </Link>
            </div>
            <p className="mb-4 text-gray-400">
              Professional lawn care services in Wichita and surrounding areas. Licensed, insured, and dedicated to
              making your lawn the envy of the neighborhood.
            </p>
            <div className="flex space-x-4">
              <a href={companyInfo.social.facebook} className="text-gray-400 hover:text-white" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href={companyInfo.social.instagram} className="text-gray-400 hover:text-white" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href={companyInfo.social.twitter} className="text-gray-400 hover:text-white" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="text-gray-400 hover:text-white">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/bundles" className="text-gray-400 hover:text-white">
                  Packages
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="text-gray-400 hover:text-white">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/quote" className="text-gray-400 hover:text-white">
                  Get a Quote
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-2 mt-0.5 text-green-500" />
                <a href={`tel:${companyInfo.phone.replace(/[^0-9]/g, "")}`} className="text-gray-400 hover:text-white">
                  {companyInfo.phone}
                </a>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-2 mt-0.5 text-green-500" />
                <a href={`mailto:${companyInfo.email}`} className="text-gray-400 hover:text-white">
                  {companyInfo.email}
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 text-green-500" />
                <address className="not-italic text-gray-400">{companyInfo.address}</address>
              </li>
              <li className="flex items-start">
                <Clock className="h-5 w-5 mr-2 mt-0.5 text-green-500" />
                <div className="text-gray-400">
                  <p>Mon-Fri: {companyInfo.hours.weekdays}</p>
                  <p>Sat: {companyInfo.hours.saturday}</p>
                  <p>Sun: {companyInfo.hours.sunday}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Service Areas</h3>
            <div className="grid grid-cols-2 gap-2">
              {companyInfo.serviceAreas.map((area, index) => (
                <div key={index} className="text-gray-400">
                  {area}
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
                <Link href="/quote">Request a Quote</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} {companyInfo.name}. All rights reserved.
          </p>
          <div className="mt-2 space-x-4">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
