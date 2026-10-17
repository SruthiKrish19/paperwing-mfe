import { Profiler, useSyncExternalStore, type ReactNode } from 'react';

// Measurement harness. The React Profiler API reports every commit in the subtree with its
// actual render duration. Row components bump counters so we can see how many rendered.
type Stats = { commits: number; last: number; total: number; renders: number; mounts: number; nodes: number };
const stats: Stats = { commits: 0, last: 0, total: 0, renders: 0, mounts: 0, nodes: 0 };
const listeners = new Set<() => void>();
let snapshot = { ...stats };
const emit = () => { snapshot = { ...stats }; listeners.forEach((l) => l()); };
export const counters = { render: () => { stats.renders++; }, mount: () => { stats.mounts++; } };
export function resetStats() { Object.assign(stats, { commits: 0, last: 0, total: 0, renders: 0, mounts: 0 }); emit(); }

export function Lab({ children }: { children: ReactNode }) {
  return (
    <Profiler id="lab" onRender={(_id, _phase, actualDuration) => {
      stats.commits++; stats.last = actualDuration; stats.total += actualDuration;
      queueMicrotask(() => { stats.nodes = document.querySelectorAll('#root *').length; emit(); });
    }}>
      {children}
    </Profiler>
  );
}

const fmt = (ms: number) => (ms >= 100 ? ms.toFixed(0) : ms.toFixed(1));
export function StatsPanel({ hot }: { hot?: (s: Stats) => Partial<Record<keyof Stats, 'hot' | 'good'>> }) {
  const s = useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => snapshot);
  const tone = hot?.(s) ?? {};
  return (
    <aside className="card stats" id="stats" data-commits={s.commits} data-last={s.last.toFixed(2)} data-total={s.total.toFixed(2)} data-renders={s.renders} data-mounts={s.mounts} data-nodes={s.nodes}>
      <div className="stat"><span>last commit</span><b className={tone.last}>{fmt(s.last)} <small>ms</small></b></div>
      <div className="stat"><span>row renders</span><b className={tone.renders}>{s.renders.toLocaleString()}</b></div>
      <div className="stat"><span>row mounts</span><b className={tone.mounts}>{s.mounts.toLocaleString()}</b></div>
      <div className="stat"><span>DOM nodes</span><b className={tone.nodes}>{s.nodes.toLocaleString()}</b></div>
      <div className="stat"><span>commits</span><b>{s.commits}</b></div>
      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}><button id="reset" onClick={resetStats}>Reset counters</button></div>
    </aside>
  );
}
