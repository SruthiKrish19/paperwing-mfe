import { Badge, formatMoney, type Tone } from '@paperwing/ui';
import type { Invoice } from '../data/seed';

// Demo switches for the error-handling video. ?chaos=render | async | event. Never set in real use.
export const chaos = new URLSearchParams(location.search).get('chaos');
declare global { interface Window { __chaosArmed?: boolean } }
window.__chaosArmed ??= true;

// 1. A render error: one row has corrupt data. Caught by the nearest boundary.
export function InvoiceRow({ invoice: i, tone }: { invoice: Invoice; tone: Tone }) {
  // React retries a failed render once before showing the boundary, so the throw must be
  // deterministic. "Try again" in the fallback disarms it, like a transient failure clearing.
  if (chaos === 'render' && i.number === 'PW-0045' && window.__chaosArmed) {
    throw new TypeError(`Cannot format total: totalCents is undefined (invoice ${i.number})`);
  }
  return (
    <tr>
      <td><strong>{i.number}</strong></td>
      <td>{i.clientName}</td>
      <td className="pw-muted">{i.issued}</td>
      <td className="pw-muted">{i.due}</td>
      <td className="num">{formatMoney(i.totalCents)}</td>
      <td><Badge tone={tone}>{i.status}</Badge></td>
    </tr>
  );
}

// 2. An event-handler error: thrown on click. React does NOT route this to a boundary.
export function exportCsv(rows: Invoice[]) {
  if (chaos === 'event') throw new RangeError(`CSV export failed: invalid date in ${rows[0]?.number}`);
  const csv = rows.map((r) => [r.number, r.clientName, r.issued, r.due, r.totalCents / 100, r.status].join(',')).join('\n');
  console.log(csv);
}

// 3. An async error: a rejected promise nobody awaited. Only the global handler sees it.
export function loadExchangeRates(): Promise<void> {
  return new Promise((_, reject) => setTimeout(() => reject(new Error('rates.example.net: 503 Service Unavailable')), 900));
}
