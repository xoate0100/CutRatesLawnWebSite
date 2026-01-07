"use client"

import type React from "react"

import { useState } from "react"
import type { ImageObject } from "@/lib/types"
import { getSafeImageUrl } from "@/lib/image-utils"

interface BeforeAfterImagePair {
  id: string
  before: ImageObject
  after: ImageObject
  title?: string
  description?: string
}

interface BeforeAfterGalleryProps {
  imagePairs: BeforeAfterImagePair[]
  className?: string
}

export function BeforeAfterGallery({ imagePairs, className = "" }: BeforeAfterGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [sliderPosition, setSliderPosition] = useState(50)

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value))
  }

  if (!imagePairs || imagePairs.length === 0) {
    return null
  }

  const activePair = imagePairs[activeIndex]

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="relative overflow-hidden rounded-lg aspect-video">
        {/* Before Image (Full width) */}
        <div className="absolute inset-0">
          <img
            src={getSafeImageUrl(activePair.before) || "/placeholder.svg?height=600&width=800"}
            alt={`Before: ${activePair.title || "Transformation"}`}
            className="w-full h-full object-cover"
            width={800}
            height={600}
          />
        </div>

        {/* After Image (Clipped based on slider) */}
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPosition}%` }}>
          <img
            src={getSafeImageUrl(activePair.after) || "/placeholder.svg?height=600&width=800"}
            alt={`After: ${activePair.title || "Transformation"}`}
            className="w-full h-full object-cover"
            style={{ width: `${100 / (sliderPosition / 100)}%` }}
            width={800}
            height={600}
          />
        </div>

        {/* Slider Divider */}
        <div
          className="absolute inset-y-0 w-1 bg-white shadow-md cursor-ew-resize"
          style={{ left: `${sliderPosition}%` }}
        />

        {/* Labels */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          Before
        </div>
        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          After
        </div>

        {/* Slider Control */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={handleSliderChange}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-white rounded-full appearance-none cursor-pointer"
          aria-label="Adjust before/after view"
        />
      </div>

      {activePair.title && (
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900">{activePair.title}</h3>
          {activePair.description && <p className="text-gray-700 mt-2">{activePair.description}</p>}
        </div>
      )}

      {/* Thumbnails */}
      {imagePairs.length > 1 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {imagePairs.map((pair, index) => (
            <button
              key={pair.id}
              onClick={() => setActiveIndex(index)}
              className={`relative rounded-lg overflow-hidden aspect-video focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                index === activeIndex ? "ring-2 ring-green-500" : ""
              }`}
              aria-label={`View ${pair.title || `transformation ${index + 1}`}`}
              aria-current={index === activeIndex ? "true" : "false"}
            >
              <img
                src={getSafeImageUrl(pair.after, "thumbnail") || "/placeholder.svg?height=100&width=150"}
                alt={pair.title || `Transformation ${index + 1}`}
                className="w-full h-full object-cover"
                width={150}
                height={100}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
