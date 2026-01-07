"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { searchContent } from "../lib/api-client"

export function Search() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await searchContent(query)
      setResults(data.data || [])
    } catch (err) {
      setError("Failed to search. Please try again.")
      console.error("Search error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="search"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </form>

      {error && <div className="mt-4 p-2 bg-red-50 text-red-800 rounded-md text-sm">{error}</div>}

      {results.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Results</h3>
          <ul className="space-y-2">
            {results.map((result) => (
              <li key={result.id} className="p-3 bg-gray-50 rounded-md">
                <h4 className="font-medium">{result.attributes.title}</h4>
                {result.attributes.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {result.attributes.description.substring(0, 100)}
                    {result.attributes.description.length > 100 ? "..." : ""}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {query && !isLoading && results.length === 0 && (
        <div className="mt-4 p-2 bg-gray-50 rounded-md text-sm text-center">No results found for "{query}"</div>
      )}
    </div>
  )
}
