"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  FIVE_STAR_GOOGLE_REVIEWS,
  GOOGLE_MAPS_URL,
  GOOGLE_RATING,
  GOOGLE_REVIEW_COUNT,
  type CuratedGoogleReview,
} from "@/lib/google-reviews"
import { cn } from "@/lib/utils"

type ApiReview = {
  author?: { name?: string } | string
  author_name?: string
  rating: number
  text: string
  relative_time_description?: string
}

function toCard(review: CuratedGoogleReview | ApiReview): {
  name: string
  text: string
  when: string
} {
  if ("author_name" in review && review.author_name) {
    return {
      name: review.author_name,
      text: review.text,
      when: review.relative_time_description ?? "on Google",
    }
  }
  const api = review as ApiReview
  const name =
    typeof api.author === "string" ? api.author : api.author?.name || api.author_name || "Google reviewer"
  return {
    name,
    text: api.text,
    when: api.relative_time_description ?? "on Google",
  }
}

export function GoogleReviewsRotator({
  className,
  intervalMs = 7000,
}: {
  className?: string
  intervalMs?: number
}) {
  const [live, setLive] = useState<ApiReview[] | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch("/api/google-reviews")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data?.reviews) return
        const five = (data.reviews as ApiReview[]).filter((r) => r.rating >= 5 && r.text)
        if (five.length) setLive(five)
      })
      .catch(() => {
        /* curated fallback */
      })
    return () => {
      cancelled = true
    }
  }, [])

  const cards = useMemo(() => {
    const source = live?.length ? live : FIVE_STAR_GOOGLE_REVIEWS
    return source.map(toCard).filter((c) => c.text.trim().length > 0)
  }, [live])

  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (cards.length < 2) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % cards.length)
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [cards.length, intervalMs])

  const current = cards[index] ?? cards[0]
  if (!current) return null

  return (
    <section
      className={cn("rounded-brand border border-line bg-white p-5 sm:p-7", className)}
      aria-live="polite"
      aria-label="Google five-star reviews"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-wider text-sage">Google reviews</p>
        <Link
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-bold text-green hover:underline"
        >
          {GOOGLE_RATING}★ · {GOOGLE_REVIEW_COUNT} reviews
        </Link>
      </div>
      <p className="mt-2 text-amber-500" aria-hidden>
        ★★★★★
      </p>
      <blockquote className="mt-2 min-h-[5.5rem]">
        <p className="text-[1.05rem] font-medium text-ink">&ldquo;{current.text}&rdquo;</p>
        <footer className="mt-3 text-sm font-semibold text-sage">
          {current.name} · {current.when}
        </footer>
      </blockquote>
    </section>
  )
}
