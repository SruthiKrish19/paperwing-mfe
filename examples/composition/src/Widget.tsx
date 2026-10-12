import { useState } from 'react';

// The one widget we embed three ways: an "unbilled hours" card with a button that logs an hour.
export function Widget({ initialHours = 11.5, theme = 'light' }: { initialHours?: number; theme?: 'light' | 'dark' }) {
  const [hours, setHours] = useState(initialHours);
  return (
    <div className={`rw rw-${theme}`}>
      <div className="rw-label">Unbilled hours</div>
      <div className="rw-value">{hours}h</div>
      <button className="rw-btn" onClick={() => setHours((h) => Math.round((h + 1) * 10) / 10)}>Log 1h</button>
      <div className="rw-foot">React {String((globalThis as any).React?.version ?? '18')} · rendered by the Reports team</div>
    </div>
  );
}

export const widgetCss = `
.rw{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;border-radius:14px;padding:18px 20px;width:280px;box-sizing:border-box;border:1px solid #e3e8ee;background:#fff;color:#15202b}
.rw-dark{background:#121d33;color:#eef2f7;border-color:#2a3a57}
.rw-label{font-size:12px;letter-spacing:.04em;text-transform:uppercase;color:#5b6b7b}.rw-dark .rw-label{color:#9fb0c4}
.rw-value{font-size:34px;font-weight:700;margin:4px 0 10px}
.rw-btn{font:inherit;font-weight:600;border-radius:9px;padding:8px 14px;border:0;background:#2457d6;color:#fff;cursor:pointer}
.rw-foot{font-size:11px;color:#5b6b7b;margin-top:12px}.rw-dark .rw-foot{color:#9fb0c4}
`;
