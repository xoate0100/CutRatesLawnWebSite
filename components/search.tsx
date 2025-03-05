"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon } from "lucide-react"
import Link from "next/link"

// This is a mock function. In a real application, this would be an API call or server action.
const searchSite = async (query: string) => {
  // Mock search results
  const results = [
    { title: "Lawn Mowing Service", url: "/services/lawn-care" },
    { title: "Residential Bundles", url: "/bundles/residential" },
    { title: "About Us", url: "/about" },
  ].filter((item) => item.title.toLowerCase().includes(query.toLowerCase()))

  return results
}

export function Search() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Array<{ title: string; url: string }>>([])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const searchResults = await searchSite(query)
    setResults(searchResults)
  }

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
        <Input type="search" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <Button type="submit">
          <SearchIcon className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </form>
      {results.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md mt-1 rounded-md">
          <ul className="py-2">
            {results.map((result, index) => (
              <li key={index}>
                <Link href={result.url} className="block px-4 py-2 hover:bg-gray-100">
                  {result.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

