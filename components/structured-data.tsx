"use client"

import { useEffect, useState } from "react"
import { JsonLd, createLocalBusinessData, createServiceData } from "./json-ld"

interface StructuredDataProps {
  type: "localBusiness" | "service" | "bundle" | "faq"
  data: any
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const [structuredData, setStructuredData] = useState<any>(null)

  useEffect(() => {
    if (!data) return

    switch (type) {
      case "localBusiness":
        setStructuredData(createLocalBusinessData(data))
        break
      case "service":
        setStructuredData(createServiceData(data))
        break
      // Add more cases as needed
      default:
        setStructuredData(null)
    }
  }, [type, data])

  if (!structuredData) return null

  return <JsonLd data={structuredData} />
}
