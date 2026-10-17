import { useState } from 'react';
import { counters } from './lab';
import { makeRows, type Row } from './data';

// FIX 3 (video order): state colocation. A "quick note" input whose state lives on the page re-renders
// the 2,000-row table on every keystroke. The table has nothing to do with the note.
const rows = makeRows(2000);
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

function InvoiceRow({ r }: { r: Row }) {
  counters.render();
  return <tr><td>{r.number}</td><td>{r.client}</td><td className="num">{money.format(r.totalCents / 100)}</td><td><span className="badge">{r.status}</span></td></tr>;
}
function BigTable() {
  return <div className="scroll"><table><thead><tr><th>Number</th><th>Client</th><th>Total</th><th>Status</th></tr></thead><tbody>{rows.map((r) => <InvoiceRow key={r.id} r={r} />)}</tbody></table></div>;
}

export function Before() {
  const [note, setNote] = useState('');                       // page-level state...
  return (
    <>
      <p className="explain">Before: the note's state lives on the page. Every keystroke re-renders the page, and the table with it.</p>
      <div className="toolbar"><input id="note" placeholder="Quick note…" value={note} onChange={(e) => setNote(e.target.value)} style={{ width: 360 }} /><span className="badge bad">table re-renders on each key</span></div>
      <BigTable />                                              {/* ...so this re-renders too */}
    </>
  );
}

function QuickNote() {
  const [note, setNote] = useState('');                       // state moved to the component that uses it
  return <input id="note" placeholder="Quick note…" value={note} onChange={(e) => setNote(e.target.value)} style={{ width: 360 }} />;
}
export function After() {
  return (
    <>
      <p className="explain">After: the state moved into QuickNote. Typing re-renders one input. No memo anywhere.</p>
      <div className="toolbar"><QuickNote /><span className="badge good">table untouched</span></div>
      <BigTable />
    </>
  );
}
