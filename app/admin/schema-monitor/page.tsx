import { Suspense } from "react"
// Import native components instead of Radix UI components
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs-native"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SchemaDocumentation from "@/components/admin/schema-documentation"
import SchemaErrorLog from "@/components/admin/schema-error-log"
import SchemaChangeHistory from "@/components/admin/schema-change-history"
import SchemaHealthCheck from "@/components/admin/schema-health-check"

export const metadata = {
  title: "Schema Monitor | Cut Rates Lawn Care Admin",
  description: "Monitor and manage Strapi schema compatibility",
}

export default function SchemaMonitorPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Schema Monitor</h1>
          <p className="text-gray-500 mt-1">Monitor and manage Strapi schema compatibility with frontend components</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="errors">Error Log</TabsTrigger>
          <TabsTrigger value="changes">Change History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Suspense fallback={<div>Loading health check...</div>}>
            <SchemaHealthCheck />
          </Suspense>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Schema Status</CardTitle>
                <CardDescription>Current status of content type schemas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Homepage</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Synced</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Services</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Synced</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Bundles</span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Warning</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Posts</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Synced</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Errors</CardTitle>
                <CardDescription>Schema-related errors in the last 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>heroSection.backgroundImage</span>
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">5 errors</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>bundles.features</span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">2 errors</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documentation">
          <SchemaDocumentation />
        </TabsContent>

        <TabsContent value="errors">
          <Suspense fallback={<div>Loading error log...</div>}>
            <SchemaErrorLog />
          </Suspense>
        </TabsContent>

        <TabsContent value="changes">
          <Suspense fallback={<div>Loading change history...</div>}>
            <SchemaChangeHistory />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
