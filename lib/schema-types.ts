/**
 * This file would be used by a build script to generate TypeScript types
 * from the Strapi schema. For now, we'll just define the interface.
 */

import { getStrapiURL } from "./api"

/**
 * Generate TypeScript types from Strapi schema
 * @param {string} outputPath Path to write the generated types
 * @returns {Promise<void>}
 */
export async function generateStrapiTypes(outputPath = "./types/strapi.ts") {
  try {
    // Fetch content types
    const response = await fetch(`${getStrapiURL("/api/content-types")}`, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
    })

    if (!response.ok) {
      console.error("Failed to fetch content types")
      return
    }

    const contentTypes = await response.json()

    // Generate TypeScript interfaces
    let typeDefinitions = `// Generated from Strapi schema on ${new Date().toISOString()}

export interface StrapiImage {
  data?: {
    id: number;
    attributes: {
      url: string;
      width: number;
      height: number;
      alternativeText?: string;
    };
  } | null;
}

export interface StrapiRelation<T> {
  data: Array<{
    id: number;
    attributes: T;
  }> | null;
}

export interface StrapiSingleRelation<T> {
  data: {
    id: number;
    attributes: T;
  } | null;
}

`

    // Add content type interfaces
    for (const contentType of contentTypes.data) {
      const typeName = contentType.attributes.displayName.replace(/\s/g, "")

      typeDefinitions += `export interface ${typeName}Attributes {
  // Add fields here based on the schema
  id: number;
  attributes: {
    // Fields would be generated here
  };
}

`
    }

    console.log("Generated type definitions:", typeDefinitions)

    // In a real implementation, this would write to a file
    // fs.writeFileSync(outputPath, typeDefinitions)

    return typeDefinitions
  } catch (error) {
    console.error("Error generating Strapi types:", error)
  }
}
