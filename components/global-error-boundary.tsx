"use client"

import type React from "react"

import { ErrorBoundary } from "./error-boundary"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

interface GlobalErrorBoundaryProps {
  children: React.ReactNode
}

export function GlobalErrorBoundary({ children }: GlobalErrorBoundaryProps) {
  const handleReset = () => {
    window.location.reload()
  }

  const fallback = (
    <div className="container mx-auto py-10 px-4">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertTriangle className="mr-2 h-6 w-6" />
            Something went wrong
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            We encountered an unexpected error. Our team has been notified and is working to fix the issue.
          </p>
          <div className="bg-gray-100 p-4 rounded-md">
            <p className="text-sm">You can try refreshing the page or navigating back to the home page.</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
          <Button onClick={handleReset}>Refresh Page</Button>
        </CardFooter>
      </Card>
    </div>
  )

  return <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>
}
