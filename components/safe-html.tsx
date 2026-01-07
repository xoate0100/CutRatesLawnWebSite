"use client"
import DOMPurify from "dompurify"

interface SafeHtmlProps {
  html: string
  className?: string
}

export function SafeHtml({ html, className }: SafeHtmlProps) {
  // Only use dangerouslySetInnerHTML with sanitized content
  const sanitizedHtml = DOMPurify.sanitize(html || "")

  return <div className={className} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
}
