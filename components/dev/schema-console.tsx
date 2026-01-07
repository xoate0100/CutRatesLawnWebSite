"use client"

import { useState, useEffect } from "react"
import { refreshSchema, clearCache } from "@/lib/smart-api"
import { discoverStrapiSchema, validateSchema } from "@/lib/schema-discovery"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, RefreshCw, Trash2, Database } from "lucide-react"

export function SchemaConsole() {
  const [schema, setSchema] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("endpoints")
  const [validationResults, setValidationResults] = useState<any>({})

  // Expected fields for each content type
  const expectedFields = {
    services: ["title", "slug", "description", "shortDescription", "price", "priceUnit", "coverImage", "icon"],
    bundles: ["title", "slug", "description", "shortDescription", "price", "priceUnit", "coverImage", "services"],
    testimonials: ["name", "text", "rating", "service", "image", "location"],
  }

  useEffect(() => {
    loadSchema()
  }, [])

  async function loadSchema() {
    setLoading(true)
    try {
      const result = await discoverStrapiSchema()
      setSchema(result)

      // Validate schema for each content type
      const validations: any = {}
      Object.entries(expectedFields).forEach(([contentType, fields]) => {
        validations[contentType] = validateSchema(contentType, fields)
      })
      setValidationResults(validations)
    } catch (error) {
      console.error("Error loading schema:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleRefresh() {
    setLoading(true)
    try {
      await refreshSchema()
      await loadSchema()
    } catch (error) {
      console.error("Error refreshing schema:", error)
    } finally {
      setLoading(false)
    }
  }

  function handleClearCache() {
    clearCache()
  }

  if (!schema) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Schema Console</CardTitle>
          <CardDescription>Loading schema information...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Schema Console</CardTitle>
            <CardDescription>Debug and manage Strapi schema integration</CardDescription>
          </div>
          <Badge variant={schema.success ? "success" : "destructive"}>
            {schema.success ? "Connected" : "Disconnected"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
            <TabsTrigger value="contentTypes">Content Types</TabsTrigger>
          </TabsList>

          <TabsContent value="endpoints" className="space-y-4">
            <div className="rounded-md border">
              <div className="bg-muted px-4 py-2 font-medium">Discovered Endpoints</div>
              <div className="p-4 space-y-2">
                {Object.entries(schema.endpoints).map(([key, endpoint]) => (
                  <div key={key} className="flex justify-between items-center py-1 border-b last:border-0">
                    <div className="font-medium">{key}</div>
                    <div className="text-sm text-muted-foreground font-mono">{endpoint}</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="validation" className="space-y-4">
            <div className="rounded-md border">
              <div className="bg-muted px-4 py-2 font-medium">Schema Validation Results</div>
              <div className="p-4 space-y-4">
                {Object.entries(validationResults).map(([contentType, result]: [string, any]) => (
                  <div key={contentType} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium">{contentType}</h3>
                      {result.valid ? (
                        <Badge variant="success" className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Valid
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Issues Found
                        </Badge>
                      )}
                    </div>

                    {result.missing.length > 0 && (
                      <div className="ml-4 space-y-1">
                        <div className="text-sm font-medium text-destructive">Missing Fields:</div>
                        <ul className="list-disc list-inside text-sm">
                          {result.missing.map((field: string) => (
                            <li key={field}>{field}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {result.mismatched.length > 0 && (
                      <div className="ml-4 space-y-1">
                        <div className="text-sm font-medium text-amber-500">Field Name Mismatches:</div>
                        <ul className="list-disc list-inside text-sm">
                          {result.mismatched.map((item: any) => (
                            <li key={item.expected}>
                              Expected <span className="font-mono">{item.expected}</span> but found{" "}
                              <span className="font-mono">{item.actual}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contentTypes" className="space-y-4">
            <div className="rounded-md border">
              <div className="bg-muted px-4 py-2 font-medium">Content Type Details</div>
              <div className="p-4 space-y-4">
                {Object.entries(schema.contentTypes).length > 0 ? (
                  Object.entries(schema.contentTypes).map(([key, contentType]: [string, any]) => (
                    <div key={key} className="space-y-2 pb-4 border-b last:border-0">
                      <h3 className="text-lg font-medium">{contentType.displayName}</h3>
                      <div className="text-sm text-muted-foreground">
                        <div>
                          API ID: <span className="font-mono">{contentType.apiID}</span>
                        </div>
                        <div>
                          Endpoint: <span className="font-mono">{contentType.endpoint}</span>
                        </div>
                      </div>

                      <div className="mt-2">
                        <div className="text-sm font-medium">Fields:</div>
                        <div className="grid grid-cols-3 gap-2 mt-1">
                          {contentType.fields.map((field: any) => (
                            <div key={field.name} className="text-xs p-1 border rounded">
                              <span className="font-mono">{field.name}</span>
                              <span className="text-muted-foreground ml-1">({field.type})</span>
                              {field.required && <span className="text-destructive ml-1">*</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Database className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No content type details available</p>
                    <p className="text-sm mt-2">This usually means the schema discovery API is not accessible</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleClearCache} disabled={loading}>
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Cache
        </Button>
        <Button onClick={handleRefresh} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh Schema
        </Button>
      </CardFooter>
    </Card>
  )
}
