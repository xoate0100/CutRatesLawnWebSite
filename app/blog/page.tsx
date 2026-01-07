import { BlogList } from "@/components/blog-list"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog | Cut Rates Lawn Care",
  description: "Latest news, tips, and insights about lawn care and landscaping services.",
}

export default function BlogPage() {
  return (
    <main className="container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Lawn Care Blog</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Latest news, tips, and insights about lawn care and landscaping services.
        </p>
        <BlogList />
      </div>
    </main>
  )
}
