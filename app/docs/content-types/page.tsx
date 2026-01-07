import Link from "next/link"

export default function ContentTypesDocPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Content Type Integration</h1>
      <p className="text-gray-600 mb-8">Documentation for integrating with Strapi content types in the frontend</p>

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
            <p className="font-bold">Important</p>
            <p className="text-sm">
              Always validate your code against the current Strapi schema before deploying changes. Run{" "}
              <code className="bg-gray-100 px-1 py-0.5 rounded">npm run sync-schema</code> to check compatibility.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {["homepage", "services", "bundles", "posts"].map((type) => (
              <a
                key={type}
                href={`#${type}`}
                className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div id="homepage" className="mb-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Homepage Content Type</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              The homepage content type is used for the main landing page
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">heroSection</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <p>The hero section at the top of the homepage</p>
                  <pre className="mt-2 bg-gray-50 p-4 rounded-md text-xs overflow-auto">
                    {`{
  title: string;
  description: string;
  backgroundImage: StrapiImage;
  primaryCTA: { text: string; link: string };
  secondaryCTA: { text: string; link: string };
}`}
                  </pre>
                  <div className="mt-2 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
                    <p className="font-bold">Field Name Variations</p>
                    <p className="text-sm">
                      The frontend code handles multiple field name variations for the background image:{" "}
                      <code className="bg-gray-100 px-1 py-0.5 rounded">backgroundImage, image, heroImage</code>
                    </p>
                  </div>
                </dd>
              </div>

              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">services</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <p>The services overview section</p>
                  <pre className="mt-2 bg-gray-50 p-4 rounded-md text-xs overflow-auto">
                    {`{
  title: string;
  description: string;
  items: Array<{
    title: string;
    description: string;
    icon: string;
    link: string;
  }>;
}`}
                  </pre>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div id="services" className="mb-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Services Content Type</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">The services content type is used for service pages</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <pre className="bg-gray-50 p-4 rounded-md text-xs overflow-auto">
              {`{
  title: string;
  slug: string;
  description: string;
  content?: string;
  coverImage?: StrapiImage;
  serviceImage?: StrapiImage;
  benefits?: Array<{ text: string }>;
  faqs?: Array<{ question: string; answer: string }>;
  relatedServices?: { data: ServiceType[] };
}`}
            </pre>

            <h3 className="text-md font-medium text-gray-900 mt-6 mb-2">Example Usage</h3>
            <pre className="bg-gray-50 p-4 rounded-md text-xs overflow-auto">
              {`import { getServiceBySlug } from "@/lib/api"

export default async function ServicePage({ params }) {
  const service = await getServiceBySlug(params.slug)
  
  if (!service) {
    return <div>Service not found</div>
  }
  
  const { title, description, content, benefits } = service.attributes
  
  // Render the page...
}`}
            </pre>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Best Practices</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Defensive Programming</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <ul className="list-disc pl-5 space-y-2">
                <li>Always use optional chaining when accessing nested properties</li>
                <li>Provide fallback values for required fields</li>
                <li>
                  Use the <code className="bg-gray-100 px-1 py-0.5 rounded">getSafeImageUrl</code> helper for images
                </li>
                <li>Handle empty arrays with default values or conditional rendering</li>
              </ul>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Schema Changes</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <ul className="list-disc pl-5 space-y-2">
                <li>Coordinate with the content team before making schema changes</li>
                <li>
                  Run <code className="bg-gray-100 px-1 py-0.5 rounded">npm run sync-schema</code> after schema changes
                </li>
                <li>Update frontend types when schema changes</li>
                <li>Test thoroughly after schema changes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Need more help? Check out the{" "}
          <Link href="/admin/schema" className="text-blue-600 hover:underline">
            schema monitor
          </Link>
        </p>
      </div>
    </div>
  )
}
