// MISTAKE 2: sharing state through window globals.
// Time writes, Invoices reads. Nothing declares the shape, nothing says who owns it,
// and whoever loads second wins.

declare global {
  interface Window {
    currentUser?: { id: string; name: string };
    unbilledHours?: number;
    onTimeLogged?: (hours: number) => void;
  }
}

// --- in the Time remote ---
export function logTime(hours: number) {
  window.unbilledHours = (window.unbilledHours ?? 0) + hours;
  window.onTimeLogged?.(hours);          // only works if Invoices mounted first
}

// --- in the Invoices remote ---
export function mountInvoices(render: (hours: number) => void) {
  window.onTimeLogged = (h) => render(h); // overwrites any other listener
  render(window.unbilledHours ?? 0);     // stale if Time wrote before this ran
}
