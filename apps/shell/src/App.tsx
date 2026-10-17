import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { InvoicesRoute } from './routes/InvoicesRoute';
import { TimeRoute } from './routes/TimeRoute';
import { ReportsRoute } from './routes/ReportsRoute';
import { ErrorInbox } from '@paperwing/telemetry';
import { SessionMenu } from './SessionMenu';
import { useLocation } from 'react-router-dom';

// Demo affordance: show the URL, because the URL is shared state too.
function UrlReadout() { const l = useLocation(); return <code className="pw-url">{l.pathname}{l.search}</code>; }

export default function App() {
  return (
    <BrowserRouter>
      <div className="pw-shell">
        <aside className="pw-side">
          <div className="pw-brand"><i />Paperwing</div>
          <NavLink to="/" end className="pw-nav">Overview</NavLink>
          <NavLink to="/invoices" className="pw-nav">Invoices</NavLink>
          <NavLink to="/time" className="pw-nav">Time</NavLink>
          <NavLink to="/reports" className="pw-nav">Reports</NavLink>
          <div className="pw-side-foot">shell · 3 deployments</div>
        </aside>
        <div className="pw-main">
          <header className="pw-top">
            <span className="pw-muted" style={{ display: 'flex', gap: 14, alignItems: 'center' }}>Freelance invoicing, split into micro-frontends <UrlReadout /></span>
            <span style={{ display: 'flex', gap: 14, alignItems: 'center' }}><ErrorInbox /><SessionMenu /></span>
          </header>
          <main className="pw-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/invoices/*" element={<InvoicesRoute />} />
              <Route path="/time/*" element={<TimeRoute />} />
              <Route path="/reports" element={<ReportsRoute />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
