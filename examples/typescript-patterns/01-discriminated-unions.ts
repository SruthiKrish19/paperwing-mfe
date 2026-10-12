// Pattern 1: discriminated unions. Make impossible states unrepresentable.

// BEFORE: one bag of optional fields. TypeScript is happy; the data can lie.
type InvoiceBefore = {
  status: 'draft' | 'sent' | 'paid';
  sentAt?: string;
  paidAt?: string;
};

function daysSincePaidBefore(inv: InvoiceBefore): number {
  // paidAt is optional, so this compiles, and crashes on a "paid" invoice with no paidAt
  return (Date.now() - new Date(inv.paidAt!).getTime()) / 86_400_000;
}

// AFTER: each status carries exactly the fields that exist in that state.
type Draft = { status: 'draft' };
type Sent = { status: 'sent'; sentAt: string };
type Paid = { status: 'paid'; sentAt: string; paidAt: string };
export type Invoice = Draft | Sent | Paid;

export function daysSincePaid(inv: Paid): number {
  return (Date.now() - new Date(inv.paidAt).getTime()) / 86_400_000; // paidAt is guaranteed here
}

export function remind(inv: Invoice) {
  if (inv.status === 'paid') return daysSincePaid(inv); // narrowed: inv is Paid
  // @ts-expect-error  a draft or sent invoice has no paidAt, so this line cannot compile
  return inv.paidAt;
}

export const _before = daysSincePaidBefore;
