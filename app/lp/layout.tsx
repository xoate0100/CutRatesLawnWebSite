import type { ReactNode } from "react"

export default function LpLayout({ children }: { children: ReactNode }) {
  return <div data-lp-layout="true">{children}</div>
}
