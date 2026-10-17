#!/usr/bin/env node
// Flags are temporary. This runs in CI and fails when one has overstayed.
//   node scripts/check-flags.mjs apps/shell/public/flags.json
import { readFileSync } from 'node:fs';
const file = process.argv[2] ?? 'apps/shell/public/flags.json';
const flags = JSON.parse(readFileSync(file, 'utf8'));
const today = new Date().toISOString().slice(0, 10);
let bad = 0;
for (const [name, rule] of Object.entries(flags)) {
  const done = rule.default === true || rule.rollout === 100;
  const expired = rule.expires && rule.expires < today;
  if (expired) { bad++; console.log(`✗ ${name}: expired ${rule.expires} (owner: ${rule.owner}).${done ? ' At 100%: delete the flag and the old path.' : ' Extend it or kill it.'}`); }
  else console.log(`✓ ${name}: ok until ${rule.expires ?? 'never'}${done ? ' (fully on, remove soon)' : ''}`);
}
if (bad) { console.log(`\n${bad} flag(s) overdue. Flags are not forever.`); process.exit(1); }
