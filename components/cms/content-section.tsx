"use client"

import type React from "react"

import { useCMSData } from "@/lib/hooks/use-cms-data"
import { ErrorBoundary } from "@/components/error-boundary"

interface ContentSectionProps {
  contentType: string
  id?: string
  params?: Record<string, any>
  renderItem: (item: any) => React.ReactNode
  renderLoading?: () => React.ReactNode
  renderError?: (error: Error) => React.ReactNode
  renderEmpty?: () => React.ReactNode
}

/**
 * Component for displaying CMS content
 */
export function ContentSection({
  contentType,
  id,
  params,
  renderItem,
  renderLoading = () => <div>Loading...</div>,
  renderError = (error) => <div>Error: {error.message}</div>,
  renderEmpty = () => <div>No content found</div>,
}: ContentSectionProps) {
  const { data, isLoading, error } = useCMSData({
    contentType,
    id,
    params,
  })

  if (isLoading) {
    return renderLoading()
  }

  if (error) {
    return renderError(error)
  }

  if (!data) {
    return renderEmpty()
  }

  // Handle both single items and arrays
  if (Array.isArray(data)) {
    return (
      <div className="content-section">
        {data.length > 0
          ? data.map((item, index) => <ErrorBoundary key={item.id || index}>{renderItem(item)}</ErrorBoundary>)
          : renderEmpty()}
      </div>
    )
  }

  return (
    <div className="content-section">
      <ErrorBoundary>{renderItem(data)}</ErrorBoundary>
    </div>
  )
}
