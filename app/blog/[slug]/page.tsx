import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import type { BlogPost } from "@/lib/types"
import { mediaSrc } from "@/lib/media"

// This would normally come from an API or CMS
const getBlogPost = async (slug: string): Promise<BlogPost | null> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock data
  const mockPosts: Record<string, BlogPost> = {
    "lawn-care-tips-summer": {
      id: "1",
      title: "Lawn Care Tips for Summer",
      slug: "lawn-care-tips-summer",
      excerpt: "Keep your lawn looking its best during the hot summer months with these essential tips.",
      content: `
        <p>Summer can be tough on your lawn. The combination of heat, drought, and increased foot traffic can stress even the healthiest grass. Here are some essential tips to keep your lawn looking its best during the hot summer months:</p>
        
        <h2>1. Water Deeply and Infrequently</h2>
        <p>Instead of frequent light watering, which encourages shallow root growth, water deeply but less often. This promotes deeper root growth, which helps your lawn better withstand drought conditions. Water early in the morning to minimize evaporation and fungal growth.</p>
        
        <h2>2. Mow High</h2>
        <p>Raise your mower blade in summer. Taller grass shades the soil, keeping it cooler and reducing water evaporation. It also develops deeper roots, making it more drought-resistant. Never remove more than one-third of the grass blade in a single mowing.</p>
        
        <h2>3. Keep Your Blades Sharp</h2>
        <p>Dull mower blades tear grass rather than cutting it cleanly, which stresses the grass and creates entry points for disease. Sharpen your mower blades at least once per season.</p>
        
        <h2>4. Practice Grasscycling</h2>
        <p>Leave grass clippings on the lawn after mowing. They break down quickly, returning valuable nutrients to the soil and reducing the need for fertilizer.</p>
        
        <h2>5. Limit Foot Traffic</h2>
        <p>Grass that's stressed by heat and drought is more susceptible to damage from foot traffic. Try to limit activities on your lawn during the hottest part of summer, especially during drought conditions.</p>
        
        <p>By following these simple tips, you can maintain a healthy, vibrant lawn throughout the summer months, even during periods of heat and drought.</p>
      `,
      featuredImage: mediaSrc("page.blog.post.hero"),
      publishedAt: "2023-06-15T10:00:00Z",
      author: {
        name: "John Smith",
        avatar: mediaSrc("page.blog.post.avatar"),
      },
      categories: ["Lawn Care", "Summer"],
    },
    "dealing-with-lawn-pests": {
      id: "2",
      title: "How to Deal with Common Lawn Pests",
      slug: "dealing-with-lawn-pests",
      excerpt: "Identify and treat common lawn pests before they cause significant damage.",
      content: `
        <p>Lawn pests can quickly turn your lush, green lawn into a patchy, brown mess. Early identification and treatment are key to preventing significant damage. Here's how to deal with some of the most common lawn pests:</p>
        
        <h2>1. Grubs</h2>
        <p>White grubs are the larvae of various beetles, including Japanese beetles and June bugs. They feed on grass roots, causing the turf to die in patches. Signs of grub damage include brown patches that can be easily pulled up like a carpet.</p>
        <p>Treatment: Apply beneficial nematodes or milky spore to the soil. For severe infestations, you may need to use a chemical grub control product.</p>
        
        <h2>2. Chinch Bugs</h2>
        <p>These small insects suck the sap from grass blades and inject a toxin that causes the grass to turn yellow and die. Damage typically appears as yellow patches that gradually enlarge, especially in sunny, dry areas.</p>
        <p>Treatment: Maintain proper lawn care practices, including regular watering and avoiding excessive nitrogen fertilizer. For severe infestations, insecticidal soap or pyrethrin-based insecticides can be effective.</p>
        
        <h2>3. Armyworms</h2>
        <p>These caterpillars can quickly defoliate large areas of turf. They feed primarily at night, so damage may appear suddenly. Look for ragged grass blades and small, green-brown caterpillars.</p>
        <p>Treatment: Bacillus thuringiensis (Bt) is an effective biological control. For severe infestations, insecticides containing spinosad or carbaryl may be necessary.</p>
        
        <h2>4. Moles</h2>
        <p>While moles don't directly damage grass, their tunneling can disrupt root systems and create unsightly mounds. Moles primarily feed on grubs and earthworms.</p>
        <p>Treatment: Reduce grub populations to eliminate their food source. Mole traps or repellents can also be effective.</p>
        
        <h2>5. Prevention Tips</h2>
        <ul>
          <li>Maintain a healthy lawn through proper watering, mowing, and fertilization</li>
          <li>Avoid overwatering, which can attract pests</li>
          <li>Regularly inspect your lawn for signs of damage</li>
          <li>Consider using organic pest control methods first</li>
          <li>Consult with a professional for severe or persistent infestations</li>
        </ul>
        
        <p>By staying vigilant and addressing pest problems early, you can maintain a healthy, beautiful lawn throughout the growing season.</p>
      `,
      featuredImage: mediaSrc("page.blog.post.hero"),
      publishedAt: "2023-05-22T14:30:00Z",
      author: {
        name: "Sarah Johnson",
        avatar: mediaSrc("page.blog.post.avatar"),
      },
      categories: ["Pest Control", "Lawn Care"],
    },
  }

  return mockPosts[slug] || null
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    return {
      title: "Blog Post Not Found",
      description: "The requested blog post could not be found.",
    }
  }

  return {
    title: `${post.title} | Cut Rates Lawn Care Blog`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  // Format date - would normally use the formatDate utility
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <main className="container py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/blog">
          <Button variant="ghost" className="mb-6 pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>

        <div className="flex flex-wrap gap-2 mb-4">
          {post.categories.map((category) => (
            <Badge key={category} variant="secondary">
              {category}
            </Badge>
          ))}
        </div>

        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex items-center gap-3 mb-8">
          <div className="relative h-10 w-10 rounded-full overflow-hidden">
            <Image
              src={post.author.avatar || mediaSrc("page.blog.post.avatar")}
              alt={post.author.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-medium">{post.author.name}</p>
            <p className="text-sm text-muted-foreground">{formattedDate}</p>
          </div>
        </div>

        <div className="relative h-[400px] w-full mb-8">
          <Image
            src={post.featuredImage || mediaSrc("page.blog.post.hero")}
            alt={post.title}
            fill
            className="object-cover rounded-lg"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>

        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </main>
  )
}
