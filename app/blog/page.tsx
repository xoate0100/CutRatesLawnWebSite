import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

// This would typically come from a CMS or API
const blogPosts = [
  {
    id: 1,
    title: "10 Tips for a Lush, Green Lawn",
    excerpt: "Discover the secrets to maintaining a beautiful lawn all year round.",
    image: "/placeholder.svg?height=200&width=400",
    date: "2023-05-15",
    author: "John Johnson",
    slug: "10-tips-for-lush-green-lawn",
  },
  {
    id: 2,
    title: "The Benefits of Professional Pest Control",
    excerpt: "Learn why professional pest control is crucial for your property's health.",
    image: "/placeholder.svg?height=200&width=400",
    date: "2023-05-22",
    author: "Sarah Smith",
    slug: "benefits-of-professional-pest-control",
  },
  {
    id: 3,
    title: "Seasonal Lawn Care: What to Do in Spring",
    excerpt: "Prepare your lawn for the growing season with these essential spring tasks.",
    image: "/placeholder.svg?height=200&width=400",
    date: "2023-05-29",
    author: "Mike Brown",
    slug: "seasonal-lawn-care-spring",
  },
]

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-green-600 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Lawn Care Blog</h1>
            <p className="text-xl mb-8 max-w-3xl">
              Expert tips, industry insights, and helpful guides to keep your property looking its best.
            </p>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Card key={post.id} className="flex flex-col">
                  <CardHeader>
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      width={400}
                      height={200}
                      className="rounded-t-lg"
                    />
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardTitle className="mb-2">{post.title}</CardTitle>
                    <CardDescription>{post.excerpt}</CardDescription>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      {new Date(post.date).toLocaleDateString()} by {post.author}
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <Button variant="outline" size="sm">
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
              <p className="mb-6">Get the latest lawn care tips and exclusive offers delivered to your inbox.</p>
              <form className="flex gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

