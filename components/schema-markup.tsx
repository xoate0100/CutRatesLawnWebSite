import Head from "next/head"

interface SchemaMarkupProps {
  type: "Organization" | "LocalBusiness" | "Service" | "Review"
  data: any
}

export default function SchemaMarkup({ type, data }: SchemaMarkupProps) {
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

