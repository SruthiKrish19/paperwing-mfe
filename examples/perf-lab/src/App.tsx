import { Lab, StatsPanel } from './lab';
import * as F1 from './fix1-colocation';
import * as F2 from './fix2-virtualize';
import * as F3 from './fix3-formatter';
import * as F4 from './fix4-keys';
import * as F5 from './fix5-context';

const FIXES = [
  { n: 1, title: 'Hoist the expensive thing', sub: 'one formatter, not ten thousand', mod: F3 },
  { n: 2, title: 'Windowing', sub: 'render what fits on screen', mod: F2 },
  { n: 3, title: 'State colocation', sub: 'move state to where it is used', mod: F1 },
  { n: 4, title: 'Context granularity', sub: 'split contexts, provider renders children', mod: F5 },
  { n: 5, title: 'Stable keys', sub: 'key by id, never by index', mod: F4 },
];
const params = new URLSearchParams(location.search);
const fix = FIXES.find((f) => String(f.n) === (params.get('fix') ?? '1')) ?? FIXES[0];
const mode = params.get('mode') === 'after' ? 'after' : 'before';

export function App() {
  const View = mode === 'after' ? fix.mod.After : fix.mod.Before;
  return (
    <div className="lab">
      <main>
        <h1>Fix {fix.n} · {fix.title}<small>{fix.sub}</small></h1>
        <div className="mode"><a className={mode === 'before' ? 'on' : ''} href={`?fix=${fix.n}&mode=before`}>before</a><a className={mode === 'after' ? 'on' : ''} href={`?fix=${fix.n}&mode=after`}>after</a></div>
        <div className="card"><Lab><View /></Lab></div>
      </main>
      <StatsPanel />
    </div>
  );
}
