import Link from "next/link"
import type { PostType } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { getSafeImageUrl } from "@/lib/image-utils"

interface BlogPostGridProps {
  posts: PostType[]
}

export function BlogPostGrid({ posts }: BlogPostGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <BlogPostCard key={post.id} post={post} />
      ))}
    </div>
  )
}

interface BlogPostCardProps {
  post: PostType
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const { title, slug, excerpt, publishedAt, coverImage, categories } = post.attributes

  return (
    <article className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <Link href={`/blog/${slug}`} className="block">
        <div className="relative h-48 overflow-hidden">
          <img
            src={getSafeImageUrl(coverImage) || "/placeholder.svg?height=300&width=400"}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            width={400}
            height={300}
          />

          {categories?.data && categories.data.length > 0 && (
            <div className="absolute top-4 left-4">
              <span className="inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                {categories.data[0].attributes.name}
              </span>
            </div>
          )}
        </div>

        <div className="p-5">
          <h2 className="text-xl font-bold mb-2 text-gray-900 line-clamp-2">{title}</h2>

          <div className="text-sm text-gray-600 mb-3">
            <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
          </div>

          <p className="text-gray-700 line-clamp-3 mb-4">{excerpt}</p>

          <div className="text-green-600 font-medium">Read more →</div>
        </div>
      </Link>
    </article>
  )
}
