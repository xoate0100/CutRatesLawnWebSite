import Image from "next/image"
import { KWCH_FEATURE } from "@/lib/press"
import { mediaAlt, mediaSrc } from "@/lib/media"
import { cn } from "@/lib/utils"

export function PressFeature({ className }: { className?: string }) {
  return (
    <a
      href={KWCH_FEATURE.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex flex-col gap-4 rounded-brand border border-line bg-white p-5 sm:flex-row sm:items-center sm:p-7",
        className,
      )}
    >
      <Image
        src={mediaSrc("partners.kwch")}
        alt={mediaAlt("partners.kwch", "KWCH")}
        width={140}
        height={48}
        className="h-10 w-auto object-contain"
      />
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wider text-sage">{KWCH_FEATURE.label}</p>
        <p className="font-display mt-1 text-lg font-bold text-ink">{KWCH_FEATURE.headline}</p>
        <p className="mt-1 text-sm text-sage">{KWCH_FEATURE.blurb}</p>
        <p className="mt-2 text-sm font-bold text-green">Watch / read the KWCH story →</p>
      </div>
    </a>
  )
}
