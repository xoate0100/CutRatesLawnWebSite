"use client"

import { useEffect, useRef } from "react"
import Prism from "prismjs"
import "prismjs/themes/prism-tomorrow.css"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-css"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-tsx"
import "prismjs/components/prism-bash"

interface BlogContentProps {
  content: string
}

export function BlogContent({ content }: BlogContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Highlight code blocks
    if (contentRef.current) {
      Prism.highlightAllUnder(contentRef.current)
    }

    // Add target="_blank" to external links
    if (contentRef.current) {
      const links = contentRef.current.querySelectorAll("a")
      links.forEach((link) => {
        if (link.hostname !== window.location.hostname) {
          link.setAttribute("target", "_blank")
          link.setAttribute("rel", "noopener noreferrer")
        }
      })
    }
  }, [content])

  return (
    <div
      ref={contentRef}
      className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
