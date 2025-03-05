import Link from "next/link"
import { CheckCircle, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface BundleCardProps {
  title: string
  price: string
  period: string
  description: string
  features: string[]
  popular: boolean
  link: string
}

export default function BundleCard({ title, price, period, description, features, popular, link }: BundleCardProps) {
  return (
    <Card className={`h-full flex flex-col relative ${popular ? "border-green-500 shadow-lg" : ""}`}>
      {popular && <Badge className="absolute top-4 right-4 bg-green-500">Most Popular</Badge>}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-6">
          <p className="text-3xl font-bold">
            {price === "Custom" ? "Custom" : `$${price}`}
            {period !== "quote" && <span className="text-lg font-normal text-gray-500">/{period}</span>}
          </p>
        </div>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="pt-4">
        <Link href={link} className="w-full">
          <Button
            className={`w-full ${popular ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
            variant={popular ? "default" : "outline"}
          >
            {price === "Custom" ? "Get Custom Quote" : "Subscribe Now"} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

