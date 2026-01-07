import { SchemaConsole } from "@/components/dev/schema-console"

export const metadata = {
  title: "Schema Management",
  description: "Manage and debug Strapi schema integration",
}

export default function SchemaManagementPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Schema Management</h1>
      <p className="text-muted-foreground mb-8">
        This page helps you debug and manage the integration between your frontend and Strapi backend. Use it to
        identify schema mismatches, discover available endpoints, and validate your content structure.
      </p>

      <SchemaConsole />

      <div className="mt-10 space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">How Schema Discovery Works</h2>
          <p className="mb-4">
            Our enhanced schema discovery system automatically adapts to your Strapi backend structure by:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Discovering available content types and their endpoints</li>
            <li>Mapping field names between frontend expectations and backend reality</li>
            <li>Validating schema compatibility to catch issues early</li>
            <li>Providing intelligent fallbacks when content is missing</li>
            <li>Caching schema information for performance</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Troubleshooting</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Missing Endpoints</h3>
              <p>
                If endpoints are missing, ensure your Strapi instance has the corresponding content types created. Check
                the Setup Guide for instructions on creating the required content types.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Field Mismatches</h3>
              <p>If field names don't match between frontend and backend, you can either:</p>
              <ul className="list-disc list-inside ml-4">
                <li>Rename the fields in Strapi to match frontend expectations</li>
                <li>
                  Update the field mappings in <code>schema-discovery.ts</code>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Schema Validation Errors</h3>
              <p>
                Schema validation errors indicate that your frontend expects fields that don't exist in your backend.
                Review the validation results and ensure all required fields are present in your Strapi content types.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
