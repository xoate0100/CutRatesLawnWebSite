"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RefreshCw, Search } from "lucide-react"
import { enhanceSchemaDiscovery, refreshSchemaCache } from "@/lib/schema-discovery"

export function SchemaRefresh() {
  const [contentType, setContentType] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      const success = await refreshSchemaCache()
      setResult({ message: success ? "Schema cache refreshed successfully" : "Failed to refresh schema cache" })
    } catch (error) {
      setResult({ error: (error as Error).message })
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleSearch = async () => {
    if (!contentType) return

    setIsSearching(true)
    try {
      const schemaInfo = await enhanceSchemaDiscovery(contentType)
      setResult(schemaInfo)
    } catch (error) {
      setResult({ error: (error as Error).message })
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Schema Discovery</CardTitle>
        <CardDescription>Explore content type schemas and refresh the schema cache</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Enter content type (e.g., service)"
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
          />
          <Button onClick={handleSearch} disabled={isSearching || !contentType}>
            {isSearching ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
            Explore
          </Button>
        </div>

        {result && (
          <div className="rounded-md bg-muted p-4">
            <pre className="text-xs overflow-auto max-h-96">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
          {isRefreshing ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Refresh Schema Cache
        </Button>
      </CardFooter>
    </Card>
  )
}
