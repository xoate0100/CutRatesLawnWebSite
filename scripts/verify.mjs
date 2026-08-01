#!/usr/bin/env node
/**
 * Agentic verification gate — build, registry, drift, scaffold presence.
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
let failed = false;

function check(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (e) {
    console.error(`✗ ${name}: ${e.message}`);
    failed = true;
  }
}

function requireFile(rel) {
  const p = join(root, rel);
  if (!existsSync(p)) throw new Error(`missing ${rel}`);
}

check('Scaffold marker', () => requireFile('.agentic-initialized'));
check('Feature flags', () => requireFile('0_phase0_bootstrap/feature_flags.yml'));
check('Decision registry', () => requireFile('5_reference_architectures/DECISION_REGISTRY.yaml'));
check('AI context', () => requireFile('6_ai_runtime_context/AI_CONTEXT.md'));
check('Cold-start doc', () => requireFile('docs/DEV_COLD_START_KNOWLEDGE.md'));
check('Cursor session rule', () => requireFile('.cursor/rules/agentic-session.mdc'));

check('Decision registry validation', () => {
  execSync('node scripts/validate-decision-registry.mjs', { cwd: root, stdio: 'pipe' });
});

check('Governance path drift', () => {
  const flags = readFileSync(join(root, '0_phase0_bootstrap/feature_flags.yml'), 'utf8');
  const sandbox = readFileSync(join(root, '0_phase0_bootstrap/AI_SANDBOX_RULES.md'), 'utf8');
  const writePaths = [];
  const wt = flags.match(/write_to:\r?\n((?:\s+-\s+.+\r?\n)+)/);
  if (wt) {
    for (const line of wt[1].split('\n')) {
      const m = line.match(/-\s+(.+)/);
      if (m) writePaths.push(m[1].trim());
    }
  }
  for (const p of ['app', 'components', 'docs']) {
    const normalized = writePaths.map((x) => x.replace(/\/$/, ''));
    if (!normalized.includes(p)) {
      throw new Error(`feature_flags missing expected path: ${p}`);
    }
  }
  if (!sandbox.includes('feature_flags.yml')) {
    throw new Error('AI_SANDBOX_RULES does not reference feature_flags.yml');
  }
});

check('Production build', () => {
  execSync('npm run build', { cwd: root, stdio: 'pipe', env: { ...process.env, CI: 'true' } });
});

if (failed) {
  console.error('\nVERIFY FAILED');
  process.exit(1);
}

console.log('\nVERIFY PASSED');
process.exit(0);
