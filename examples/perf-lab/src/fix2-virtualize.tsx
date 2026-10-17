import { useRef, useState } from 'react';
import { counters } from './lab';
import { makeRows, type Row } from './data';

// FIX 2 (video order): windowing. 5,000 rows is 5,000 <tr> and ~30,000 DOM nodes the user cannot see.
// Render only what fits in the viewport plus a little overscan. 40 lines, no library.
const rows = makeRows(5000);
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const ROW = 36, HEIGHT = 520, OVERSCAN = 6;

function InvoiceRow({ r, top }: { r: Row; top?: number }) {
  counters.render();
  const style = top === undefined ? undefined : { position: 'absolute' as const, top, left: 0, right: 0, height: ROW, display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr', alignItems: 'center', padding: '0 8px', borderBottom: '1px solid var(--line)', fontSize: 14 };
  if (top === undefined) return <tr><td>{r.number}</td><td>{r.client}</td><td className="num">{money.format(r.totalCents / 100)}</td><td><span className="badge">{r.status}</span></td></tr>;
  return <div style={style}><span>{r.number}</span><span>{r.client}</span><span className="num">{money.format(r.totalCents / 100)}</span><span><span className="badge">{r.status}</span></span></div>;
}

export function Before() {
  return (
    <>
      <p className="explain">Before: all 5,000 rows in the DOM. The user sees 14 of them.</p>
      <div className="toolbar"><span className="badge bad">5,000 rows rendered</span></div>
      <div className="scroll" id="list"><table><tbody>{rows.map((r) => <InvoiceRow key={r.id} r={r} />)}</tbody></table></div>
    </>
  );
}

export function After() {
  const [scrollTop, setScrollTop] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const start = Math.max(0, Math.floor(scrollTop / ROW) - OVERSCAN);
  const end = Math.min(rows.length, Math.ceil((scrollTop + HEIGHT) / ROW) + OVERSCAN);
  return (
    <>
      <p className="explain">After: only rows {start + 1} to {end} exist. Scroll position decides which. Total height is faked with one tall div.</p>
      <div className="toolbar"><span className="badge good">{end - start} rows rendered</span></div>
      <div className="scroll" id="list" ref={ref} onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)} style={{ position: 'relative' }}>
        <div style={{ height: rows.length * ROW, position: 'relative' }}>
          {rows.slice(start, end).map((r, i) => <InvoiceRow key={r.id} r={r} top={(start + i) * ROW} />)}
        </div>
      </div>
    </>
  );
}
