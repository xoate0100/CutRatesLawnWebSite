import fs from "node:fs"
import path from "node:path"

const files = [
  "app/page.tsx",
  "app/about/page.tsx",
  "app/quote/page.tsx",
  "app/contact/page.tsx",
  "app/our-work/page.tsx",
  "app/faq/page.tsx",
  "app/privacy/page.tsx",
  "app/terms/page.tsx",
  "app/service-areas/page.tsx",
  path.join("app", "service-areas", "[slug]", "page.tsx"),
  "app/services/page.tsx",
  "app/bundles/page.tsx",
  "app/blog/page.tsx",
  "app/dev/components/page.tsx",
  "components/blocks/service-detail-view.tsx",
]

const replacements = [
  [/className="mx-auto w-\[min\(1200px,92vw\)\]([^"]*)"/g, "className={`${pageWrap}$1`}"],
  [/className="mx-auto w-\[min\(1000px,92vw\)\]([^"]*)"/g, "className={`${pageWrapMid}$1`}"],
  [/className="mx-auto w-\[min\(960px,92vw\)\]([^"]*)"/g, "className={`${pageWrapQuote}$1`}"],
  [/className="mx-auto w-\[min\(900px,92vw\)\]([^"]*)"/g, "className={`${pageWrapNarrow}$1`}"],
  [/className="mx-auto w-\[min\(720px,92vw\)\]([^"]*)"/g, "className={`${pageWrapProse}$1`}"],
  [/className="mx-auto grid w-\[min\(1200px,92vw\)\]([^"]*)"/g, "className={`${pageWrap} grid$1`}"],
]

for (const file of files) {
  const abs = path.join(process.cwd(), file)
  if (!fs.existsSync(abs)) {
    console.log("skip missing", file)
    continue
  }

  let c = fs.readFileSync(abs, "utf8")
  c = c.replace(/(?:import \{[^}]*\} from "@\/lib\/layout"\n)+/g, "")

  let changed = false
  for (const [re, to] of replacements) {
    const next = c.replace(re, to)
    if (next !== c) {
      changed = true
      c = next
    }
  }

  const names = []
  if (/\$\{pageWrap\}/.test(c) || /\$\{pageWrap\} /.test(c) || /pageWrap\} grid/.test(c)) names.push("pageWrap")
  if (c.includes("pageWrapNarrow")) names.push("pageWrapNarrow")
  if (c.includes("pageWrapMid")) names.push("pageWrapMid")
  if (c.includes("pageWrapQuote")) names.push("pageWrapQuote")
  if (c.includes("pageWrapProse")) names.push("pageWrapProse")
  // also detect `${pageWrap} grid`
  if (/\$\{pageWrap\}/.test(c) && !names.includes("pageWrap")) names.push("pageWrap")

  const unique = [...new Set(names)]
  if (unique.length) {
    const importStmt = `import { ${unique.join(", ")} } from "@/lib/layout"\n`
    if (c.startsWith('"use client"')) {
      c = c.replace(/^("use client".*\n+)/, `$1${importStmt}`)
    } else if (/^(?:import .+\n)+/.test(c)) {
      c = c.replace(/^((?:import .+\n)+)/, `$1${importStmt}`)
    } else {
      c = importStmt + c
    }
    changed = true
  }

  if (changed) {
    fs.writeFileSync(abs, c)
    console.log("updated", file, unique)
  } else {
    console.log("unchanged", file)
  }
}
