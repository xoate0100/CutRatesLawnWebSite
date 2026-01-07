"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AlertTriangle, Search, RefreshCw } from "lucide-react"
import { schemaMonitor } from "@/lib/schema-monitor"

// Import native components
import { Button } from "@/components/ui/button-native"

interface SchemaError {
  id: string
  timestamp: number
  contentType: string
  field: string
  error: string
  requestUrl: string
}

export default function SchemaErrorLog() {
  const [errors, setErrors] = useState<SchemaError[]>([])
  const [filteredErrors, setFilteredErrors] = useState<SchemaError[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  async function fetchErrors() {
    setLoading(true)

    try {
      // In a real implementation, this would fetch from an API or database
      // For now, we'll use the in-memory schema monitor
      const errorStats = schemaMonitor.getErrorStats()

      // Convert error stats to a list of errors
      const mockErrors: SchemaError[] = []

      // Add some mock errors for demonstration
      mockErrors.push({
        id: "1",
        timestamp: Date.now() - 1000 * 60 * 5, // 5 minutes ago
        contentType: "homepage",
        field: "heroSection.backgroundImage",
        error: "Invalid key backgroundImage at heroSection",
        requestUrl: "/api/homepage?populate=heroSection",
      })

      mockErrors.push({
        id: "2",
        timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
        contentType: "bundles",
        field: "features",
        error: "Invalid key features at bundles",
        requestUrl: "/api/bundles?populate=features",
      })

      mockErrors.push({
        id: "3",
        timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
        contentType: "services",
        field: "benefits",
        error: "Invalid key benefits at services",
        requestUrl: "/api/services?populate=benefits",
      })

      setErrors(mockErrors)
      setFilteredErrors(mockErrors)
    } catch (error) {
      console.error("Error fetching schema errors:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchErrors()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredErrors(errors)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredErrors(
        errors.filter(
          (error) =>
            error.contentType.toLowerCase().includes(query) ||
            error.field.toLowerCase().includes(query) ||
            error.error.toLowerCase().includes(query),
        ),
      )
    }
  }, [searchQuery, errors])

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Schema Error Log</CardTitle>
            <CardDescription>Recent schema-related errors from API requests</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchErrors} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search errors..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredErrors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertTriangle className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium">No errors found</h3>
            <p className="text-sm text-gray-500 mt-1">
              {searchQuery ? "Try a different search term" : "No schema errors have been recorded"}
            </p>
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Content Type</TableHead>
                  <TableHead>Field</TableHead>
                  <TableHead>Error</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredErrors.map((error) => (
                  <TableRow key={error.id}>
                    <TableCell className="whitespace-nowrap">{new Date(error.timestamp).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {error.contentType}
                      </Badge>
                    </TableCell>
                    <TableCell>{error.field}</TableCell>
                    <TableCell className="max-w-md truncate">{error.error}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
