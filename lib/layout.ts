/**
 * Shared horizontal page gutter — prefer this over w-[min(...,92vw)]
 * which leaves ~4vw edge margin and overflows when children are nowrap/wide.
 */
export const pageWrap =
  "mx-auto w-full max-w-[1200px] px-5 sm:px-6 lg:px-8" as const

export const pageWrapNarrow =
  "mx-auto w-full max-w-[900px] px-5 sm:px-6 lg:px-8" as const

export const pageWrapMid =
  "mx-auto w-full max-w-[1000px] px-5 sm:px-6 lg:px-8" as const

export const pageWrapQuote =
  "mx-auto w-full max-w-[960px] px-5 sm:px-6 lg:px-8" as const

export const pageWrapProse =
  "mx-auto w-full max-w-[720px] px-5 sm:px-6 lg:px-8" as const
