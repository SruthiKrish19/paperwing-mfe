// FIX: a typed event bus with a declared contract and replay.
// The contract lives in one shared package; both remotes compile against it.

import { bus } from '@paperwing/events';

// --- in the Time remote ---
export function logTime(hours: number, clientId: string, date: string) {
  bus.emit('time:logged', { clientId, hours, date });   // typed payload
}

// --- in the Invoices remote ---
export function mountInvoices(render: (hours: number) => void) {
  // replay: true delivers events fired before Invoices mounted.
  return bus.on('time:logged', ({ hours }) => render(hours), { replay: true });
}
