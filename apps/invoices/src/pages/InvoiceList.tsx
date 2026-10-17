import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSession } from '@paperwing/session';
import { Badge, Card, Stat, Table, Button, formatMoney, type Tone } from '@paperwing/ui';

import { bus } from '@paperwing/events';
import { useFlag } from '@paperwing/flags';
import { ErrorBoundary } from '@paperwing/telemetry';
import { chaos, InvoiceRow, exportCsv, loadExchangeRates } from './chaos';
import { InvoiceEditor } from './InvoiceEditor';
import { LegacyInvoiceForm } from './LegacyInvoiceForm';
import { clients, invoices as seed, unbilledHoursAtStart, type Invoice, type InvoiceStatus } from '../data/seed';

const tone: Record<InvoiceStatus, Tone> = { draft: 'neutral', sent: 'info', paid: 'success', overdue: 'danger' };

export function InvoiceList() {
  // The URL is shared state everyone already has. Time deep-links here with ?filter=draft.
  const [params, setParams] = useSearchParams();
  const filter = (params.get('filter') as InvoiceStatus | 'all' | null) ?? 'all';
  const setFilter = (f: InvoiceStatus | 'all') => setParams((p) => { f === 'all' ? p.delete('filter') : p.set('filter', f); return p; }, { replace: true });
  // Read-only view of the session the shell owns. No token in here, ever.
  const { user } = useSession();
  const [all, setAll] = useState<Invoice[]>(seed);
  const [creating, setCreating] = useState(false);
  // The flag decides which editor renders. Both paths ship; the config says which one runs.
  const editor = useFlag('new-invoice-editor');
  function create(clientId: string, totalCents: number) {
    const n = 48 + (all.length - seed.length);
    setAll((list) => [...list, { id: `i${Date.now()}`, number: `PW-00${n}`, clientId, clientName: clients.find((c) => c.id === clientId)?.name ?? '', issued: '2026-10-17', due: '2026-10-31', totalCents, status: 'draft' }]);
    setCreating(false);
  }
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

  // Demo: ?chaos=async rejects a promise nobody awaits. Boundaries never see it; the global handler does.
  useEffect(() => { if (chaos === 'async') loadExchangeRates().then(() => {}); }, []);

  const unbilled = Math.round((unbilledHoursAtStart + Object.values(logged).reduce((a, b) => a + b, 0)) * 100) / 100;

  const rows = useMemo(() => (filter === 'all' ? all : all.filter((i) => i.status === filter)), [filter, all]);
  const outstanding = seed.filter((i) => i.status === 'sent' || i.status === 'overdue').reduce((s, i) => s + i.totalCents, 0);

  if (!user) return <div className="pw-signedout" data-signedout><strong>Sign in to see invoices</strong>The Invoices team never handles sign-in. The shell does, once, for everyone.</div>;

  return (
    <>
      <h1>Invoices <span className="pw-badge pw-badge-info" style={{ verticalAlign: 'middle' }}>{user.name} · {user.plan}</span></h1>
      <div className="pw-grid">
        <Stat label="Outstanding" value={formatMoney(outstanding)} hint={`${seed.filter((i) => i.status === 'overdue').length} overdue`} />
        <Stat label="Unbilled hours" value={`${unbilled}h`} hint={lastEvent ?? 'Logged in Time, not yet invoiced'} />
        <Stat label="Paid this quarter" value={formatMoney(seed.filter((i) => i.status === 'paid').reduce((s, i) => s + i.totalCents, 0))} />
      </div>
      <Card
        title="New invoice"
        actions={<>
          <span className="pw-muted pw-flag-hint" data-on={editor.on}>editor: {editor.on ? 'new' : 'legacy'} · {editor.reason}{editor.reason === 'rollout' ? ` (bucket ${editor.bucket})` : ''}</span>
          <Button variant={creating ? 'ghost' : 'primary'} onClick={() => setCreating((c) => !c)}>{creating ? 'Cancel' : 'New invoice'}</Button>
        </>}
      >
        {creating ? (editor.on ? <InvoiceEditor onCreate={create} /> : <LegacyInvoiceForm onCreate={create} />) : <p className="pw-muted" style={{ margin: 0 }}>Draft an invoice from logged time or from scratch.</p>}
      </Card>
      <Card
        title="All invoices"
        actions={<>
          {(['all', 'draft', 'sent', 'paid', 'overdue'] as const).map((f) => (
            <Button key={f} variant={filter === f ? 'primary' : 'ghost'} onClick={() => setFilter(f)}>{f}</Button>
          ))}
          <Button variant="ghost" onClick={() => exportCsv(rows)}>Export CSV</Button>
        </>}
      >
        {chaos === 'render' && new URLSearchParams(location.search).get('boundary') === 'off' ? (
          <InvoiceTable rows={rows} />
        ) : (
          <ErrorBoundary
            name="invoice-table"
            resetKeys={[filter]}
            fallback={({ id, reset }) => (
              <div className="pw-fallback" role="alert">
                <strong>The invoice list couldn't be shown.</strong>
                Your totals above are correct, and Time and Reports are unaffected. Quote <code>{id}</code> if you contact support.
                <div style={{ marginTop: 12 }}><button className="pw-btn pw-btn-ghost" onClick={() => { window.__chaosArmed = false; reset(); }}>Try again</button></div>
              </div>
            )}
          >
            <InvoiceTable rows={rows} />
          </ErrorBoundary>
        )}
      </Card>
    </>
  );
}

function InvoiceTable({ rows }: { rows: Invoice[] }) {
  return (
    <Table head={['Number', 'Client', 'Issued', 'Due', 'Total', 'Status']}>
      {rows.map((i) => <InvoiceRow key={i.id} invoice={i} tone={tone[i.status]} />)}
    </Table>
  );
}
