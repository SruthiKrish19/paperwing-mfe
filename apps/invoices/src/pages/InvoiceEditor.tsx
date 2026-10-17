import { useState, type FormEvent } from 'react';
import { Button, formatMoney } from '@paperwing/ui';
import { clients } from '../data/seed';

type Line = { id: number; description: string; qty: number; rate: number };
const blank = (id: number): Line => ({ id, description: '', qty: 1, rate: 120 });

// The new path, behind the `new-invoice-editor` flag: line items, live total, due date.
export function InvoiceEditor({ onCreate }: { onCreate: (clientId: string, totalCents: number) => void }) {
  const [clientId, setClientId] = useState(clients[0].id);
  const [lines, setLines] = useState<Line[]>([{ ...blank(1), description: 'Design review', qty: 4 }]);
  const total = lines.reduce((s, l) => s + l.qty * l.rate, 0);
  const update = (id: number, patch: Partial<Line>) => setLines((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  function submit(e: FormEvent) { e.preventDefault(); onCreate(clientId, Math.round(total * 100)); }
  return (
    <form onSubmit={submit} data-editor="new" className="pw-editor">
      <div className="pw-form" style={{ gridTemplateColumns: '2fr 1fr 1fr' }}>
        <label>Client
          <select value={clientId} onChange={(e) => setClientId(e.target.value)}>{clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        </label>
        <label>Issued<input type="date" defaultValue="2026-10-17" /></label>
        <label>Due<input type="date" defaultValue="2026-10-31" /></label>
      </div>
      <table className="pw-table" style={{ marginTop: 12 }}>
        <thead><tr><th>Description</th><th>Qty</th><th>Rate</th><th className="num">Amount</th></tr></thead>
        <tbody>
          {lines.map((l) => (
            <tr key={l.id}>
              <td><input className="pw-input" placeholder="What was done" value={l.description} onChange={(e) => update(l.id, { description: e.target.value })} /></td>
              <td><input className="pw-input" type="number" min="0" step="0.5" value={l.qty} onChange={(e) => update(l.id, { qty: Number(e.target.value) })} style={{ width: 80 }} /></td>
              <td><input className="pw-input" type="number" min="0" value={l.rate} onChange={(e) => update(l.id, { rate: Number(e.target.value) })} style={{ width: 100 }} /></td>
              <td className="num">{formatMoney(Math.round(l.qty * l.rate * 100))}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
        <Button type="button" variant="ghost" onClick={() => setLines((ls) => [...ls, blank(Date.now())])}>+ Add line</Button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <strong style={{ fontSize: 18 }}>Total {formatMoney(Math.round(total * 100))}</strong>
          <Button type="submit">Create invoice</Button>
        </div>
      </div>
    </form>
  );
}
