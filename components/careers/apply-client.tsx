"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { CareersApplyForm } from "@/components/careers/apply-form"

/** Apply route host — preselects job from ?job= and scrolls into form. */
export function CareersApplyClient() {
  const params = useSearchParams()
  const job = params.get("job")

  useEffect(() => {
    document.getElementById("apply")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

  return <CareersApplyForm initialJobId={job} />
}
