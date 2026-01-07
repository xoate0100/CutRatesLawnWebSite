import { getSafeImageUrl } from "@/lib/utils"
import Image from "next/image"

interface ImageComponentProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export function ImageComponent({
  src,
  alt,
  width = 800,
  height = 600,
  className = "",
  priority = false,
}: ImageComponentProps) {
  const safeImageUrl = getSafeImageUrl(src)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={safeImageUrl || "/placeholder.svg"}
        alt={alt || "Image"}
        width={width}
        height={height}
        className="object-cover"
        priority={priority}
      />
    </div>
  )
}
