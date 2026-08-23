import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MediaFrame } from "@/components/media/media-frame"
import { InteriorHero, CTASection } from "@/components/blocks"
import { NewsletterSignup } from "@/components/newsletter-signup"

const blogPosts = [
  {
    id: 1,
    title: "10 Tips for a Lush, Green Lawn",
    excerpt: "Discover the secrets to maintaining a beautiful lawn all year round.",
    slot: "page.blog.1",
    date: "2023-05-15",
    author: "John Johnson",
    slug: "10-tips-for-lush-green-lawn",
  },
  {
    id: 2,
    title: "The Benefits of Professional Pest Control",
    excerpt: "Learn why professional pest control is crucial for your property's health.",
    slot: "page.blog.2",
    date: "2023-05-22",
    author: "Sarah Smith",
    slug: "benefits-of-professional-pest-control",
  },
  {
    id: 3,
    title: "Seasonal Lawn Care: What to Do in Spring",
    excerpt: "Prepare your lawn for the growing season with these essential spring tasks.",
    slot: "page.blog.3",
    date: "2023-05-29",
    author: "Mike Brown",
    slug: "seasonal-lawn-care-spring",
  },
]

export const metadata = {
  title: "Blog",
  description: "Lawn care tips and seasonal guides from Cut Rates Lawn Care.",
}

export default function BlogPage() {
  return (
    <div className="bg-paper">
      <InteriorHero
        eyebrow="Blog"
        title="Tips that keep yards looking sharp."
        description="Practical guides from a local crew — no fluff."
        mediaSlot="page.blog.1"
        ctaHref="/quote"
      />

      <section className="mx-auto w-[min(1200px,92vw)] py-[clamp(2.5rem,5vw,4.5rem)]">
        <ul className="grid gap-6 md:grid-cols-3">
          {blogPosts.map((post) => (
            <li
              key={post.id}
              className="overflow-hidden rounded-brand border border-line bg-white"
            >
              <MediaFrame slot={post.slot} aspect="16/10" className="rounded-none" />
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-sage">{post.date}</p>
                <h2 className="font-display mt-2 text-xl font-bold text-ink">
                  <Link href={`/blog/${post.slug}`} className="hover:text-green">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 text-sm text-sage">{post.excerpt}</p>
                <Button asChild variant="ghost" className="mt-3 px-0">
                  <Link href={`/blog/${post.slug}`}>
                    Read more <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-12 rounded-brand border border-line bg-cream p-6">
          <NewsletterSignup />
        </div>
      </section>

      <CTASection />
    </div>
  )
}
