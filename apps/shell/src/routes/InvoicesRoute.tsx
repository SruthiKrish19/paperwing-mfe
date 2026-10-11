import { lazy, Suspense } from 'react';
import { RemoteBoundary } from '../RemoteBoundary';

// Loaded over the network from the Invoices team's deployment at request time.
// To React this is an ordinary lazy component.
const InvoicesApp = lazy(() => import('invoices/App'));

export function InvoicesRoute() {
  return (
    <RemoteBoundary name="Invoices">
      <Suspense fallback={<p className="pw-muted">Loading invoices…</p>}>
        <InvoicesApp />
      </Suspense>
    </RemoteBoundary>
  );
}
