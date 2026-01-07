"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"

interface SearchBarProps {
  placeholder?: string
  buttonText?: string
  className?: string
  onSearch?: (query: string) => void
}

export function SearchBar({
  placeholder = "Search...",
  buttonText = "Search",
  className = "",
  onSearch,
}: SearchBarProps) {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (query.trim() === "") return

    if (onSearch) {
      onSearch(query)
    } else {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`flex w-full max-w-md ${className}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        aria-label="Search query"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded-r-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        {buttonText}
      </button>
    </form>
  )
}
