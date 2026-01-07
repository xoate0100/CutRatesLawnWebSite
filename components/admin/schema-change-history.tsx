"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
// Import native Button component
import { Button } from "@/components/ui/button-native"
import { Input } from "@/components/ui/input"
import { Search, RefreshCw, Plus, Minus, Edit } from "lucide-react"

interface SchemaChange {
  id: string
  timestamp: number
  contentType: string
  field: string
  changeType: "added" | "removed" | "modified"
  user: string
}

export default function SchemaChangeHistory() {
  const [changes, setChanges] = useState<SchemaChange[]>([])
  const [filteredChanges, setFilteredChanges] = useState<SchemaChange[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  async function fetchChanges() {
    setLoading(true)

    try {
      // In a real implementation, this would fetch from an API or database
      // For now, we'll use mock data
      const mockChanges: SchemaChange[] = [
        {
          id: "1",
          timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
          contentType: "homepage",
          field: "heroSection.backgroundImage",
          changeType: "modified",
          user: "admin@example.com",
        },
        {
          id: "2",
          timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
          contentType: "bundles",
          field: "features",
          changeType: "added",
          user: "content@example.com",
        },
        {
          id: "3",
          timestamp: Date.now() - 1000 * 60 * 60 * 24 * 10, // 10 days ago
          contentType: "services",
          field: "oldField",
          changeType: "removed",
          user: "admin@example.com",
        },
      ]

      setChanges(mockChanges)
      setFilteredChanges(mockChanges)
    } catch (error) {
      console.error("Error fetching schema changes:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChanges()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredChanges(changes)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredChanges(
        changes.filter(
          (change) =>
            change.contentType.toLowerCase().includes(query) ||
            change.field.toLowerCase().includes(query) ||
            change.user.toLowerCase().includes(query),
        ),
      )
    }
  }, [searchQuery, changes])

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Schema Change History</CardTitle>
            <CardDescription>Track changes to content type schemas over time</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchChanges} disabled={loading}>
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
              placeholder="Search changes..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Content Type</TableHead>
                <TableHead>Field</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>User</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredChanges.map((change) => (
                <TableRow key={change.id}>
                  <TableCell className="whitespace-nowrap">{new Date(change.timestamp).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {change.contentType}
                    </Badge>
                  </TableCell>
                  <TableCell>{change.field}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {change.changeType === "added" && (
                        <>
                          <Plus className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-green-600">Added</span>
                        </>
                      )}
                      {change.changeType === "removed" && (
                        <>
                          <Minus className="h-4 w-4 text-red-500 mr-1" />
                          <span className="text-red-600">Removed</span>
                        </>
                      )}
                      {change.changeType === "modified" && (
                        <>
                          <Edit className="h-4 w-4 text-blue-500 mr-1" />
                          <span className="text-blue-600">Modified</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{change.user}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
