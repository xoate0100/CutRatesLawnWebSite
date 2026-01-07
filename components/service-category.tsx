import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface ServiceCategoryProps {
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  link: string
  linkText?: string
  reverse?: boolean
}

export function ServiceCategory({
  title,
  description,
  imageSrc,
  imageAlt,
  link,
  linkText = "Learn More",
  reverse = false,
}: ServiceCategoryProps) {
  return (
    <div className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} gap-8 items-center`}>
      <div className="md:w-1/2">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <div className="prose max-w-none mb-6">
          <p className="text-lg">{description}</p>
        </div>
        <Button asChild>
          <Link href={link}>
            {linkText} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="md:w-1/2 relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
        <Image src={imageSrc || "/placeholder.svg"} alt={imageAlt} fill className="object-cover" />
      </div>
    </div>
  )
}
