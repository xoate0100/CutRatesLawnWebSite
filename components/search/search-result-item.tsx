import Link from "next/link"
import type { SearchResultType } from "@/lib/types"

interface SearchResultItemProps {
  result: SearchResultType
}

export function SearchResultItem({ result }: SearchResultItemProps) {
  const { type, title, description, url, image, category } = result

  // Get icon based on result type
  const getTypeIcon = () => {
    switch (type) {
      case "service":
        return (
          <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )
      case "bundle":
        return (
          <div className="bg-purple-100 text-purple-600 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
        )
      case "post":
        return (
          <div className="bg-green-100 text-green-600 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z"
                clipRule="evenodd"
              />
              <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
            </svg>
          </div>
        )
      case "faq":
        return (
          <div className="bg-yellow-100 text-yellow-600 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )
      default:
        return null
    }
  }

  // Get type label
  const getTypeLabel = () => {
    switch (type) {
      case "service":
        return "Service"
      case "bundle":
        return "Bundle"
      case "post":
        return "Blog Post"
      case "faq":
        return "FAQ"
      default:
        return "Result"
    }
  }

  return (
    <Link href={url} className="block">
      <div className="flex items-start p-4 border rounded-lg hover:bg-gray-50 transition-colors">
        <div className="mr-4 mt-1">{getTypeIcon()}</div>
        <div className="flex-grow">
          <div className="flex items-center mb-1">
            <span className="text-xs font-medium text-gray-500 mr-2">{getTypeLabel()}</span>
            {category && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{category}</span>}
          </div>
          <h3 className="font-medium text-lg text-gray-900 mb-1">{title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
        </div>
        {image && (
          <div className="ml-4 flex-shrink-0">
            <img
              src={image || "/placeholder.svg"}
              alt={title}
              className="w-16 h-16 object-cover rounded"
              width={64}
              height={64}
            />
          </div>
        )}
      </div>
    </Link>
  )
}
