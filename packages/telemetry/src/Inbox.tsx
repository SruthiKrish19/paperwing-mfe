import { useEffect, useState } from 'react';
import { errorLog, onErrorReport, type ErrorReport } from './report';

// Demo-only view of what got reported. In production the same reports go to your
// error service; this panel exists so the video can show them without a backend.
export function ErrorInbox() {
  const [items, setItems] = useState<ErrorReport[]>(errorLog);
  const [open, setOpen] = useState(false);
  useEffect(() => onErrorReport((r) => setItems((l) => [...l, r])), []);
  return (
    <div className="pw-inbox">
      <button className="pw-inbox-btn" data-count={items.length} onClick={() => setOpen((o) => !o)}>
        Errors <b>{items.length}</b>
      </button>
      {open && (
        <div className="pw-inbox-panel" role="dialog">
          <div className="pw-inbox-head">reported this session · release <code>{window.__paperwingRelease}</code></div>
          {items.length === 0 && <p className="pw-muted">Nothing reported.</p>}
          {[...items].reverse().map((r) => (
            <div key={r.id} className="pw-inbox-item">
              <div><span className={`pw-badge pw-badge-${r.kind === 'render' ? 'danger' : 'warning'}`}>{r.kind}</span> <code>{r.id}</code> {r.boundary && <span className="pw-muted">boundary: {r.boundary}</span>}</div>
              <div className="pw-inbox-msg">{r.message}</div>
              <div className="pw-muted" style={{ fontSize: 12 }}>{r.url} · {new Date(r.at).toLocaleTimeString()}</div>
            </div>
          ))}
          <p className="pw-muted" style={{ fontSize: 12, marginBottom: 0 }}>Production: each report is POSTed to your error endpoint with sendBeacon.</p>
        </div>
      )}
    </div>
  );
}
