const HUMAN =
  "HUMAN SETUP: Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN for durable lead idempotency, rate limits, and the failure queue. Falling back to in-process Maps (not shared across serverless instances)."

let warned = false
function warnFallback() {
  if (warned) return
  warned = true
  console.warn(HUMAN)
}

function redisConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL?.trim() && process.env.UPSTASH_REDIS_REST_TOKEN?.trim())
}

async function redisCmd(args: Array<string | number>): Promise<unknown> {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim()
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim()
  if (!url || !token) {
    warnFallback()
    return null
  }
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  })
  if (!res.ok) {
    console.error("lead_store_redis_failed", { status: res.status })
    return null
  }
  const json = (await res.json()) as { result?: unknown }
  return json.result
}

const memIdem = new Map<string, number>()
const memHits = new Map<string, number[]>()
const memQueue: string[] = []

const IDEM_TTL_S = 24 * 60 * 60
const RATE_WINDOW_MS = 60_000
const RATE_MAX = 8

export async function hasIdempotencyKey(key: string): Promise<boolean> {
  if (redisConfigured()) {
    const result = await redisCmd(["GET", `lead:idemp:${key}`])
    return Boolean(result)
  }
  warnFallback()
  const now = Date.now()
  for (const [k, t] of memIdem) {
    if (now - t > IDEM_TTL_S * 1000) memIdem.delete(k)
  }
  return memIdem.has(key)
}

export async function markIdempotencyKey(key: string): Promise<void> {
  if (redisConfigured()) {
    await redisCmd(["SET", `lead:idemp:${key}`, "1", "EX", IDEM_TTL_S])
    return
  }
  memIdem.set(key, Date.now())
}

export async function rateLimited(ip: string): Promise<boolean> {
  const now = Date.now()
  if (redisConfigured()) {
    const n = Number(await redisCmd(["INCR", `lead:rate:${ip}`])) || 0
    if (n === 1) await redisCmd(["PEXPIRE", `lead:rate:${ip}`, RATE_WINDOW_MS])
    return n > RATE_MAX
  }
  warnFallback()
  const hits = (memHits.get(ip) ?? []).filter((h) => now - h < RATE_WINDOW_MS)
  hits.push(now)
  memHits.set(ip, hits)
  return hits.length > RATE_MAX
}

export type QueuedLead = {
  requestId: string
  body: unknown
  queuedAt: string
  attempts: number
}

export async function enqueueFailedLead(lead: QueuedLead): Promise<boolean> {
  const payload = JSON.stringify(lead)
  if (redisConfigured()) {
    const r = await redisCmd(["LPUSH", "lead:failq", payload])
    return r != null
  }
  warnFallback()
  memQueue.push(payload)
  return memQueue.length < 500
}

export async function dequeueFailedLeads(max = 20): Promise<QueuedLead[]> {
  const out: QueuedLead[] = []
  if (redisConfigured()) {
    for (let i = 0; i < max; i++) {
      const raw = await redisCmd(["RPOP", "lead:failq"])
      if (typeof raw !== "string") break
      try {
        out.push(JSON.parse(raw) as QueuedLead)
      } catch {
        /* skip */
      }
    }
    return out
  }
  while (out.length < max && memQueue.length) {
    const raw = memQueue.shift()
    if (!raw) break
    try {
      out.push(JSON.parse(raw) as QueuedLead)
    } catch {
      /* skip */
    }
  }
  return out
}

export function leadStoreMode(): "redis" | "memory" {
  return redisConfigured() ? "redis" : "memory"
}
