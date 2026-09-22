export type FunnelParams = {
  service: string
  subservice: string
  area: string
  size: string
  property: string
  frequency: string
  tier: string
  campaign: string
  source: string
  bundle: string
}

export const FUNNEL_PARAM_KEYS: Array<keyof FunnelParams> = [
  "service",
  "subservice",
  "area",
  "size",
  "property",
  "frequency",
  "tier",
  "campaign",
  "source",
  "bundle",
]

const STORE_KEY = "cro_funnel_params_v1"

const EMPTY: FunnelParams = {
  service: "",
  subservice: "",
  area: "",
  size: "",
  property: "",
  frequency: "",
  tier: "",
  campaign: "",
  source: "",
  bundle: "",
}

function clean(v: string | null | undefined): string {
  return (v || "").trim().slice(0, 80)
}

export function parseFunnelSearch(search: string | URLSearchParams): FunnelParams {
  const sp = typeof search === "string" ? new URLSearchParams(search.startsWith("?") ? search.slice(1) : search) : search
  const next = { ...EMPTY }
  for (const k of FUNNEL_PARAM_KEYS) {
    next[k] = clean(sp.get(k))
  }
  return next
}

export function mergeFunnelParams(...parts: Array<Partial<FunnelParams>>): FunnelParams {
  const out = { ...EMPTY }
  for (const p of parts) {
    for (const k of FUNNEL_PARAM_KEYS) {
      const v = p[k]
      if (v) out[k] = v
    }
  }
  return out
}

export function readStoredFunnelParams(): FunnelParams {
  if (typeof window === "undefined") return { ...EMPTY }
  try {
    const raw = sessionStorage.getItem(STORE_KEY)
    if (!raw) return { ...EMPTY }
    return mergeFunnelParams(JSON.parse(raw) as Partial<FunnelParams>)
  } catch {
    return { ...EMPTY }
  }
}

export function writeStoredFunnelParams(params: Partial<FunnelParams>): FunnelParams {
  const merged = mergeFunnelParams(readStoredFunnelParams(), params)
  if (typeof window !== "undefined") {
    sessionStorage.setItem(STORE_KEY, JSON.stringify(merged))
  }
  return merged
}

export function funnelQueryString(params: Partial<FunnelParams>): string {
  const sp = new URLSearchParams()
  for (const k of FUNNEL_PARAM_KEYS) {
    const v = params[k]
    if (v) sp.set(k, v)
  }
  const q = sp.toString()
  return q ? `?${q}` : ""
}

export function quoteHref(params: Partial<FunnelParams>): string {
  return `/quote${funnelQueryString(params)}`
}
