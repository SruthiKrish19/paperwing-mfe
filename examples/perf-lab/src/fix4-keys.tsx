import { useEffect, useState } from 'react';
import { counters } from './lab';
import { makeRows, type Row } from './data';

// FIX 5 (video order): stable keys. With key={index}, sorting the list makes React keep row 1's component
// and DOM for whatever invoice is now first: its input keeps the old text next to a different
// invoice, and React rewrites the content of all 300 rows. With key={id}, React moves the
// existing rows instead, and the input travels with its invoice. Same render count, but
// with ids the result is correct and the DOM work is moves, not rewrites.
const rows = makeRows(300);
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

function InvoiceRow({ r }: { r: Row }) {
  counters.render();
  useEffect(() => { counters.mount(); }, []);
  return <tr><td>{r.number}</td><td>{r.client}</td><td className="num">{money.format(r.totalCents / 100)}</td><td><input placeholder="internal note" style={{ padding: '4px 8px', width: 220 }} /></td></tr>;
}

function Table({ keyed }: { keyed: 'index' | 'id' }) {
  const [sorted, setSorted] = useState(false);
  const list = sorted ? [...rows].sort((a, b) => b.totalCents - a.totalCents) : rows;
  return (
    <>
      <div className="toolbar">
        <button id="sort" className="primary" onClick={() => setSorted((s) => !s)}>{sorted ? 'Original order' : 'Sort by total'}</button>
        <span className={`badge ${keyed === 'index' ? 'bad' : 'good'}`}>key=&#123;{keyed}&#125;</span>
      </div>
      <div className="scroll"><table><thead><tr><th>Number</th><th>Client</th><th>Total</th><th>Note (type here, then sort)</th></tr></thead><tbody>
        {list.map((r, i) => <InvoiceRow key={keyed === 'index' ? i : r.id} r={r} />)}
      </tbody></table></div>
    </>
  );
}
export function Before() { return <><p className="explain">Before: key is the array index. Type a note in row 1, sort, and watch the note stay in row 1 next to a different invoice.</p><Table keyed="index" /></>; }
export function After() { return <><p className="explain">After: key is the invoice id. The note travels with its invoice, and nothing remounts.</p><Table keyed="id" /></>; }
