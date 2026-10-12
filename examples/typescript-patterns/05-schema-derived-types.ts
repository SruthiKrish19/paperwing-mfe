// Pattern 5: derive types from a schema at the boundary. The type and the runtime check cannot drift apart.
import { z } from 'zod';

// BEFORE: a hand-written type that described last month's API.
type ApiInvoiceBefore = { id: string; dueDate: Date; totalCents: number };
function parseBefore(json: unknown): ApiInvoiceBefore {
  return json as ApiInvoiceBefore; // the backend now sends dueDate as an ISO string; nothing here notices
}
export const _parseBefore = parseBefore;

// AFTER: one schema. The type is inferred from it, and parse() rejects anything that does not match.
export const ApiInvoice = z.object({
  id: z.string(),
  dueDate: z.string().datetime().transform((s) => new Date(s)),
  totalCents: z.number().int(),
});
export type ApiInvoice = z.infer<typeof ApiInvoice>; // { id: string; dueDate: Date; totalCents: number }

export function parseInvoice(json: unknown): ApiInvoice {
  return ApiInvoice.parse(json); // throws with a precise path when the shape changes
}

// Change the schema and the inferred type changes with it, so every consumer re-checks at compile time.
const inv = parseInvoice({ id: 'inv_1', dueDate: '2026-10-24T00:00:00.000Z', totalCents: 56000 });
export const due: Date = inv.dueDate;
