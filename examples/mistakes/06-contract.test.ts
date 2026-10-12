// MISTAKE 6 fixed: a consumer-driven contract test.
// Invoices (the consumer) declares what it needs from `time:logged`.
// Time (the producer) runs this test in its own CI. Rename a field and the build
// fails here, in Time's pipeline, instead of in production at 9am.
//   node --test examples/mistakes/06-contract.test.ts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { z } from 'zod';

// What Invoices needs. Versioned: adding a field is fine, changing one is a v2.
const timeLoggedV1 = z.object({
  clientId: z.string().min(1),
  hours: z.number().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

// What Time actually emits today (the producer's fixture).
import { sampleTimeLogged } from './06-producer-fixture.ts';

test('time:logged v1 contract', () => {
  const result = timeLoggedV1.safeParse(sampleTimeLogged);
  assert.ok(result.success, JSON.stringify(result.error?.issues, null, 2));
});
