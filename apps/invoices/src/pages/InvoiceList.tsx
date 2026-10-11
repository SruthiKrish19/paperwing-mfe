import { useEffect, useMemo, useState } from 'react';
import { Badge, Card, Stat, Table, Button, formatMoney, type Tone } from '@paperwing/ui';

import { bus } from '@paperwing/events';
import { invoices as seed, unbilledHoursAtStart, type Invoice, type InvoiceStatus } from '../data/seed';

const tone: Record<InvoiceStatus, Tone> = { draft: 'neutral', sent: 'info', paid: 'success', overdue: 'danger' };

export function InvoiceList() {
  const [filter, setFilter] = useState<InvoiceStatus | 'all'>('all');
  // Hours logged in the Time remote since the page loaded, keyed by event id so a replayed
  // event (or React StrictMode's double effect) is never counted twice.
  const [logged, setLogged] = useState<Record<string, number>>({});
  const [lastEvent, setLastEvent] = useState<string | null>(null);

  // Cross-remote contract: the Time remote emits time:logged; we never import it.
  // replay: true catches up on events fired while this remote was not mounted.
  useEffect(() => bus.on('time:logged', ({ hours, clientId }, meta) => {
    setLogged((m) => (meta.id in m ? m : { ...m, [meta.id]: hours }));
    if (!meta.replayed) setLastEvent(`+${hours}h for ${clientId} at ${new Date(meta.at).toLocaleTimeString()}`);
  }, { replay: true }), []);

  const unbilled = Math.round((unbilledHoursAtStart + Object.values(logged).reduce((a, b) => a + b, 0)) * 100) / 100;

  const rows = useMemo(() => (filter === 'all' ? seed : seed.filter((i) => i.status === filter)), [filter]);
  const outstanding = seed.filter((i) => i.status === 'sent' || i.status === 'overdue').reduce((s, i) => s + i.totalCents, 0);

  return (
    <>
      <h1>Invoices</h1>
      <div className="pw-grid">
        <Stat label="Outstanding" value={formatMoney(outstanding)} hint={`${seed.filter((i) => i.status === 'overdue').length} overdue`} />
        <Stat label="Unbilled hours" value={`${unbilled}h`} hint={lastEvent ?? 'Logged in Time, not yet invoiced'} />
        <Stat label="Paid this quarter" value={formatMoney(seed.filter((i) => i.status === 'paid').reduce((s, i) => s + i.totalCents, 0))} />
      </div>
      <Card
        title="All invoices"
        actions={(['all', 'draft', 'sent', 'paid', 'overdue'] as const).map((f) => (
          <Button key={f} variant={filter === f ? 'primary' : 'ghost'} onClick={() => setFilter(f)}>{f}</Button>
        ))}
      >
        <Table head={['Number', 'Client', 'Issued', 'Due', 'Total', 'Status']}>
          {rows.map((i: Invoice) => (
            <tr key={i.id}>
              <td><strong>{i.number}</strong></td>
              <td>{i.clientName}</td>
              <td className="pw-muted">{i.issued}</td>
              <td className="pw-muted">{i.due}</td>
              <td className="num">{formatMoney(i.totalCents)}</td>
              <td><Badge tone={tone[i.status]}>{i.status}</Badge></td>
            </tr>
          ))}
        </Table>
      </Card>
    </>
  );
}
