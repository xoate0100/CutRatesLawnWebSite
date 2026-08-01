"use client"

import type React from "react"
import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon } from "lucide-react"
import Link from "next/link"

/** Curated in-repo index — not a CMS search API. */
const SITE_INDEX = [
  { title: "Home", url: "/", keywords: "home lawn" },
  { title: "Lawn Care", url: "/services/lawn-care", keywords: "mowing fertilization lawn" },
  { title: "Power Washing", url: "/services/power-washing", keywords: "wash pressure" },
  { title: "Pest Control", url: "/services/pest-control", keywords: "pest insects" },
  { title: "Gutter Cleaning", url: "/services/gutter-cleaning", keywords: "gutter" },
  { title: "Hardscaping", url: "/services/hardscaping", keywords: "patio hardscape" },
  { title: "Snow Removal", url: "/services/snow-removal", keywords: "snow winter" },
  { title: "Residential Services", url: "/services/residential", keywords: "home residential" },
  { title: "Commercial Services", url: "/services/commercial", keywords: "business commercial" },
  { title: "Landscaping", url: "/services/landscaping", keywords: "landscape plants" },
  { title: "Bundles", url: "/bundles", keywords: "subscription package" },
  { title: "Get a Quote", url: "/quote", keywords: "price estimate quote" },
  { title: "Schedule", url: "/schedule", keywords: "book appointment" },
  { title: "Contact", url: "/contact", keywords: "phone email" },
  { title: "About Us", url: "/about", keywords: "company team" },
  { title: "Our Work", url: "/our-work", keywords: "gallery portfolio" },
  { title: "FAQ", url: "/faq", keywords: "questions" },
  { title: "Careers", url: "/careers", keywords: "jobs hiring" },
  { title: "Privacy Policy", url: "/privacy", keywords: "privacy" },
  { title: "Customer Portal", url: "/portal", keywords: "login account" },
]

export function Search() {
  const [query, setQuery] = useState("")
  const [submitted, setSubmitted] = useState("")

  const results = useMemo(() => {
    const q = submitted.trim().toLowerCase()
    if (!q) return []
    return SITE_INDEX.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.keywords.includes(q) ||
        item.url.toLowerCase().includes(q),
    ).slice(0, 8)
  }, [submitted])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(query)
  }

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="search"
          placeholder="Search pages…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search site pages"
        />
        <Button type="submit">
          <SearchIcon className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </form>
      {submitted && (
        <div className="absolute top-full left-0 z-50 w-full bg-white shadow-md mt-1 rounded-md border">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-600">No matching pages. Try Contact or Services.</p>
          ) : (
            <ul className="py-2">
              {results.map((result) => (
                <li key={result.url}>
                  <Link
                    href={result.url}
                    className="block px-4 py-2 hover:bg-gray-100 text-sm"
                    onClick={() => {
                      setSubmitted("")
                      setQuery("")
                    }}
                  >
                    {result.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
