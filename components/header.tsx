"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown, Phone, Calendar } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    if (isMenuOpen) {
      setActiveDropdown(null)
    }
  }

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown)
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/placeholder.svg?height=40&width=180"
              alt="Cut Rates Lawn Care"
              width={180}
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {/* Services Dropdown */}
            <div className="relative group">
              <button
                onClick={() => toggleDropdown("services")}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
              >
                Services <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div
                className={`absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 ${activeDropdown === "services" ? "opacity-100 visible" : "opacity-0 invisible"}`}
              >
                <div className="py-1">
                  <Link
                    href="/services/residential"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Residential Services
                  </Link>
                  <Link href="/services/commercial" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Commercial Services
                  </Link>
                  <Link href="/services/lawn-care" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Lawn Care
                  </Link>
                  <Link
                    href="/services/power-washing"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Power Washing
                  </Link>
                  <Link
                    href="/services/pest-control"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Pest Control
                  </Link>
                  <Link
                    href="/services/all"
                    className="block px-4 py-2 text-sm font-medium text-green-600 hover:bg-gray-100"
                  >
                    View All Services
                  </Link>
                </div>
              </div>
            </div>

            {/* Bundles Dropdown */}
            <div className="relative group">
              <button
                onClick={() => toggleDropdown("bundles")}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
              >
                Bundles & Subscriptions <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div
                className={`absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 ${activeDropdown === "bundles" ? "opacity-100 visible" : "opacity-0 invisible"}`}
              >
                <div className="py-1">
                  <Link href="/bundles/residential" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Residential Bundles
                  </Link>
                  <Link href="/bundles/commercial" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Commercial Bundles
                  </Link>
                  <Link href="/bundles/seasonal" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Seasonal Packages
                  </Link>
                  <Link
                    href="/bundles/all"
                    className="block px-4 py-2 text-sm font-medium text-green-600 hover:bg-gray-100"
                  >
                    View All Bundles
                  </Link>
                </div>
              </div>
            </div>

            <Link
              href="/about"
              className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
            >
              About Us
            </Link>
            <Link
              href="/careers"
              className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
            >
              Careers
            </Link>
            <Link
              href="/contact"
              className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
            >
              Contact
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/contact" className="flex items-center text-sm font-medium text-gray-700">
              <Phone className="mr-2 h-4 w-4 text-green-600" />
              (555) 123-4567
            </Link>
            <Link href="/schedule">
              <Button className="bg-green-600 hover:bg-green-700">
                Schedule Service <Calendar className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
          <button
            onClick={() => toggleDropdown("mobileServices")}
            className="w-full flex justify-between items-center px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
          >
            Services{" "}
            <ChevronDown
              className={`ml-1 h-4 w-4 transition-transform ${activeDropdown === "mobileServices" ? "rotate-180" : ""}`}
            />
          </button>
          {activeDropdown === "mobileServices" && (
            <div className="pl-4 space-y-1">
              <Link
                href="/services/residential"
                className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100"
              >
                Residential Services
              </Link>
              <Link
                href="/services/commercial"
                className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100"
              >
                Commercial Services
              </Link>
              <Link
                href="/services/all"
                className="block px-3 py-2 text-base font-medium text-green-600 rounded-md hover:bg-gray-100"
              >
                View All Services
              </Link>
            </div>
          )}

          <button
            onClick={() => toggleDropdown("mobileBundles")}
            className="w-full flex justify-between items-center px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
          >
            Bundles & Subscriptions{" "}
            <ChevronDown
              className={`ml-1 h-4 w-4 transition-transform ${activeDropdown === "mobileBundles" ? "rotate-180" : ""}`}
            />
          </button>
          {activeDropdown === "mobileBundles" && (
            <div className="pl-4 space-y-1">
              <Link
                href="/bundles/residential"
                className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100"
              >
                Residential Bundles
              </Link>
              <Link
                href="/bundles/commercial"
                className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100"
              >
                Commercial Bundles
              </Link>
              <Link
                href="/bundles/all"
                className="block px-3 py-2 text-base font-medium text-green-600 rounded-md hover:bg-gray-100"
              >
                View All Bundles
              </Link>
            </div>
          )}

          <Link
            href="/about"
            className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
          >
            About Us
          </Link>
          <Link
            href="/careers"
            className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
          >
            Careers
          </Link>
          <Link
            href="/contact"
            className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
          >
            Contact
          </Link>

          <div className="pt-4 pb-3 border-t border-gray-200">
            <Link href="/contact" className="flex items-center px-3 py-2 text-base font-medium text-gray-700">
              <Phone className="mr-2 h-5 w-5 text-green-600" />
              (555) 123-4567
            </Link>
            <div className="mt-3 px-3">
              <Link href="/schedule" className="w-full">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Schedule Service <Calendar className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

