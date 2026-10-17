import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { counters } from './lab';
import { makeRows, type Row } from './data';

// FIX 4 (video order): context granularity. One Settings context holding currency AND theme, with its state
// in the same component that renders the table, means every theme toggle re-renders all 2,000
// rows: once because the parent re-rendered, and again because the context object changed.
// Fix: split the contexts, and give the theme its own provider component that renders
// `children`. The toggle re-renders the provider and the button. Rows: zero.
const rows = makeRows(2000);
type Settings = { currency: string; theme: 'light' | 'dark'; toggleTheme: () => void };
const SettingsCtx = createContext<Settings>({ currency: 'USD', theme: 'light', toggleTheme: () => {} });
const CurrencyCtx = createContext('USD');
const ThemeCtx = createContext<{ theme: 'light' | 'dark'; toggleTheme: () => void }>({ theme: 'light', toggleTheme: () => {} });

const formatters: Record<string, Intl.NumberFormat> = { USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }) };

function RowBefore({ r }: { r: Row }) {
  counters.render();
  const { currency } = useContext(SettingsCtx);               // subscribes to the whole object
  return <tr><td>{r.number}</td><td>{r.client}</td><td className="num">{formatters[currency].format(r.totalCents / 100)}</td></tr>;
}
function RowAfter({ r }: { r: Row }) {
  counters.render();
  const currency = useContext(CurrencyCtx);                   // subscribes to currency only
  return <tr><td>{r.number}</td><td>{r.client}</td><td className="num">{formatters[currency].format(r.totalCents / 100)}</td></tr>;
}
function ThemeButton({ theme, toggle }: { theme: string; toggle: () => void }) {
  return <button id="theme" className="primary" onClick={toggle}>Theme: {theme}</button>;
}
function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const toggleTheme = () => setTheme((t) => { const n = t === 'light' ? 'dark' : 'light'; document.body.classList.toggle('dark', n === 'dark'); return n; });
  return { theme, toggleTheme };
}
const Table = ({ children }: { children: ReactNode }) => <div className="scroll"><table><tbody>{children}</tbody></table></div>;

export function Before() {
  const { theme, toggleTheme } = useTheme();
  return (
    <SettingsCtx.Provider value={{ currency: 'USD', theme, toggleTheme }}>   {/* new object every render */}
      <p className="explain">Before: one context for everything. Toggling the theme re-renders all 2,000 rows that only wanted the currency.</p>
      <div className="toolbar"><ThemeButton theme={theme} toggle={toggleTheme} /><span className="badge bad">rows re-render on theme change</span></div>
      <Table>{rows.map((r) => <RowBefore key={r.id} r={r} />)}</Table>
    </SettingsCtx.Provider>
  );
}
// The provider owns the theme state and renders `children`. When it re-renders, the children
// elements are the same objects as before, so React skips them entirely.
function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}
function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeCtx);        // the only theme consumer
  return <ThemeButton theme={theme} toggle={toggleTheme} />;
}
export function After() {
  return (
    <CurrencyCtx.Provider value="USD">
      <ThemeProvider>
        <p className="explain">After: separate contexts, and the theme state lives in a provider that renders children. The toggle re-renders the button. Rows: zero.</p>
        <div className="toolbar"><ThemeToggle /><span className="badge good">rows untouched</span></div>
        <Table>{rows.map((r) => <RowAfter key={r.id} r={r} />)}</Table>
      </ThemeProvider>
    </CurrencyCtx.Provider>
  );
}
