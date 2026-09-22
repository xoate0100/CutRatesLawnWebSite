import type { ReactNode } from "react"
import { Section } from "@/components/section"
import { ErrorMessage } from "@/components/error-message"

interface PageLayoutProps {
  children: ReactNode
  title: string
  description?: string
  error?: Error | null
  showHeader?: boolean
  headerClassName?: string
  contentClassName?: string
}

export function PageLayout({
  children,
  title,
  description,
  error,
  showHeader = true,
  headerClassName,
  contentClassName,
}: PageLayoutProps) {
  return (
    <main className="min-h-screen">
      {showHeader && (
        <Section background="primary" className={headerClassName}>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
            {description && <p className="text-xl max-w-3xl mx-auto">{description}</p>}
          </div>
        </Section>
      )}

      {error && (
        <Section background="white">
          <ErrorMessage
            title="Error Loading Content"
            message="We're having trouble loading this content. Please try again later."
            type="error"
          />
        </Section>
      )}

      <div className={contentClassName}>{children}</div>
    </main>
  )
}
