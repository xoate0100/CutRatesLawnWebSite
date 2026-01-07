import Link from "next/link"
import type { CategoryType, PostType } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { getSafeImageUrl } from "@/lib/image-utils"

interface BlogSidebarProps {
  categories?: CategoryType[]
  recentPosts?: PostType[]
  activeCategorySlug?: string
}

export function BlogSidebar({ categories, recentPosts, activeCategorySlug }: BlogSidebarProps) {
  return (
    <aside className="lg:w-1/4 space-y-8">
      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Search</h2>
        <form className="flex">
          <input
            type="text"
            placeholder="Search blog..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-r-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Search
          </button>
        </form>
      </div>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Categories</h2>
          <ul className="space-y-2">
            <li>
              <Link
                href="/blog"
                className={`block px-3 py-2 rounded-md ${
                  !activeCategorySlug ? "bg-green-100 text-green-800 font-medium" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                All Categories
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/blog?category=${category.attributes.slug}`}
                  className={`block px-3 py-2 rounded-md ${
                    activeCategorySlug === category.attributes.slug
                      ? "bg-green-100 text-green-800 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {category.attributes.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recent Posts */}
      {recentPosts && recentPosts.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Recent Posts</h2>
          <ul className="space-y-4">
            {recentPosts.map((post) => (
              <li key={post.id} className="flex gap-3">
                {post.attributes.coverImage && (
                  <Link href={`/blog/${post.attributes.slug}`} className="flex-shrink-0">
                    <img
                      src={getSafeImageUrl(post.attributes.coverImage, "thumbnail") || "/placeholder.svg"}
                      alt={post.attributes.title}
                      className="w-16 h-16 object-cover rounded"
                      width={64}
                      height={64}
                    />
                  </Link>
                )}
                <div>
                  <Link
                    href={`/blog/${post.attributes.slug}`}
                    className="font-medium text-gray-900 hover:text-green-600 line-clamp-2"
                  >
                    {post.attributes.title}
                  </Link>
                  <div className="text-xs text-gray-600 mt-1">{formatDate(post.attributes.publishedAt)}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Newsletter Signup */}
      <div className="bg-green-50 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-2">Subscribe to Our Newsletter</h2>
        <p className="text-gray-700 mb-4">Get the latest lawn care tips and special offers.</p>
        <form className="space-y-3">
          <input
            type="email"
            placeholder="Your email address"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Subscribe
          </button>
        </form>
      </div>
    </aside>
  )
}
