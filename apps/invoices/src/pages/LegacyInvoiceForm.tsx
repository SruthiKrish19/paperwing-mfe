import { useState, type FormEvent } from 'react';
import { Button } from '@paperwing/ui';
import { clients } from '../data/seed';

// The old path. One client, one amount. Stays in the tree until the flag is removed.
export function LegacyInvoiceForm({ onCreate }: { onCreate: (clientId: string, totalCents: number) => void }) {
  const [clientId, setClientId] = useState(clients[0].id);
  const [amount, setAmount] = useState('1200');
  function submit(e: FormEvent) { e.preventDefault(); onCreate(clientId, Math.round(Number(amount) * 100)); }
  return (
    <form className="pw-form" onSubmit={submit} data-editor="legacy">
      <label>Client
        <select value={clientId} onChange={(e) => setClientId(e.target.value)}>{clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
      </label>
      <label>Amount (USD)<input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} /></label>
      <span />
      <Button type="submit">Create invoice</Button>
    </form>
  );
}
