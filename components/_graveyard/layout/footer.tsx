import Link from "next/link"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Cut Rates Lawn Care</h3>
            <p className="mb-4">Professional lawn care services for residential and commercial properties.</p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="hover:text-green-400" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" className="hover:text-green-400" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" className="hover:text-green-400" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="hover:text-green-400">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/bundles" className="hover:text-green-400">
                  Service Bundles
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-green-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-green-400">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-green-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services/residential" className="hover:text-green-400">
                  Residential Services
                </Link>
              </li>
              <li>
                <Link href="/services/commercial" className="hover:text-green-400">
                  Commercial Services
                </Link>
              </li>
              <li>
                <Link href="/services/lawn-care" className="hover:text-green-400">
                  Lawn Care
                </Link>
              </li>
              <li>
                <Link href="/services/landscaping" className="hover:text-green-400">
                  Landscaping
                </Link>
              </li>
              <li>
                <Link href="/services/pest-control" className="hover:text-green-400">
                  Pest Control
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                <a href="tel:+1234567890" className="hover:text-green-400">
                  (123) 456-7890
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                <a href="mailto:info@cutrateslawn.com" className="hover:text-green-400">
                  info@cutrateslawn.com
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-1" />
                <span>
                  123 Main Street
                  <br />
                  Valley Center, KS 67147
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {currentYear} Cut Rates Lawn Care LLC. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-6">
            <Link href="/privacy-policy" className="hover:text-green-400">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-green-400">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
