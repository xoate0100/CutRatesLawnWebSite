"use client"

import { useState, useEffect } from "react"
import { getContentTypeSchema, getFieldNamesFromSchema } from "@/lib/schema-validator"
import { schemaMonitor } from "@/lib/schema-monitor"

interface SchemaDocumentationProps {
  contentTypes?: string[]
}

export default function SchemaDocumentation({
  contentTypes = ["homepage", "services", "bundles", "posts"],
}: SchemaDocumentationProps) {
  const [activeTab, setActiveTab] = useState(contentTypes[0])
  const [schema, setSchema] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [errorStats, setErrorStats] = useState<any>({})

  useEffect(() => {
    async function fetchSchema() {
      setLoading(true)
      setError(null)

      try {
        const schemaData = await getContentTypeSchema(activeTab, true)
        setSchema(schemaData)

        // Get error statistics
        const stats = schemaMonitor.getErrorStats()
        setErrorStats(stats)
      } catch (err) {
        setError("Failed to fetch schema information")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchSchema()
  }, [activeTab])

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Strapi Schema Documentation</h1>

      <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-6">
        <div className="flex">
          <div className="py-1">
            <svg
              className="fill-current h-6 w-6 text-blue-500 mr-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
            </svg>
          </div>
          <div>
            <p className="font-bold">Schema Documentation</p>
            <p className="text-sm">
              This page documents the expected Strapi content structure for frontend components. Use this as a reference
              when making changes to content types in Strapi.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {contentTypes.map((type) => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === type
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p>Loading schema information...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      ) : (
        <SchemaDetails schema={schema} contentType={activeTab} errorStats={errorStats[activeTab] || {}} />
      )}
    </div>
  )
}

interface SchemaDetailsProps {
  schema: any
  contentType: string
  errorStats: Record<string, number>
}

function SchemaDetails({ schema, contentType, errorStats }: SchemaDetailsProps) {
  if (!schema) {
    return (
      <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
        <p className="font-bold">No Schema Available</p>
        <p>Could not retrieve schema information for {contentType}.</p>
      </div>
    )
  }

  const fieldNames = getFieldNamesFromSchema(schema)

  return (
    <div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Content Type: {schema.displayName}</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">API ID: {schema.apiID}</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <h3 className="text-lg font-semibold px-4 py-3">Fields</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 py-3">
            {fieldNames.map((fieldName) => {
              const field = schema.fields[fieldName]
              const hasErrors = errorStats[fieldName] && errorStats[fieldName] > 0

              return (
                <div
                  key={fieldName}
                  className={`border rounded-md p-3 ${hasErrors ? "border-red-500" : "border-gray-200"}`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{fieldName}</h4>
                    {hasErrors && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                        {errorStats[fieldName]} errors
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Type: {field.type}
                    {field.required && " (Required)"}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {Object.keys(errorStats).length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-bold">Schema Errors Detected</p>
          <p>
            There are schema compatibility issues with this content type. Please review the fields marked in red and
            ensure they match the expected structure.
          </p>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Frontend Usage</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">How this content type is used in the frontend</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="space-y-4">
            {contentType === "homepage" && (
              <>
                <p>The homepage content type is used on the main landing page and includes:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Hero section with title, description, and background image</li>
                  <li>Services overview section</li>
                  <li>Client segments section</li>
                  <li>Service bundles section</li>
                  <li>Reviews section</li>
                  <li>Call-to-action section</li>
                </ul>
              </>
            )}

            {contentType === "services" && (
              <>
                <p>The services content type is used on service pages and includes:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Service title, slug, and description</li>
                  <li>Detailed content (rich text)</li>
                  <li>Cover image and service image</li>
                  <li>Benefits list</li>
                  <li>FAQs</li>
                  <li>Related services</li>
                </ul>
              </>
            )}

            {contentType === "bundles" && (
              <>
                <p>The bundles content type is used on bundle pages and includes:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Bundle title, slug, and description</li>
                  <li>Price and period</li>
                  <li>Popular flag</li>
                  <li>Features list</li>
                  <li>Included services</li>
                </ul>
              </>
            )}

            {contentType === "posts" && (
              <>
                <p>The posts content type is used on blog pages and includes:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Post title, slug, and content</li>
                  <li>Excerpt</li>
                  <li>Published date</li>
                  <li>Cover image</li>
                  <li>Author information</li>
                  <li>Categories</li>
                  <li>Related posts</li>
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
