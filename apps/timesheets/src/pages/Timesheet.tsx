import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@paperwing/session';
import { Button, Card, Stat, Table } from '@paperwing/ui';
import { bus } from '@paperwing/events';
import { clients, entries as seed, week, type Entry } from '../data/seed';

const dayName = (iso: string) => new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' });

export function Timesheet() {
  const { user } = useSession();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<Entry[]>(seed);
  const [clientId, setClientId] = useState(clients[0].id);
  const [date, setDate] = useState(week[4]);
  const [hours, setHours] = useState('2');
  const [note, setNote] = useState('');

  const total = entries.reduce((s, e) => s + e.hours, 0);
  const perDay = (d: string) => entries.filter((e) => e.date === d).reduce((s, e) => s + e.hours, 0);

  function log(e: FormEvent) {
    e.preventDefault();
    const h = Number(hours);
    if (!h || h <= 0) return;
    setEntries((list) => [...list, { id: `e${Date.now()}`, date, clientId, hours: h, note: note || 'Logged time' }]);
    // Cross-remote contract: Invoices listens for this. We never import Invoices.
    bus.emit('time:logged', { clientId, hours: h, date });
    setNote('');
  }

  if (!user) return <div className="pw-signedout" data-signedout><strong>Sign in to log time</strong>Same session as Invoices. Signing out there signs out here.</div>;

  return (
    <>
      <h1>Time <span className="pw-badge pw-badge-info" style={{ verticalAlign: 'middle' }}>logging as {user.name}</span></h1>
      <div className="pw-grid">
        <Stat label="This week" value={`${total}h`} hint={`${entries.length} entries`} />
        {week.slice(0, 5).map((d) => <Stat key={d} label={dayName(d)} value={`${perDay(d)}h`} />)}
      </div>
      <Card title="Log hours">
        <form className="pw-form" onSubmit={log}>
          <label>Client
            <select value={clientId} onChange={(e) => setClientId(e.target.value)}>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label>Date
            <select value={date} onChange={(e) => setDate(e.target.value)}>
              {week.map((d) => <option key={d} value={d}>{dayName(d)} {d.slice(5)}</option>)}
            </select>
          </label>
          <label>Hours
            <input type="number" min="0.25" step="0.25" value={hours} onChange={(e) => setHours(e.target.value)} />
          </label>
          <Button type="submit">Log time</Button>
          <label style={{ gridColumn: '1 / -1' }}>Note
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="What did you work on?" />
          </label>
        </form>
      </Card>
      <Card title="Entries" actions={<Button variant="ghost" id="to-invoices" onClick={() => navigate('/invoices?filter=draft')}>Invoice these hours →</Button>}>
        <Table head={['Date', 'Client', 'Note', 'Hours']}>
          {[...entries].reverse().map((e) => (
            <tr key={e.id}>
              <td className="pw-muted">{dayName(e.date)} {e.date.slice(5)}</td>
              <td>{clients.find((c) => c.id === e.clientId)?.name}</td>
              <td>{e.note}</td>
              <td className="num">{e.hours}h</td>
            </tr>
          ))}
        </Table>
      </Card>
    </>
  );
}
