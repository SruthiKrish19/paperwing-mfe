import { counters } from './lab';
import { makeRows, type Row } from './data';

// FIX 1 (video order): hoist the expensive thing. `new Intl.NumberFormat(...)` is slow to construct.
// Building one per cell, twice per row, 5,000 rows, is 10,000 constructions per render.
// The fix is not useMemo. It's one formatter, created once, at module level.
const rows = makeRows(5000);

const moneyBefore = (cents: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
const nf = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const moneyAfter = (cents: number) => nf.format(cents / 100);

function Table({ money }: { money: (c: number) => string }) {
  return (
    <div className="scroll"><table><thead><tr><th>Number</th><th>Client</th><th>Total</th><th>Tax</th></tr></thead><tbody>
      {rows.map((r: Row) => { counters.render(); return <tr key={r.id}><td>{r.number}</td><td>{r.client}</td><td className="num">{money(r.totalCents)}</td><td className="num">{money(r.taxCents)}</td></tr>; })}
    </tbody></table></div>
  );
}
export function Before() {
  return <><p className="explain">Before: a new Intl.NumberFormat per cell. 10,000 of them for this table.</p><div className="toolbar"><span className="badge bad">formatter built per cell</span></div><Table money={moneyBefore} /></>;
}
export function After() {
  return <><p className="explain">After: one formatter, created once. Same output.</p><div className="toolbar"><span className="badge good">formatter hoisted</span></div><Table money={moneyAfter} /></>;
}
