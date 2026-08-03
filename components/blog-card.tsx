import Link from "next/link"
import Image from "next/image"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { BlogPost } from "@/lib/types"

interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  const { title, slug, excerpt, featuredImage, publishedAt, author, categories } = post

  // Use the global formatDate function if available, otherwise use a fallback
  const formattedDate =
    typeof window !== "undefined" && window.formatDate
      ? window.formatDate(publishedAt)
      : new Date(publishedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })

  // Use the global getSafeImageUrl function if available, otherwise use a fallback
  const safeImageUrl =
    typeof window !== "undefined" && window.getSafeImageUrl
      ? window.getSafeImageUrl(featuredImage, "/placeholder.jpg?height=300&width=400")
      : featuredImage || "/placeholder.jpg?height=300&width=400"

  const safeAvatarUrl =
    typeof window !== "undefined" && window.getSafeImageUrl
      ? window.getSafeImageUrl(author.avatar, "/placeholder.jpg?height=50&width=50")
      : author.avatar || "/placeholder.jpg?height=50&width=50"

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48 w-full">
        <Image
          src={safeImageUrl || "/placeholder.jpg"}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardHeader className="flex-grow">
        <div className="flex flex-wrap gap-2 mb-2">
          {categories.map((category) => (
            <Badge key={category} variant="secondary">
              {category}
            </Badge>
          ))}
        </div>
        <Link href={`/blog/${slug}`} className="hover:underline">
          <h3 className="text-xl font-semibold">{title}</h3>
        </Link>
        <p className="text-muted-foreground mt-2">{excerpt}</p>
      </CardHeader>
      <CardFooter className="border-t pt-4">
        <div className="flex items-center gap-3">
          <div className="relative h-8 w-8 rounded-full overflow-hidden">
            <Image src={safeAvatarUrl || "/placeholder.jpg"} alt={author.name} fill className="object-cover" />
          </div>
          <div>
            <p className="text-sm font-medium">{author.name}</p>
            <p className="text-xs text-muted-foreground">{formattedDate}</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
