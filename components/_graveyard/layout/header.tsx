"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SearchBar } from "@/components/search/search-bar"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
  }

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(path)
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-green-600">Cut Rates Lawn</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-gray-700 hover:text-green-600 ${isActive("/") ? "font-medium text-green-600" : ""}`}
            >
              Home
            </Link>
            <Link
              href="/services"
              className={`text-gray-700 hover:text-green-600 ${isActive("/services") ? "font-medium text-green-600" : ""}`}
            >
              Services
            </Link>
            <Link
              href="/bundles"
              className={`text-gray-700 hover:text-green-600 ${isActive("/bundles") ? "font-medium text-green-600" : ""}`}
            >
              Bundles
            </Link>
            <Link
              href="/blog"
              className={`text-gray-700 hover:text-green-600 ${isActive("/blog") ? "font-medium text-green-600" : ""}`}
            >
              Blog
            </Link>
            <Link
              href="/testimonials"
              className={`text-gray-700 hover:text-green-600 ${isActive("/testimonials") ? "font-medium text-green-600" : ""}`}
            >
              Testimonials
            </Link>
            <Link
              href="/contact"
              className={`text-gray-700 hover:text-green-600 ${isActive("/contact") ? "font-medium text-green-600" : ""}`}
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleSearch}
              className="text-gray-700 hover:text-green-600 focus:outline-none"
              aria-label="Search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <Link href="/login" className="text-gray-700 hover:text-green-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </Link>
            <Link
              href="/quote"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Get a Quote
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={toggleSearch}
              className="text-gray-700 hover:text-green-600 focus:outline-none"
              aria-label="Search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-green-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="py-4 border-t border-gray-100">
            <SearchBar placeholder="Search for services, blog posts, and more..." buttonText="Search" />
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-100">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className={`block px-4 py-2 rounded-md ${isActive("/") ? "bg-green-50 text-green-600 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className={`block px-4 py-2 rounded-md ${isActive("/services") ? "bg-green-50 text-green-600 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/bundles"
                  className={`block px-4 py-2 rounded-md ${isActive("/bundles") ? "bg-green-50 text-green-600 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Bundles
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className={`block px-4 py-2 rounded-md ${isActive("/blog") ? "bg-green-50 text-green-600 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/testimonials"
                  className={`block px-4 py-2 rounded-md ${isActive("/testimonials") ? "bg-green-50 text-green-600 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Testimonials
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className={`block px-4 py-2 rounded-md ${isActive("/contact") ? "bg-green-50 text-green-600 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className={`block px-4 py-2 rounded-md ${isActive("/login") ? "bg-green-50 text-green-600 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/quote"
                  className="block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get a Quote
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}
