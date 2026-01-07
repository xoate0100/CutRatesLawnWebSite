import Image from "next/image"
import { Button } from "@/components/ui/button"
import { getSafeImageUrl } from "@/lib/image-utils"

export default function Hero({ data }) {
  console.log("Hero component rendering", data ? "with data" : "without data")

  if (!data) {
    console.log("No hero data provided")
    return (
      <div className="bg-yellow-100 p-8 text-center">
        <p>Hero component - No data available</p>
      </div>
    )
  }

  const { title, description, ctaText, ctaLink, image } = data
  console.log("Hero data:", { title, description, ctaText, ctaLink, hasImage: !!image })

  let imageUrl = "/placeholder.svg?height=600&width=800"
  try {
    imageUrl = image?.data?.attributes?.url ? getSafeImageUrl(image.data.attributes.url) : imageUrl
    console.log("Hero image URL:", imageUrl)
  } catch (error) {
    console.error("Error getting image URL:", error)
  }

  return (
    <section className="relative bg-gradient-to-b from-green-50 to-white py-16 md:py-24">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            {title || "Professional Lawn Care Services"}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            {description ||
              "Quality lawn maintenance at affordable rates. We keep your lawn looking its best year-round."}
          </p>
          <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md text-lg" asChild>
            <a href={ctaLink || "/contact"}>{ctaText || "Get a Free Quote"}</a>
          </Button>
        </div>
        <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-yellow-100 flex items-center justify-center">
            <p>Image container - If you see this, the Hero component is rendering</p>
          </div>
          {imageUrl ? (
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt="Beautiful lawn"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Image not available</span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
