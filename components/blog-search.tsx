"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface BlogSearchProps {
  onSearch: (query: string) => void
}

export function BlogSearch({ onSearch }: BlogSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md mx-auto mb-8">
      <div className="flex items-center">
        <Input
          type="text"
          placeholder="Search blog posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
          aria-label="Search blog posts"
        />
        <Button type="submit" variant="ghost" size="icon" className="absolute right-0" aria-label="Search">
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}
