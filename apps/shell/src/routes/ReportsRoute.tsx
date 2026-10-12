import { lazy, Suspense } from 'react';
import { RemoteBoundary } from '../RemoteBoundary';

// A single widget loaded over the network from the Time team's deployment, rendered with the shell's React.
const ReportsWidget = lazy(() => import('timesheets/Widget'));

export function ReportsRoute() {
  return (
    <>
      <h1>Reports</h1>
      <p className="pw-muted" style={{ marginBottom: 16 }}>This card is a federated module from the Time remote. Same React instance, shared UI package, loaded at runtime.</p>
      <RemoteBoundary name="Reports">
        <Suspense fallback={<p className="pw-muted">Loading reports…</p>}>
          <ReportsWidget />
        </Suspense>
      </RemoteBoundary>
    </>
  );
}
