"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { X, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function AdminNotice() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [schemaIssues, setSchemaIssues] = useState<string[]>([])

  useEffect(() => {
    // Check if user is likely an admin (has seen this notice before)
    const dismissed = localStorage.getItem("admin-notice-dismissed")
    if (!dismissed) {
      setIsVisible(true)
    } else {
      setIsDismissed(true)
    }

    // Check for schema issues from localStorage
    try {
      const schemaCache = localStorage.getItem("strapi-schema-cache")
      if (schemaCache) {
        const schema = JSON.parse(schemaCache)
        const missingEndpoints = []

        // Check for missing critical endpoints
        if (!schema.endpoints.services || !schema.endpoints.services.includes("/api/")) {
          missingEndpoints.push("Services")
        }
        if (!schema.endpoints.bundles || !schema.endpoints.bundles.includes("/api/")) {
          missingEndpoints.push("Bundles")
        }
        if (!schema.endpoints.testimonials || !schema.endpoints.testimonials.includes("/api/")) {
          missingEndpoints.push("Testimonials")
        }

        setSchemaIssues(missingEndpoints)
      }
    } catch (e) {
      console.warn("Failed to check schema issues:", e)
    }
  }, [])

  const dismissNotice = () => {
    localStorage.setItem("admin-notice-dismissed", "true")
    setIsVisible(false)
    setIsDismissed(true)
  }

  if (!isVisible || schemaIssues.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Alert variant="destructive" className="pr-12 relative">
        <Database className="h-4 w-4" />
        <AlertTitle>Schema Issues Detected</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="mb-2">
            Your frontend is looking for content types that haven't been found in your Strapi backend:
          </p>
          <ul className="list-disc list-inside text-sm mb-3">
            {schemaIssues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
          <div className="flex gap-2 mt-4">
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/setup">Setup Guide</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/admin/schema">Schema Management</Link>
            </Button>
          </div>
        </AlertDescription>
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={dismissNotice}>
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </Button>
      </Alert>
    </div>
  )
}
