import { ApiTroubleshooter } from "@/components/api-troubleshooter"

export default function DiagnosticsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">API Diagnostics</h1>
      <p className="text-center mb-8 max-w-2xl mx-auto">
        This page helps diagnose issues with the API connection. Use it to troubleshoot when you encounter API-related
        errors.
      </p>

      <ApiTroubleshooter />

      <div className="mt-12 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Common Issues and Solutions</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">400 Bad Request Errors</h3>
            <p className="mb-2">This usually indicates a problem with the request format or parameters.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Check if your Strapi version is compatible with the request format</li>
              <li>Verify that the populate parameter syntax is correct for your Strapi version</li>
              <li>Ensure field names in filters match the API schema</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Authentication Errors</h3>
            <p className="mb-2">These occur when your API token is invalid or missing.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Check that STRAPI_API_TOKEN is set in your environment variables</li>
              <li>Verify the token has the necessary permissions</li>
              <li>Generate a new token if the current one has expired</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Network Errors</h3>
            <p className="mb-2">These occur when the API server cannot be reached.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Verify that STRAPI_API_URL is correct in your environment variables</li>
              <li>Check if the API server is running and accessible</li>
              <li>Test if there are any network restrictions blocking access</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
