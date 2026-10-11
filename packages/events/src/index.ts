// Typed event bus for cross-remote communication.
//
// Two deliberate choices:
// 1. It is backed by window events. Every remote bundles its own copy of this module, so a
//    module-level EventTarget would not be shared. The browser window is.
// 2. It keeps a short log of past events on window. A remote that is mounted later (the user
//    visited Time before Invoices) can subscribe with { replay: true } and catch up.
export type PaperwingEvents = {
  'time:logged': { clientId: string; hours: number; date: string };
  'invoice:created': { invoiceId: string; clientId: string };
};

export type EventMeta = { id: string; at: number; replayed: boolean };
type Envelope<K extends keyof PaperwingEvents = keyof PaperwingEvents> = { id: string; name: K; payload: PaperwingEvents[K]; at: number };

declare global {
  interface Window { __paperwingEventLog?: Envelope[] }
}

const PREFIX = 'paperwing:';
const LOG_LIMIT = 200;
const log = (): Envelope[] => (window.__paperwingEventLog ??= []);
const newId = () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

export const bus = {
  emit<K extends keyof PaperwingEvents>(name: K, payload: PaperwingEvents[K]): void {
    const envelope: Envelope<K> = { id: newId(), name, payload, at: Date.now() };
    const l = log();
    l.push(envelope);
    if (l.length > LOG_LIMIT) l.shift();
    window.dispatchEvent(new CustomEvent(PREFIX + name, { detail: envelope }));
  },

  on<K extends keyof PaperwingEvents>(
    name: K,
    handler: (payload: PaperwingEvents[K], meta: EventMeta) => void,
    options: { replay?: boolean } = {},
  ): () => void {
    if (options.replay) {
      for (const e of log()) if (e.name === name) handler(e.payload as PaperwingEvents[K], { id: e.id, at: e.at, replayed: true });
    }
    const listener = (e: Event) => {
      const env = (e as CustomEvent<Envelope<K>>).detail;
      handler(env.payload, { id: env.id, at: env.at, replayed: false });
    };
    window.addEventListener(PREFIX + name, listener);
    return () => window.removeEventListener(PREFIX + name, listener);
  },
};
