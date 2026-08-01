#!/usr/bin/env node
/**
 * Validates DECISION_REGISTRY.yaml structure (minimal schema check).
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const registryPath = join(root, '5_reference_architectures/DECISION_REGISTRY.yaml');

if (!existsSync(registryPath)) {
  console.error('FAIL: DECISION_REGISTRY.yaml not found');
  process.exit(1);
}

const content = readFileSync(registryPath, 'utf8');
const errors = [];

if (!content.match(/^version:\s*\d/m)) {
  errors.push('Missing version field');
}

const decisionBlocks = content.split(/- decision_id:/).slice(1);
if (decisionBlocks.length === 0) {
  errors.push('No decisions found');
}

const ids = new Set();
for (const block of decisionBlocks) {
  const id = block.match(/^\s*(\S+)/)?.[1];
  const status = block.match(/status:\s*(\S+)/)?.[1];
  if (!id) {
    errors.push('Decision block missing decision_id');
    continue;
  }
  if (ids.has(id)) {
    errors.push(`Duplicate decision_id: ${id}`);
  }
  ids.add(id);
  if (!status || !['accepted', 'proposed', 'deprecated'].includes(status)) {
    errors.push(`${id}: invalid or missing status`);
  }
  if (!block.includes('decision_basis:')) {
    errors.push(`${id}: missing decision_basis`);
  }
}

if (errors.length) {
  console.error('Registry validation FAILED:');
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}

console.log(`Registry OK: ${ids.size} decisions`);
process.exit(0);
