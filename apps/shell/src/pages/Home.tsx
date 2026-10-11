import { Link } from 'react-router-dom';
import { Card } from '@paperwing/ui';

export function Home() {
  return (
    <>
      <h1>Good morning</h1>
      <div className="pw-grid">
        <Card title="Invoices"><p className="pw-muted">Owned by the Invoices team. Loaded from its own deployment.</p><Link to="/invoices">Open invoices →</Link></Card>
        <Card title="Time"><p className="pw-muted">Owned by the Time team. Loaded from its own deployment.</p><Link to="/time">Open timesheet →</Link></Card>
        <Card title="Shell"><p className="pw-muted">Navigation, layout, routing and error isolation live here. Nothing else.</p></Card>
      </div>
    </>
  );
}
