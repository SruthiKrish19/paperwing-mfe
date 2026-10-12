// Pattern 4: money as branded integer cents. No floats, and no mixing dollars with cents.

// BEFORE: floats. Three line items at 0.10 do not add up to 0.30.
const totalBefore = 0.1 + 0.1 + 0.1; // 0.30000000000000004
export const _totalBefore = totalBefore;

// AFTER: an integer type that cannot be confused with a plain number.
export type Cents = number & { readonly __brand: 'Cents' };

export function cents(n: number): Cents {
  if (!Number.isInteger(n)) throw new Error(`cents must be an integer, got ${n}`);
  return n as Cents;
}
export const addCents = (a: Cents, b: Cents): Cents => (a + b) as Cents;
export const formatCents = (c: Cents, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(c / 100);

const lineItems = [cents(10), cents(10), cents(10)];
export const total = lineItems.reduce(addCents, cents(0)); // 30, exactly

// @ts-expect-error  a raw number is not Cents: the 19.99 "dollars" bug cannot reach addCents
addCents(total, 19.99);
