export type FlagRule = {
  kill?: boolean;      // hard off for everyone. Wins over everything else.
  allow?: string[];    // user ids that always get it (you, your team, a pilot customer)
  rollout?: number;    // 0..100: percentage of users, by stable bucket
  default?: boolean;   // what everyone else gets
  owner?: string;      // housekeeping: who deletes this flag
  expires?: string;    // housekeeping: when it should be gone (YYYY-MM-DD)
};
export type FlagConfig = Record<string, FlagRule>;
export type Decision = { on: boolean; reason: 'kill' | 'override' | 'allow' | 'rollout' | 'default' | 'unknown'; bucket: number };

// Stable bucket 0..99 for (user, flag). Same inputs, same bucket, on every device, forever.
// FNV-1a: tiny, fast, good enough spread for percentages. Not for security.
export function bucket(userId: string, flag: string): number {
  let h = 0x811c9dc5;
  for (const ch of `${flag}:${userId}`) { h ^= ch.charCodeAt(0); h = Math.imul(h, 0x01000193) >>> 0; }
  return h % 100;
}

// Evaluation order is the whole design: kill, override, allow list, rollout, default.
export function evaluate(flag: string, rule: FlagRule | undefined, userId: string, override?: boolean): Decision {
  const b = bucket(userId, flag);
  if (!rule) return { on: false, reason: 'unknown', bucket: b };
  if (rule.kill) return { on: false, reason: 'kill', bucket: b };
  if (override !== undefined) return { on: override, reason: 'override', bucket: b };
  if (rule.allow?.includes(userId)) return { on: true, reason: 'allow', bucket: b };
  if (rule.rollout !== undefined && rule.rollout > 0) return { on: b < rule.rollout, reason: 'rollout', bucket: b };
  return { on: rule.default ?? false, reason: 'default', bucket: b };
}
