import Link from "next/link"
import type { PostType } from "@/lib/types"
import { getSafeImageUrl } from "@/lib/image-utils"

interface BlogRelatedPostsProps {
  posts: PostType[]
}

export function BlogRelatedPosts({ posts }: BlogRelatedPostsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <article key={post.id} className="bg-white rounded-lg overflow-hidden shadow-md">
          <Link href={`/blog/${post.attributes.slug}`} className="block">
            <div className="relative h-40 overflow-hidden">
              <img
                src={getSafeImageUrl(post.attributes.coverImage) || "/placeholder.jpg?height=200&width=300"}
                alt={post.attributes.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                width={300}
                height={200}
              />
            </div>

            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{post.attributes.title}</h3>
              <p className="text-gray-700 text-sm line-clamp-2">{post.attributes.excerpt}</p>
            </div>
          </Link>
        </article>
      ))}
    </div>
  )
}
