// The session: who is signed in, owned by the shell, readable by every remote.
//
// Rules this package enforces by shape:
// 1. One owner. Only the shell calls signIn/signOut. Remotes get a read-only hook.
// 2. Window-backed, like the event bus: each remote bundles its own copy of this module,
//    so the store lives on `window`, not in module state.
// 3. The token never leaves this file. Remotes call authFetch; they never see the header.
import { useSyncExternalStore } from 'react';

export type User = { id: string; name: string; plan: 'free' | 'pro' };
export type Session = { user: User | null };
type Store = { session: Session; token: string | null; listeners: Set<() => void> };

declare global { interface Window { __paperwingSession?: Store } }
const KEY = 'paperwing.session';
const EMPTY: Session = { user: null };

function store(): Store {
  if (!window.__paperwingSession) {
    let saved: { session: Session; token: string | null } | null = null;
    try { saved = JSON.parse(sessionStorage.getItem(KEY) ?? 'null'); } catch { /* ignore */ }
    window.__paperwingSession = { session: saved?.session ?? EMPTY, token: saved?.token ?? null, listeners: new Set() };
  }
  return window.__paperwingSession;
}
function commit(s: Store, session: Session, token: string | null) {
  s.session = session; s.token = token;
  sessionStorage.setItem(KEY, JSON.stringify({ session, token }));
  s.listeners.forEach((l) => l());
}

// --- shell only ---------------------------------------------------------------------------
export function signIn(user: User, token: string) { commit(store(), { user }, token); }
export function signOut() { commit(store(), EMPTY, null); }

// --- every remote -------------------------------------------------------------------------
export function getSession(): Session { return store().session; }
export function subscribe(cb: () => void): () => void { const s = store(); s.listeners.add(cb); return () => s.listeners.delete(cb); }
export function useSession(): Session { return useSyncExternalStore(subscribe, getSession, getSession); }

// Remotes call the API through this. The token is attached here and nowhere else, so rotating
// it, moving it to a cookie, or adding a refresh step is a change in one package.
export function authFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const token = store().token;
  const headers = new Headers(init.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return fetch(input, { ...init, headers });
}
