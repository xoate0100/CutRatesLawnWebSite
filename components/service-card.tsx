import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Service } from "@/lib/interfaces"

interface ServiceCardProps {
  service: Service
  featured?: boolean
  className?: string
}

export function ServiceCard({ service, featured = false, className = "" }: ServiceCardProps) {
  const { id, attributes } = service
  const { title, slug, shortDescription, price, priceUnit, coverImage } = attributes

  // Safe price formatting with null check
  const formattedPrice = price !== undefined && price !== null ? `$${price}` : "Contact for pricing"

  const imageUrl = coverImage?.data?.attributes?.url || "/placeholder.svg?height=400&width=600&text=Lawn+Care+Service"

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all hover:shadow-md group",
        featured ? "border-primary/50" : "",
        className,
      )}
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        {featured && (
          <div className="absolute right-2 top-2 flex items-center gap-1 bg-primary text-primary-foreground px-2 py-1 rounded-md text-sm font-medium">
            <Star className="h-3.5 w-3.5" />
            <span>Popular</span>
          </div>
        )}
      </div>
      <CardContent className="p-5">
        <h3 className="text-xl font-bold tracking-tight">{title}</h3>
        <p className="mt-2 text-muted-foreground line-clamp-2">{shortDescription}</p>
        <div className="mt-4 flex items-center text-lg font-semibold">
          {formattedPrice}
          {priceUnit && <span className="ml-1 text-sm font-normal text-muted-foreground">{priceUnit}</span>}
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0">
        <Button asChild className="w-full group-hover:bg-primary/90">
          <Link href={`/services/${slug}`} className="flex items-center justify-center">
            View Details
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
