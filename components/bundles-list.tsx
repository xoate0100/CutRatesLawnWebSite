import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { bundles } from "@/lib/static-data"
import { CheckCircle, X } from "lucide-react"

interface BundlesListProps {
  featured?: boolean
  limit?: number
}

export function BundlesList({ featured = false, limit }: BundlesListProps) {
  // Filter bundles based on featured and limit
  const filteredBundles = bundles.data
    .filter((bundle) => !featured || bundle.attributes.featured)
    .slice(0, limit || bundles.data.length)

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {filteredBundles.map((bundle) => (
        <Card
          key={bundle.id}
          className={`overflow-hidden ${bundle.attributes.popular ? "border-green-500 border-2" : ""}`}
        >
          {bundle.attributes.popular && <div className="bg-green-500 text-white text-center py-1">Most Popular</div>}
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{bundle.attributes.title}</CardTitle>
                <CardDescription>{bundle.attributes.description}</CardDescription>
              </div>
              {bundle.attributes.discount && <Badge className="bg-red-500">Save {bundle.attributes.discount}%</Badge>}
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <span className="text-3xl font-bold text-green-600">${bundle.attributes.price}</span>
              <span className="text-sm text-gray-500 ml-1">{bundle.attributes.frequency}</span>
              {bundle.attributes.originalPrice && (
                <span className="text-sm text-gray-500 line-through ml-2">${bundle.attributes.originalPrice}</span>
              )}
            </div>

            <ul className="space-y-2">
              {bundle.attributes.services.map((service, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 shrink-0" />
                  <span>{service}</span>
                </li>
              ))}

              {bundle.attributes.notIncluded &&
                bundle.attributes.notIncluded.map((service, index) => (
                  <li key={index} className="flex items-start text-gray-500">
                    <X className="h-5 w-5 text-gray-400 mr-2 shrink-0" />
                    <span>{service}</span>
                  </li>
                ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href={`/bundles/${bundle.attributes.slug}`}>Choose This Package</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
