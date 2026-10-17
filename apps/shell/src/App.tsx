import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { InvoicesRoute } from './routes/InvoicesRoute';
import { TimeRoute } from './routes/TimeRoute';
import { ReportsRoute } from './routes/ReportsRoute';
import { ErrorInbox } from '@paperwing/telemetry';

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
            <span className="pw-muted">Freelance invoicing, split into micro-frontends</span>
            <span style={{ display: 'flex', gap: 14, alignItems: 'center' }}><ErrorInbox /><span className="pw-muted">Signed in as you</span></span>
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
