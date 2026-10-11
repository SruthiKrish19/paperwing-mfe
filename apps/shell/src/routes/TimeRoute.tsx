import { lazy, Suspense } from 'react';
import { RemoteBoundary } from '../RemoteBoundary';

const TimesheetsApp = lazy(() => import('timesheets/App'));

export function TimeRoute() {
  return (
    <RemoteBoundary name="Time">
      <Suspense fallback={<p className="pw-muted">Loading time…</p>}>
        <TimesheetsApp />
      </Suspense>
    </RemoteBoundary>
  );
}
