import { NextResponse } from "next/server"
import { getStrapiURL } from "@/lib/api"
import { getContentTypeSchema } from "@/lib/schema-validator"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Check if Strapi is reachable
    const strapiResponse = await fetch(`${getStrapiURL("/api/healthcheck")}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      next: { revalidate: 0 }, // Don't cache this request
    })

    if (!strapiResponse.ok) {
      return NextResponse.json(
        {
          status: "error",
          message: "Strapi API is not reachable",
          details: {
            statusCode: strapiResponse.status,
            statusText: strapiResponse.statusText,
          },
        },
        { status: 503 },
      )
    }

    // Check content type schemas
    const contentTypes = ["homepage", "services", "bundles", "posts"]
    const schemaResults = {}
    let hasSchemaErrors = false

    for (const contentType of contentTypes) {
      try {
        const schema = await getContentTypeSchema(contentType, true)

        if (!schema) {
          schemaResults[contentType] = {
            status: "error",
            message: "Could not fetch schema",
          }
          hasSchemaErrors = true
          continue
        }

        schemaResults[contentType] = {
          status: "ok",
          message: "Schema is valid",
          fieldCount: Object.keys(schema.fields).length,
        }
      } catch (error) {
        schemaResults[contentType] = {
          status: "error",
          message: `Error checking schema: ${error.message}`,
        }
        hasSchemaErrors = true
      }
    }

    // Return overall health status
    return NextResponse.json({
      status: hasSchemaErrors ? "warning" : "ok",
      timestamp: new Date().toISOString(),
      strapi: {
        status: "ok",
        url: process.env.STRAPI_API_URL,
      },
      schemas: schemaResults,
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: `Health check failed: ${error.message}`,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
