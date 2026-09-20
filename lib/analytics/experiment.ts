/** Deterministic A/B bucket on session id. Default variant is "control". */
export function experimentVariant(sessionId: string | undefined, salt = "cro-default"): string {
  if (!sessionId) return "control"
  let h = 0
  const s = `${salt}:${sessionId}`
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h % 2 === 0 ? "control" : "variant"
}
