#!/usr/bin/env node
/**
 * Regenerates 6_ai_runtime_context/AI_CONTEXT.md from governance sources.
 * Idempotent: overwrites AI_CONTEXT.md each run.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function read(path) {
  const full = join(root, path);
  return existsSync(full) ? readFileSync(full, 'utf8') : '';
}

function extractYamlValue(yaml, key) {
  const match = yaml.match(new RegExp(`^${key}:\\s*["']?([^"'\\n]+)`, 'm'));
  return match ? match[1].trim() : 'unknown';
}

function extractDecisions(registryYaml) {
  const decisions = [];
  const blocks = registryYaml.split(/- decision_id:/).slice(1);
  for (const block of blocks) {
    const id = block.match(/^\s*(\S+)/)?.[1];
    const status = block.match(/status:\s*(\S+)/)?.[1];
    const basis = block.match(/decision_basis:\s*>?\s*\n\s*(.+)/)?.[1]?.trim();
    if (id && status === 'accepted') {
      decisions.push(`- **${id}**: ${basis || '(no summary)'}`);
    }
  }
  return decisions;
}

function extractKeywords(registryYaml) {
  const keywords = [];
  const lines = registryYaml.split('\n');
  let inKeywords = false;
  for (const line of lines) {
    if (line.includes('resurrection_trigger_keywords:')) {
      inKeywords = true;
      continue;
    }
    if (inKeywords) {
      if (line.match(/^\s{4}-\s+"/)) {
        keywords.push(line.replace(/^\s{4}-\s+"([^"]+)".*/, '$1'));
      } else if (line.match(/^\s{2}\w/) && !line.match(/^\s{4}/)) {
        inKeywords = false;
      }
    }
  }
  return keywords;
}

const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
const flags = read('0_phase0_bootstrap/feature_flags.yml');
const plan = read('6_ai_runtime_context/ACTIVE_PLAN.yaml');
const pointer = read('6_ai_runtime_context/ACTIVE_TASK_POINTER.yaml');
const registry = read('5_reference_architectures/DECISION_REGISTRY.yaml');
const drift = read('5_reference_architectures/DRIFT_VECTORS.yaml');
const sandbox = read('0_phase0_bootstrap/AI_SANDBOX_RULES.md');

const planId = extractYamlValue(plan, 'plan_id');
const component = extractYamlValue(plan, 'component');
const currentTask = extractYamlValue(pointer, 'current_task');
const pointerStatus = extractYamlValue(pointer, 'status');
const maturity = extractYamlValue(flags, 'maturity') || 'L2.5';
const layout = extractYamlValue(flags, 'layout_preset') || 'nextjs_root';

const writeTo = [];
const wtMatch = flags.match(/write_to:\r?\n((?:\s+-\s+.+\r?\n)+)/);
if (wtMatch) {
  for (const line of wtMatch[1].split('\n')) {
    const m = line.match(/-\s+(.+)/);
    if (m) writeTo.push(m[1].trim());
  }
}

const decisions = extractDecisions(registry);
const keywords = extractKeywords(registry);

const driftIds = [];
for (const line of drift.split('\n')) {
  const m = line.match(/- id:\s*(DV_\w+)/);
  if (m) driftIds.push(m[1]);
}

const content = `# AI Execution Context — Auto-Generated

**Generated:** ${now}
**Authority:** \`0_phase0_bootstrap/AI_SANDBOX_RULES.md\`
**Purpose:** Consolidated constraint context for AI sessions

> Regenerate: \`npm run agentic:context\`

---

## Governance

**Maturity:** ${maturity} Single-Agent Sandbox
**Layout:** ${layout}

### Allowed write paths
${writeTo.map((p) => `- \`${p}/\``).join('\n')}

### Locked (proposal-only)
- \`0_phase0_bootstrap/\`
- \`5_reference_architectures/\`

---

## Current State

| Field | Value |
|-------|-------|
| Plan | \`${planId}\` |
| Component | \`${component}\` |
| Current task | ${currentTask} |
| Pointer status | ${pointerStatus} |

---

## Accepted Decisions

${decisions.length ? decisions.join('\n') : '_No accepted decisions parsed._'}

---

## Forbidden resurrection keywords

${keywords.length ? keywords.map((k) => `- \`${k}\``).join('\n') : '_None._'}

---

## Drift vectors

${driftIds.map((d) => `- \`${d}\``).join('\n')}

---

## Session checklist

1. Read \`docs/DEV_COLD_START_KNOWLEDGE.md\`
2. Query decisions before architectural changes
3. Stay within write paths above
4. Run \`npm run verify\` before marking work complete

---

## References

| File | Role |
|------|------|
| \`docs/DEV_COLD_START_KNOWLEDGE.md\` | Cold-start onboarding |
| \`6_ai_runtime_context/ACTIVE_PLAN.yaml\` | Task plan |
| \`5_reference_architectures/DECISION_REGISTRY.yaml\` | Decisions |
| \`AGENTIC_UPGRADE_PLAN.md\` | Migration status |

---

## Sandbox rules excerpt

${sandbox.split('\n').slice(0, 20).join('\n')}
...
`;

const outPath = join(root, '6_ai_runtime_context/AI_CONTEXT.md');
writeFileSync(outPath, content, 'utf8');
console.log(`Generated ${outPath}`);
