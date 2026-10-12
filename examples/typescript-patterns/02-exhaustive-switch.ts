// Pattern 2: exhaustive switches. Adding a case somewhere fails the build everywhere it matters.

export type Status = 'draft' | 'sent' | 'paid' | 'overdue';

// BEFORE: a new status was added, this function was not updated, and it quietly returned nothing.
export function badgeBefore(status: Status): string | undefined {
  switch (status) {
    case 'draft': return 'neutral';
    case 'sent': return 'info';
    case 'paid': return 'success';
  }
  // 'overdue' falls through to undefined. No error, no badge.
}

// AFTER: assertNever turns the missing case into a compile error.
export function assertNever(x: never): never {
  throw new Error(`Unhandled case: ${String(x)}`);
}

export function badge(status: Status): string {
  switch (status) {
    case 'draft': return 'neutral';
    case 'sent': return 'info';
    case 'paid': return 'success';
    case 'overdue': return 'danger';
    default: return assertNever(status); // delete the 'overdue' case above and this line stops compiling
  }
}

export function badgeMissing(status: Status): string {
  switch (status) {
    case 'draft': return 'neutral';
    case 'sent': return 'info';
    case 'paid': return 'success';
    // @ts-expect-error  'overdue' is not handled, so status is not never here
    default: return assertNever(status);
  }
}
