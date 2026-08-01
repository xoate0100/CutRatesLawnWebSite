import mediaMapJson from './generated/media-map.json'

export type MediaAttribution = {
  title: string | null
  author: string | null
  envato_url: string | null
  envato_item_id: string | number | null
}

export type MediaSlot = {
  slot: string
  asset_id: string | null
  variant: string | null
  url: string | null
  fallback: string | null
  alt: string
  width: number | null
  height: number | null
  attribution: MediaAttribution | null
  status: string | null
}

type MediaMap = {
  generated_at: string
  public_base_url: string
  slots: Record<string, MediaSlot>
}

const mediaMap = mediaMapJson as MediaMap

/** Resolve a site slot to a usable image URL (CDN or fallback). */
export function getMedia(slot: string): MediaSlot {
  const entry = mediaMap.slots[slot]
  if (!entry) {
    return {
      slot,
      asset_id: null,
      variant: null,
      url: null,
      fallback: null,
      alt: '',
      width: null,
      height: null,
      attribution: null,
      status: null,
    }
  }
  return entry
}

/** Prefer published CDN URL; otherwise fallback placeholder. */
export function mediaSrc(slot: string, fallback?: string): string {
  const m = getMedia(slot)
  return m.url || m.fallback || fallback || '/placeholder.svg'
}

export function mediaAlt(slot: string, fallback = ''): string {
  return getMedia(slot).alt || fallback
}

export function listMediaSlots(): string[] {
  return Object.keys(mediaMap.slots)
}

export function getMediaBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_MEDIA_BASE_URL ||
    mediaMap.public_base_url ||
    'https://storage.googleapis.com/site_photo_storage'
  )
}
