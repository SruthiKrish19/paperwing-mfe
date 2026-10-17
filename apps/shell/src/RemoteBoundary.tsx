import type { ReactNode } from 'react';
import { ErrorBoundary } from '@paperwing/telemetry';

// One boundary per remote: the coarse safety net. A remote that fails to load or throws
// on render becomes one broken section, not a blank page. Finer boundaries live inside the remotes.
export function RemoteBoundary({ name, children }: { name: string; children: ReactNode }) {
  return (
    <ErrorBoundary
      name={`remote:${name}`}
      fallback={({ id, reset }) => (
        <div className="pw-fallback" role="alert">
          <strong>{name} is unavailable.</strong>
          The rest of Paperwing still works. Quote <code>{id}</code> if you contact support.
          <div style={{ marginTop: 12 }}><button className="pw-btn pw-btn-ghost" onClick={reset}>Try again</button></div>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
