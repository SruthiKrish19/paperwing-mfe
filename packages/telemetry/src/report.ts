// Error reporting. One function every boundary and global handler calls.
// Window-backed like the event bus: each remote bundles its own copy of this module,
// so the shared log and the subscriptions live on `window`, not in module state.
export type ErrorKind = 'render' | 'unhandled' | 'rejection' | 'manual';
export type ErrorReport = {
  id: string;            // short id the user can quote to support: "PW-7f3a"
  kind: ErrorKind;       // how it was caught
  message: string;
  stack?: string;
  boundary?: string;     // which boundary caught it (render errors only)
  release: string;       // build identifier: alerts are per release
  url: string;
  at: number;
  context?: Record<string, unknown>;
};

declare global { interface Window { __paperwingErrors?: ErrorReport[]; __paperwingRelease?: string } }
const EVENT = 'paperwing:error';
const log = (): ErrorReport[] => (window.__paperwingErrors ??= []);
let endpoint: string | undefined;

export function configureTelemetry(opts: { release: string; endpoint?: string }) {
  window.__paperwingRelease = opts.release; endpoint = opts.endpoint;
}
export const errorId = () => 'PW-' + Math.random().toString(16).slice(2, 6);

export function reportError(error: unknown, opts: { kind: ErrorKind; boundary?: string; context?: Record<string, unknown> } = { kind: 'manual' }): string {
  const err = error instanceof Error ? error : new Error(String(error));
  const report: ErrorReport = {
    id: errorId(), kind: opts.kind, message: err.message, stack: err.stack, boundary: opts.boundary,
    release: window.__paperwingRelease ?? 'unknown', url: location.pathname + location.search, at: Date.now(), context: opts.context,
  };
  log().push(report);
  window.dispatchEvent(new CustomEvent(EVENT, { detail: report }));
  // Production: ship it. sendBeacon survives page unloads and never blocks the UI.
  if (endpoint) navigator.sendBeacon(endpoint, JSON.stringify(report));
  console.error(`[${report.release}] ${report.kind} ${report.boundary ?? ''} ${report.id}:`, err);
  return report.id;
}

// Boundaries only see render errors. These two handlers catch the rest:
// exceptions thrown in event handlers and timers (error), and rejected promises nobody awaited.
export function installGlobalHandlers(): () => void {
  const onError = (e: ErrorEvent) => { reportError(e.error ?? new Error(e.message), { kind: 'unhandled', context: { source: `${e.filename}:${e.lineno}` } }); };
  const onRejection = (e: PromiseRejectionEvent) => { reportError(e.reason, { kind: 'rejection' }); };
  window.addEventListener('error', onError);
  window.addEventListener('unhandledrejection', onRejection);
  return () => { window.removeEventListener('error', onError); window.removeEventListener('unhandledrejection', onRejection); };
}

export function onErrorReport(cb: (r: ErrorReport) => void): () => void {
  const l = (e: Event) => cb((e as CustomEvent<ErrorReport>).detail);
  window.addEventListener(EVENT, l);
  return () => window.removeEventListener(EVENT, l);
}
export const errorLog = (): ErrorReport[] => [...log()];
