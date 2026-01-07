import type { Metadata } from "next"
import { performSearch } from "@/lib/search"
import { SearchResultItem } from "@/components/search/search-result-item"
import { SearchBar } from "@/components/search/search-bar"
import { ApiErrorFallback } from "@/components/api-error-fallback"

export const metadata: Metadata = {
  title: "Search | Cut Rates Lawn Care",
  description: "Search for lawn care services, bundles, blog posts, and FAQs.",
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const query = searchParams.q || ""

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Search</h1>
        <div className="max-w-2xl mx-auto">
          <SearchBar
            placeholder="Search for services, bundles, blog posts, and more..."
            buttonText="Search"
            className="mb-8"
          />
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Enter a search term</h2>
            <p className="text-gray-600">
              Type in the search box above to find services, bundles, blog posts, and FAQs.
            </p>
          </div>
        </div>
      </div>
    )
  }

  try {
    const searchResults = await performSearch(query)
    const { results, totalResults, categories } = searchResults

    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        <p className="text-gray-600 mb-8">
          {totalResults} results for "{query}"
        </p>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/4">
            <SearchBar
              placeholder="Search for services, bundles, blog posts, and more..."
              buttonText="Search"
              className="mb-8"
            />

            {totalResults === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">No results found</h2>
                <p className="text-gray-600">
                  We couldn't find any matches for "{query}". Please try another search term.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((result) => (
                  <SearchResultItem key={`${result.type}-${result.id}`} result={result} />
                ))}
              </div>
            )}
          </div>

          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Filter Results</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Categories</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center">
                      <a href={`/search?q=${query}`} className="text-gray-700 hover:text-green-600">
                        All Results
                      </a>
                      <span className="text-gray-500 text-sm">{totalResults}</span>
                    </li>
                    {categories.services > 0 && (
                      <li className="flex justify-between items-center">
                        <a href={`/search?q=${query}&type=service`} className="text-gray-700 hover:text-green-600">
                          Services
                        </a>
                        <span className="text-gray-500 text-sm">{categories.services}</span>
                      </li>
                    )}
                    {categories.bundles > 0 && (
                      <li className="flex justify-between items-center">
                        <a href={`/search?q=${query}&type=bundle`} className="text-gray-700 hover:text-green-600">
                          Bundles
                        </a>
                        <span className="text-gray-500 text-sm">{categories.bundles}</span>
                      </li>
                    )}
                    {categories.posts > 0 && (
                      <li className="flex justify-between items-center">
                        <a href={`/search?q=${query}&type=post`} className="text-gray-700 hover:text-green-600">
                          Blog Posts
                        </a>
                        <span className="text-gray-500 text-sm">{categories.posts}</span>
                      </li>
                    )}
                    {categories.faqs > 0 && (
                      <li className="flex justify-between items-center">
                        <a href={`/search?q=${query}&type=faq`} className="text-gray-700 hover:text-green-600">
                          FAQs
                        </a>
                        <span className="text-gray-500 text-sm">{categories.faqs}</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error performing search:", error)
    return <ApiErrorFallback error={error} />
  }
}
