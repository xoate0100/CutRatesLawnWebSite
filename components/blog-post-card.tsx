import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, User } from "lucide-react"
import { getSafeImageUrl } from "@/lib/api"
import type { PostType } from "@/lib/api"
import { formatDate } from "@/lib/utils"

interface BlogPostCardProps {
  post: PostType
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const { title, slug, excerpt, publishedAt, coverImage, author } = post.attributes

  const imageUrl = getSafeImageUrl(coverImage, "/placeholder.svg?height=200&width=400")

  const formattedDate = formatDate(publishedAt)

  return (
    <Card className="flex flex-col h-full">
      <div className="relative h-48 w-full">
        <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover rounded-t-lg" />
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-2">{title}</CardTitle>
        <CardDescription className="flex items-center text-sm space-x-4">
          <span className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formattedDate}
          </span>
          {author && (
            <span className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              {author.data.attributes.name}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 line-clamp-3">{excerpt}</p>
      </CardContent>
      <CardFooter>
        <Link href={`/blog/${slug}`} className="w-full">
          <Button variant="outline" className="w-full justify-between">
            Read More <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
