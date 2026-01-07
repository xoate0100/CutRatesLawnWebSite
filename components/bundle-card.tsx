import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Bundle } from "@/lib/interfaces"

interface BundleCardProps {
  bundle: Bundle
  className?: string
}

export function BundleCard({ bundle, className = "" }: BundleCardProps) {
  const { id, attributes } = bundle
  const { title, slug, shortDescription, price, priceUnit, featured, coverImage, services } = attributes

  // Safe price formatting with null check
  const formattedPrice = price !== undefined && price !== null ? `$${price.toFixed(2)}` : "Contact for pricing"

  const imageUrl = coverImage?.data?.attributes?.url || "/placeholder.svg?height=400&width=600&text=No+Image"
  const includedServices = services?.data || []

  return (
    <Card
      className={cn("overflow-hidden transition-all hover:shadow-md", featured ? "border-primary/50" : "", className)}
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform hover:scale-105"
        />
        {featured && <Badge className="absolute right-2 top-2 bg-primary">Featured</Badge>}
      </div>
      <CardContent className="p-4">
        <h3 className="text-xl font-bold tracking-tight">{title}</h3>
        <p className="mt-2 text-muted-foreground line-clamp-2">{shortDescription}</p>

        {includedServices.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Includes:</p>
            <ul className="space-y-1">
              {includedServices.slice(0, 3).map((service) => (
                <li key={service.id} className="flex items-center text-sm">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  {service.attributes.title}
                </li>
              ))}
              {includedServices.length > 3 && (
                <li className="text-sm text-muted-foreground">+{includedServices.length - 3} more services</li>
              )}
            </ul>
          </div>
        )}

        <div className="mt-4 flex items-center text-lg font-semibold">
          {formattedPrice}
          {priceUnit && <span className="ml-1 text-sm font-normal text-muted-foreground">{priceUnit}</span>}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/bundles/${slug}`}>
            View Package
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
