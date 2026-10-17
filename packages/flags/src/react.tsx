import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { evaluate, type Decision, type FlagConfig } from './evaluate';

type Ctx = { config: FlagConfig; userId: string; loaded: boolean };
const FlagsContext = createContext<Ctx>({ config: {}, userId: 'anonymous', loaded: false });

// Polls a JSON file. A real provider streams changes over SSE or websockets; polling every few
// seconds gets you the same kill-switch behaviour for a static file.
export function FlagsProvider({ url, userId, pollMs = 10_000, children }: { url: string; userId: string; pollMs?: number; children: ReactNode }) {
  const [config, setConfig] = useState<FlagConfig>({});
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok && alive) { setConfig(await res.json()); setLoaded(true); }
      } catch { /* keep the last config we had; flags fail closed via `default` */ }
    };
    load();
    const t = setInterval(load, pollMs);
    return () => { alive = false; clearInterval(t); };
  }, [url, pollMs]);
  const value = useMemo(() => ({ config, userId, loaded }), [config, userId, loaded]);
  return <FlagsContext.Provider value={value}>{children}</FlagsContext.Provider>;
}

// ?flag.new-invoice-editor=on|off lets QA force a flag for their own session only.
function urlOverride(flag: string): boolean | undefined {
  if (typeof window === 'undefined') return undefined;
  const v = new URLSearchParams(window.location.search).get(`flag.${flag}`);
  return v === 'on' ? true : v === 'off' ? false : undefined;
}

export function useFlag(flag: string): Decision {
  const { config, userId } = useContext(FlagsContext);
  return evaluate(flag, config[flag], userId, urlOverride(flag));
}

export function useFlags(): Ctx { return useContext(FlagsContext); }
