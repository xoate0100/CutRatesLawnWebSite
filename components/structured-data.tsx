import Head from "next/head"

interface StructuredDataProps {
  type: "Service" | "LocalBusiness" | "Organization"
  data: any
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  }

  return (
    <Head>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </Head>
  )
}

