# Dependencies Audit — Coverage Matrix

**Mode:** discovery | **Date:** 2026-09-01

| Area | Ran? | Method | Result |
|------|------|--------|--------|
| Manifest inventory | Yes | read `package.json` | 56 prod + 12 dev direct deps |
| Lockfile committed | Yes | glob | `pnpm-lock.yaml` only |
| Single package manager | Yes | glob | pnpm; Vercel npm mismatch (infra) |
| Outdated direct deps | Yes | `pnpm outdated` | Next/React/Tailwind majors behind |
| npm audit | Yes | `pnpm audit` | 46 vulns (11 high) |
| Engine / Node pin | Yes | examine package.json, CI | No engines field; CI Node 20 |
| Peer dependency conflicts | Partial | install succeeds | `--legacy-peer-deps` on Vercel only |
| Unused dependencies | Partial | grep sample | prismjs/recharts Suspected low-use |
| Deprecated packages | No | npm deprecations API | Not run |
| Tooling (eslint, tsc) | Yes | examine configs | Present; build ignores failures |
| CI runs verify | Yes | ci.yml | Yes |
| CI runs lint/tsc strict | No | ci.yml | **Not separate hard gate** |
| Playwright in CI | No | ci.yml | E2E not in CI |
| Breaking-change exposure | Yes | outdated majors | Next 16, React 19, Tailwind 4, Zod 4 |
| Security CVE detail | Partial | audit output | Hand detailed CVSS to `/audit-security-nist` |

**Coverage:** 11/14 areas examined; deprecated API scan and full unused-dep graph deferred.
