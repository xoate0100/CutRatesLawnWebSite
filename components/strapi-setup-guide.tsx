"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, Copy, ExternalLink } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function StrapiSetupGuide() {
  const [activeTab, setActiveTab] = useState("service-bundles")
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Strapi Content Type Setup Guide</CardTitle>
        <CardDescription>
          Follow these steps to set up the required content types in your Strapi admin panel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>API Endpoints Not Found</AlertTitle>
          <AlertDescription>
            Your frontend is looking for content that hasn't been created in Strapi yet. Follow this guide to set up the
            required content types.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="service-bundles" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="service-bundles">Service Bundles</TabsTrigger>
            <TabsTrigger value="customer-testimonials">Customer Testimonials</TabsTrigger>
          </TabsList>

          <TabsContent value="service-bundles" className="space-y-4">
            <h3 className="text-lg font-medium mt-4">1. Create Service Bundle Collection Type</h3>
            <p>Log into your Strapi admin panel and navigate to Content-Type Builder.</p>

            <div className="bg-muted p-4 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Collection Type: Service Bundle</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard("service-bundle", "bundle-name")}
                  className="h-8"
                >
                  {copied === "bundle-name" ? (
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  {copied === "bundle-name" ? "Copied" : "Copy"}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Make sure to use exactly this name to match your frontend code.
              </p>

              <h5 className="font-medium mb-2">Fields:</h5>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>title</strong> (Text) - Required
                </li>
                <li>
                  <strong>slug</strong> (UID, linked to title) - Required
                </li>
                <li>
                  <strong>shortDescription</strong> (Text)
                </li>
                <li>
                  <strong>description</strong> (Rich Text)
                </li>
                <li>
                  <strong>price</strong> (Number)
                </li>
                <li>
                  <strong>priceUnit</strong> (Text)
                </li>
                <li>
                  <strong>featured</strong> (Boolean)
                </li>
                <li>
                  <strong>coverImage</strong> (Media)
                </li>
                <li>
                  <strong>services</strong> (Relation to Services collection)
                </li>
              </ul>
            </div>

            <h3 className="text-lg font-medium mt-6">2. Set Permissions</h3>
            <p>{'Go to Settings > Roles > Public and enable "find" and "findOne" permissions for Service Bundles.'}</p>
          </TabsContent>

          <TabsContent value="customer-testimonials" className="space-y-4">
            <h3 className="text-lg font-medium mt-4">1. Create Customer Testimonial Collection Type</h3>
            <p>Log into your Strapi admin panel and navigate to Content-Type Builder.</p>

            <div className="bg-muted p-4 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Collection Type: Customer Testimonial</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard("customer-testimonial", "testimonial-name")}
                  className="h-8"
                >
                  {copied === "testimonial-name" ? (
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  {copied === "testimonial-name" ? "Copied" : "Copy"}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Make sure to use exactly this name to match your frontend code.
              </p>

              <h5 className="font-medium mb-2">Fields:</h5>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>name</strong> (Text) - Required
                </li>
                <li>
                  <strong>location</strong> (Text)
                </li>
                <li>
                  <strong>rating</strong> (Number, 1-5)
                </li>
                <li>
                  <strong>text</strong> (Text) - Required
                </li>
                <li>
                  <strong>image</strong> (Media)
                </li>
                <li>
                  <strong>service</strong> (Relation to Services collection)
                </li>
              </ul>
            </div>

            <h3 className="text-lg font-medium mt-6">2. Set Permissions</h3>
            <p>
              {'Go to Settings > Roles > Public and enable "find" and "findOne" permissions for Customer Testimonials.'}
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.history.back()}>
          Back to Site
        </Button>
        <Button onClick={() => window.open("/admin", "_blank")}>
          Go to Strapi Admin <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
