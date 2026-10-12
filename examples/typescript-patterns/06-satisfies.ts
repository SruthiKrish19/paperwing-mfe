// Pattern 6 (bonus): satisfies. Check a value against a type without widening it.
import type { Status } from './02-exhaustive-switch';

type Tone = 'neutral' | 'info' | 'success' | 'danger';

// BEFORE: an annotation checks the object but widens the keys, so autocomplete and narrowing are gone.
const tonesBefore: Record<Status, Tone> = { draft: 'neutral', sent: 'info', paid: 'success', overdue: 'danger' };
export const _t = tonesBefore;

// AFTER: satisfies checks every key is present and every value is a Tone, and keeps the literal types.
export const tones = {
  draft: 'neutral',
  sent: 'info',
  paid: 'success',
  overdue: 'danger',
} satisfies Record<Status, Tone>;

export const paidTone = tones.paid; // type is 'success', not Tone

// @ts-expect-error  a missing status is a compile error, not a runtime undefined
export const broken = { draft: 'neutral', sent: 'info', paid: 'success' } satisfies Record<Status, Tone>;
