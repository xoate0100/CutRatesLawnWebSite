import Link from "next/link"
import { Scissors, Droplets, Bug, Home, Shovel, Snowflake, ArrowRight } from "lucide-react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ServiceCardProps {
  title: string
  description: string
  icon: string
  link: string
}

export default function ServiceCard({ title, description, icon, link }: ServiceCardProps) {
  const getIcon = () => {
    switch (icon) {
      case "lawn":
        return <Scissors className="h-10 w-10 text-green-600" />
      case "power-washing":
        return <Droplets className="h-10 w-10 text-blue-600" />
      case "pest-control":
        return <Bug className="h-10 w-10 text-red-600" />
      case "gutter":
        return <Home className="h-10 w-10 text-orange-600" />
      case "hardscape":
        return <Shovel className="h-10 w-10 text-amber-600" />
      case "snow":
        return <Snowflake className="h-10 w-10 text-sky-600" />
      default:
        return <Scissors className="h-10 w-10 text-green-600" />
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="mb-4">{getIcon()}</div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto pt-4">
        <Link href={link} className="w-full">
          <Button variant="outline" className="w-full justify-between">
            Learn More <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

