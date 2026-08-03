import type { AuthorType } from "@/lib/types"
import { getSafeImageUrl } from "@/lib/image-utils"

interface BlogAuthorProps {
  author: AuthorType
}

export function BlogAuthor({ author }: BlogAuthorProps) {
  const { name, bio, avatar } = author.attributes

  return (
    <div className="flex items-start gap-5 p-6 bg-gray-50 rounded-lg">
      {avatar && (
        <div className="flex-shrink-0">
          <img
            src={getSafeImageUrl(avatar) || "/placeholder.jpg?height=80&width=80"}
            alt={name}
            className="w-16 h-16 rounded-full object-cover"
            width={64}
            height={64}
          />
        </div>
      )}

      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">About {name}</h3>
        {bio && <p className="text-gray-700">{bio}</p>}
      </div>
    </div>
  )
}
