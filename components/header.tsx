"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { companyInfo } from "@/lib/static-data"
import { Menu, Phone, MapPin, Clock } from "lucide-react"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { IMAGES, getPlaceholderImage } from "@/lib/image-constants"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      setIsScrolled(window.scrollY > 10)
    })
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-white/80 backdrop-blur-sm py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <OptimizedImage
              src={IMAGES.LOGO || getPlaceholderImage(200, 80, "Cut Rates Lawn")}
              alt="Cut Rates Lawn Care Logo"
              width={150}
              height={60}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link href="/services" className="px-3 py-2 text-gray-700 hover:text-green-600 rounded-md">
              Services
            </Link>
            <Link href="/bundles" className="px-3 py-2 text-gray-700 hover:text-green-600 rounded-md">
              Packages
            </Link>
            <Link href="/about" className="px-3 py-2 text-gray-700 hover:text-green-600 rounded-md">
              About Us
            </Link>
            <Link href="/testimonials" className="px-3 py-2 text-gray-700 hover:text-green-600 rounded-md">
              Testimonials
            </Link>
            <Link href="/contact" className="px-3 py-2 text-gray-700 hover:text-green-600 rounded-md">
              Contact
            </Link>
          </nav>

          {/* Contact Info & CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center text-gray-700">
              <Phone className="h-4 w-4 mr-1" />
              <a href={`tel:${companyInfo.phone.replace(/[^0-9]/g, "")}`} className="hover:text-green-600">
                {companyInfo.phone}
              </a>
            </div>
            <Button asChild>
              <Link href="/quote">Get a Quote</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center">
            <a
              href={`tel:${companyInfo.phone.replace(/[^0-9]/g, "")}`}
              className="mr-4 p-2 text-green-600 hover:text-green-700"
            >
              <Phone className="h-5 w-5" />
            </a>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col h-full">
                  <div className="py-6">
                    <Image
                      src="/placeholder.svg?height=40&width=180&text=Cut+Rates+Lawn"
                      alt="Cut Rates Lawn Care"
                      width={180}
                      height={40}
                    />
                  </div>
                  <nav className="flex flex-col space-y-4">
                    <Link href="/" className="px-2 py-1 hover:text-green-600">
                      Home
                    </Link>
                    <Link href="/services" className="px-2 py-1 hover:text-green-600">
                      Services
                    </Link>
                    <Link href="/bundles" className="px-2 py-1 hover:text-green-600">
                      Packages
                    </Link>
                    <Link href="/about" className="px-2 py-1 hover:text-green-600">
                      About Us
                    </Link>
                    <Link href="/testimonials" className="px-2 py-1 hover:text-green-600">
                      Testimonials
                    </Link>
                    <Link href="/contact" className="px-2 py-1 hover:text-green-600">
                      Contact
                    </Link>
                  </nav>
                  <div className="mt-auto py-6 space-y-4">
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-green-600" />
                      <address className="not-italic">{companyInfo.address}</address>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-green-600" />
                      <div>
                        <p>Mon-Fri: {companyInfo.hours.weekdays}</p>
                        <p>Sat: {companyInfo.hours.saturday}</p>
                        <p>Sun: {companyInfo.hours.sunday}</p>
                      </div>
                    </div>
                    <Button className="w-full" asChild>
                      <Link href="/quote">Get a Free Quote</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
